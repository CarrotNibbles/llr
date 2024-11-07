import type { PlainMessage } from '@bufbuild/protobuf';
import { LinkList } from '@js-sdsl/link-list';
import { sha256 } from 'hash-wasm';
import { produce } from 'immer';
import { createStore } from 'zustand';
import type { Enums } from '../database.types';
import type { DamageOption, Entry, EventResponse } from '../proto/stratsync_pb';
import type { StrategyDataType } from '../queries/server';
import { type StratSyncClient, StratSyncClientFactory } from '../stratSyncClient';
import { createClient } from '../supabase/client';
import type { ArrayElement } from '../utils';

export type EntryMutation = {
  upserts: PlainMessage<Entry>[];
  deletes: string[];
};

function inverseEntryMutation(
  { upserts, deletes }: EntryMutation,
  currentEntries: ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries'],
): EntryMutation {
  const invertedUpserts: PlainMessage<Entry>[] = [];
  const invertedDeletes: string[] = [];

  for (const entry of upserts) {
    const existingEntry = currentEntries.find((e) => e.id === entry.id);
    if (existingEntry) {
      invertedUpserts.push({
        action: existingEntry.action,
        id: existingEntry.id,
        player: existingEntry.player,
        useAt: existingEntry.use_at,
      });
    } else {
      invertedDeletes.push(entry.id);
    }
  }

  for (const id of deletes) {
    const existingEntry = currentEntries.find((e) => e.id === id);
    if (existingEntry) {
      invertedUpserts.push({
        action: existingEntry.action,
        id: existingEntry.id,
        player: existingEntry.player,
        useAt: existingEntry.use_at,
      });
    }
  }

  return {
    upserts: invertedUpserts,
    deletes: invertedDeletes,
  };
}

class EntryMutationHistory {
  static MAX_HISTORY_CAPACITY = 256;

  private past: LinkList<{ forward: EntryMutation; backward: EntryMutation }> = new LinkList();
  private future: LinkList<{ forward: EntryMutation; backward: EntryMutation }> = new LinkList();

  undo(): EntryMutation | undefined {
    const entry = this.past.popBack();

    if (entry) this.future.pushFront(entry);

    return entry?.backward;
  }

  redo(): EntryMutation | undefined {
    const entry = this.future.popFront();

    if (entry) this.past.pushBack(entry);

    return entry?.forward;
  }

  lockEntries(ids: string[]): void {
    const lockedEntries = new Set(ids);

    for (const { forward, backward } of this.past) {
      forward.upserts = forward.upserts.filter((entry) => !lockedEntries.has(entry.id));
      forward.deletes = forward.deletes.filter((id) => !lockedEntries.has(id));
      backward.upserts = backward.upserts.filter((entry) => !lockedEntries.has(entry.id));
      backward.deletes = backward.deletes.filter((id) => !lockedEntries.has(id));
    }

    for (const { forward, backward } of this.future) {
      forward.upserts = forward.upserts.filter((entry) => !lockedEntries.has(entry.id));
      forward.deletes = forward.deletes.filter((id) => !lockedEntries.has(id));
      backward.upserts = backward.upserts.filter((entry) => !lockedEntries.has(entry.id));
      backward.deletes = backward.deletes.filter((id) => !lockedEntries.has(id));
    }
  }

  ensureCapacity(): void {
    if (this.future.size() > EntryMutationHistory.MAX_HISTORY_CAPACITY) {
      throw new Error('Future history is too large');
    }

    while (this.past.size() + this.future.size() > EntryMutationHistory.MAX_HISTORY_CAPACITY) this.past.popFront();
  }

  push(
    mutation: EntryMutation,
    currentEntries: ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries'],
  ): void {
    this.past.pushBack({
      forward: mutation,
      backward: inverseEntryMutation(mutation, currentEntries),
    });

    this.future.clear();

    this.ensureCapacity();
  }
}

export type StratSyncState = {
  strategy: string;
  token?: string;
  userId?: string;
  isAuthor: boolean;
  elevated: boolean;
  elevatable: boolean;
  connectionAborted: boolean;
  eventStream?: AsyncIterable<EventResponse>;
  client?: StratSyncClient;
  strategyData: StrategyDataType;
  entryMutationHistory: EntryMutationHistory;
};

export type StratSyncActions = {
  getStore: () => StratSyncStore;
  updateStrategyData: (data: Partial<StrategyDataType>) => void;
  connect: (strategy: string, isAuthor: boolean, editable: boolean) => Promise<void>;
  elevate: (password: string) => Promise<boolean>;
  clearOtherSessions: () => Promise<boolean>;
  abort: () => void;
  upsertDamageOption: (damageOption: PlainMessage<DamageOption>, local: boolean) => void;
  mutateEntries: (entryMutation: EntryMutation, local: boolean) => void;
  undoEntryMutation: () => EntryMutation | undefined;
  redoEntryMutation: () => EntryMutation | undefined;
  updatePlayerJob: (id: string, job: string | undefined, local: boolean) => void;
};

