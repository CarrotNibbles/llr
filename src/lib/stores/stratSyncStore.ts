import type { PlainMessage } from '@bufbuild/protobuf';
import { sha256 } from 'hash-wasm';
import { produce } from 'immer';
import { createStore } from 'zustand';
import type { Enums } from '../database.types';
import type { DamageOption, Entry, EventResponse } from '../proto/stratsync_pb';
import type { StrategyDataType } from '../queries/server';
import { type StratSyncClient, StratSyncClientFactory } from '../stratSyncClient';
import { createClient } from '../supabase/client';

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
};

export type StratSyncActions = {
  updateStrategyData: (data: Partial<StrategyDataType>) => void;
  connect: (strategy: string, isAuthor: boolean, editable: boolean) => Promise<void>;
  elevate: (password: string) => Promise<boolean>;
  clearOtherSessions: () => Promise<boolean>;
  abort: () => void;
  upsertDamageOption: (damageOption: PlainMessage<DamageOption>, local: boolean) => void;
  mutateEntries: (upserts: PlainMessage<Entry>[], deletes: string[], local: boolean) => void;
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

const handleMutateEntries = (upserts: PlainMessage<Entry>[], deletes: string[]) =>
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
    const localFirstDispatch =
      <T>(
        localHandler: (state: StratSyncStore) => StratSyncStore,
        asyncDispatcher: (state: StratSyncStore) => Promise<T> | undefined,
        local: boolean,
      ) =>
      (state: StratSyncStore) => {
        if (!state.client || !state.token || !state.elevated) return state;
        const updatedState = localHandler(state);
        if (!local)
          (async () => {
            try {
              if (!state.client) return;

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
        return updatedState;
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
                set((state: StratSyncStore) => handleUpsertDamageOption(damageOption)(state));
              }
            }

            if (event.case === 'mutateEntriesEvent') {
              const { upserts, deletes } = event.value;
              set((state: StratSyncStore) => handleMutateEntries(upserts, deletes)(state));
            }

            if (event.case === 'updatePlayerJobEvent') {
              const { id, job } = event.value;
              set((state: StratSyncStore) => handleUpdatePlayerJob(id, job)(state));
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
      upsertDamageOption: (damageOption: PlainMessage<DamageOption>, local = false) =>
        set(
          localFirstDispatch(
            handleUpsertDamageOption(damageOption),
            (state: StratSyncState) => state.client?.upsertDamageOption({ token: state.token, damageOption }),
            local,
          ),
        ),
      mutateEntries: (upserts: PlainMessage<Entry>[], deletes: string[], local = false) =>
        set(
          localFirstDispatch(
            handleMutateEntries(upserts, deletes),
            (state: StratSyncState) => state.client?.mutateEntries({ token: state.token, upserts, deletes }),
            local,
          ),
        ),
      updatePlayerJob: (id: string, job: string | undefined, local = false) =>
        set(
          localFirstDispatch(
            handleUpdatePlayerJob(id, job),
            (state: StratSyncState) => state.client?.updatePlayerJob({ token: state.token, id, job }),
            local,
          ),
        ),
    };
  });