export type StratSyncStore = StratSyncState & StratSyncActions;

const defaultState = {
  strategy: '',
  elevated: false,
  isAuthor: false,
  elevatable: false,
  connectionAborted: false,
  strategyData: {} as StrategyDataType,
  entryMutationHistory: new EntryMutationHistory(),
};

const handleUpsertDamageOption = (damageOption: PlainMessage<DamageOption>) =>
  produce((state: StratSyncStore) => {
    const damageId = damageOption.damage;

    for (const gimmick of state.strategyData.raids?.gimmicks ?? []) {
      for (const damage of gimmick.damages) {
        if (damage.id === damageId) {
          damage.strategy_damage_options = [
            {
              damage: damageId,
              num_shared: damageOption.numShared ?? null,
              primary_target: damageOption.primaryTarget ?? null,
              strategy: state.strategy,
            },
          ];

          return;
        }
      }
    }
  });

const handleMutateEntries = ({ upserts, deletes }: EntryMutation) =>
  produce((state: StratSyncStore) => {
    const deletes_set = new Set(deletes);

    for (const player of state.strategyData.strategy_players) {
      player.strategy_player_entries = player.strategy_player_entries.filter((e) => !deletes_set.has(e.id));

      const upserts_for_player = upserts.filter((e) => e.player === player.id);
      const upserts_id_set = new Set(upserts_for_player.map((e) => e.id));

      player.strategy_player_entries = [
        ...player.strategy_player_entries.filter((e) => !upserts_id_set.has(e.id)),
        ...upserts_for_player.map((e) => ({
          action: e.action,
          id: e.id,
          player: e.player,
          use_at: e.useAt,
        })),
      ];
    }
  });

const handleUpdatePlayerJob = (id: string, job: string | undefined) =>
  produce((state: StratSyncStore) => {
    for (const p of state.strategyData.strategy_players) {
      if (p.id === id) {
        p.job = job ? (job as Enums<'job'>) : null;
        p.strategy_player_entries = [];
        break;
      }
    }
  });

const getAuthorizationHeader = async () => {
  const supabase = createClient();
  const access_token = (await supabase.auth.getSession())?.data?.session?.access_token;
  return access_token ? { Authorization: `Bearer ${access_token}` } : undefined;
};

export const createStratSyncStore = (initState: Partial<StratSyncState>) =>
  createStore<StratSyncStore>()((set, get) => {
    const optimisticDispatch =
      <T>(
        localHandler: (state: StratSyncStore) => StratSyncStore,
        asyncDispatcher: (state: StratSyncStore) => Promise<T> | undefined,
        local: boolean,
      ) =>
      (state: StratSyncStore) => {
        if (!state.client || !state.token || !state.elevated) return state;

        set(localHandler);

        if (!local)
          (async () => {
            try {
              await asyncDispatcher(state);
            } catch (e) {
              console.error(e);

              set(
                produce((state: StratSyncStore) => {
                  state.connectionAborted = true;
                }),
              );
            }
          })();
      };

    return {
      ...defaultState,
      ...initState,
      connect: async (strategy: string, isAuthor: boolean, editable: boolean) => {
        try {
          const client = new StratSyncClientFactory().client;
          const eventStream = client.event({ strategy }, { headers: await getAuthorizationHeader() });
          const { event } = (await eventStream[Symbol.asyncIterator]().next()).value as EventResponse;

          set(
            produce((state: StratSyncStore) => {
              if (event.case !== 'initializationEvent') return;

              state.client = client;
              state.eventStream = eventStream;
              state.strategy = strategy;
              state.token = event.value.token;

              state.isAuthor = isAuthor;
              state.elevatable = !isAuthor && editable;
              state.elevated = isAuthor;

              state.strategyData.strategy_players = event.value.players.map((player) => ({
                id: player.id,
                job: player.job ? (player.job as Enums<'job'>) : null,
                order: player.order,
                strategy: strategy,
                strategy_player_entries: event.value.entries
                  .filter((e) => e.player === player.id)
                  .map((e) => ({
                    action: e.action,
                    id: e.id,
                    player: e.player,
                    use_at: e.useAt,
                  })),
              }));

              for (const gimmick of state.strategyData.raids?.gimmicks ?? []) {
                for (const damage of gimmick.damages) {
                  damage.strategy_damage_options = event.value.damageOptions
                    .filter((d) => d.damage === damage.id)
                    .map((d) => ({
                      damage: d.damage,
                      num_shared: d.numShared ?? null,
                      primary_target: d.primaryTarget ?? null,
                      strategy: strategy,
                    }));
                }
              }
            }),
          );

          for await (const { event } of eventStream) {
            if (event.case === 'initializationEvent') {
              // This should never happen, but just in case
              throw new Error('Received initialization event after initial connection');
            }

            if (event.case === 'upsertDamageOptionEvent') {
              if (event.value.damageOption) {
                const { damageOption } = event.value;
                set(handleUpsertDamageOption(damageOption));
              }
            }

            if (event.case === 'mutateEntriesEvent') {
              const { upserts, deletes } = event.value;
              get().entryMutationHistory.lockEntries([...upserts.map((e) => e.id), ...deletes]);
              set(handleMutateEntries({ upserts, deletes }));
            }

            if (event.case === 'updatePlayerJobEvent') {
              const { id, job } = event.value;
              get().entryMutationHistory.lockEntries(
                get()
                  .strategyData.strategy_players.find((p) => p.id === id)
                  ?.strategy_player_entries.map((e) => e.id) ?? [],
              );
              set(handleUpdatePlayerJob(id, job));
            }
          }
        } catch (e) {
          console.error(e);

          set(
            produce((state: StratSyncStore) => {
              state.connectionAborted = true;
            }),
          );
        }
      },
      updateStrategyData: (data: Partial<StrategyDataType>) => {
        set(
          produce((state: StratSyncStore) => {
            state.strategyData = { ...state.strategyData, ...data };
          }),
        );
      },
      getStore: get,
      abort: () => {
        set(
          produce((state: StratSyncStore) => {
            state.connectionAborted = true;
          }),
        );
      },
      clearOtherSessions: async () => {
        if (!get().client || !get().token) return false;
        if (!get().isAuthor) return false;

        try {
          await get().client?.clearOtherSessions({ token: get().token });

          return true;
        } catch {
          return false;
        }
      },
      elevate: async (password: string) => {
        if (!get().client || !get().token) return false;
        if (get().elevated) return true;

        const hashed = await sha256(password);

        try {
          await get().client?.elevate({
            token: get().token,
            password: hashed,
          });
          set(
            produce((state: StratSyncStore) => {
              state.elevated = true;
            }),
          );
          return true;
        } catch {
          return false;
        }
      },
      upsertDamageOption: (damageOption: PlainMessage<DamageOption>, local = false) => {
        optimisticDispatch(
          handleUpsertDamageOption(damageOption),
          (state: StratSyncState) =>
            state.client?.upsertDamageOption({
              token: state.token,
              damageOption,
            }),
          local,
        )(get());
      },
      mutateEntries: (entryMutation: EntryMutation, local = false) => {
        get().entryMutationHistory.push(
          entryMutation,
          get().strategyData.strategy_players.flatMap((p) => p.strategy_player_entries),
        );

        optimisticDispatch(
          handleMutateEntries(entryMutation),
          (state: StratSyncState) =>
            state.client?.mutateEntries({
              token: state.token,
              upserts: entryMutation.upserts,
              deletes: entryMutation.deletes,
            }),
          local,
        )(get());
      },
      undoEntryMutation: () => {
        const backwardMutation = get().entryMutationHistory.undo();

        if (backwardMutation) {
          optimisticDispatch(
            handleMutateEntries(backwardMutation),
            (state: StratSyncState) =>
              state.client?.mutateEntries({
                token: state.token,
                upserts: backwardMutation.upserts,
                deletes: backwardMutation.deletes,
              }),
            false,
          )(get());
        }

        return backwardMutation;
      },
      redoEntryMutation: () => {
        const forwardMutation = get().entryMutationHistory.redo();

        if (forwardMutation) {
          optimisticDispatch(
            handleMutateEntries(forwardMutation),
            (state: StratSyncState) =>
              state.client?.mutateEntries({
                token: state.token,
                upserts: forwardMutation.upserts,
                deletes: forwardMutation.deletes,
              }),
            false,
          )(get());
        }

        return forwardMutation;
      },
      updatePlayerJob: (id: string, job: string | undefined, local = false) => {
        get().entryMutationHistory.lockEntries(
          get()
            .strategyData.strategy_players.find((p) => p.id === id)
            ?.strategy_player_entries.map((e) => e.id) ?? [],
        );

        optimisticDispatch(
          handleUpdatePlayerJob(id, job),
          (state: StratSyncState) => state.client?.updatePlayerJob({ token: state.token, id, job }),
          local,
        )(get());
      },
    };
  });
