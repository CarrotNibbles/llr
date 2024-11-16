import type { PlainMessage } from '@bufbuild/protobuf';
import { sha256 } from 'hash-wasm';
import { produce } from 'immer';
import { createStore } from 'zustand';
import type { Enums } from '../database.types';
import type { DamageOption, EventResponse } from '../proto/stratsync_pb';
import type { StrategyDataType } from '../queries/server';
import { type StratSyncClient, StratSyncClientFactory } from '../stratSyncClient';
import { createClient } from '../supabase/client';
import { type EntryMutation, type NoteMutation, UndoManager, type UndoableMutation } from './undoManager';

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
  undoManager: UndoManager;
  undoAvailable: boolean;
  redoAvailable: boolean;
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
  mutateNote: (noteMutation: NoteMutation) => void;
  updatePlayerJob: (id: string, job: string | undefined, local: boolean) => void;
  undo: () => UndoableMutation | undefined;
  redo: () => UndoableMutation | undefined;
};

export type StratSyncStore = StratSyncState & StratSyncActions;

const defaultState = {
  strategy: '',
  elevated: false,
  isAuthor: false,
  elevatable: false,
  connectionAborted: false,
  strategyData: {} as StrategyDataType,
  undoManager: new UndoManager(),
  undoAvailable: false,
  redoAvailable: false,
};

const refreshUndoRedoAvailability = produce((state: StratSyncStore) => {
  state.undoAvailable = state.undoManager.isUndoAvailable();
  state.redoAvailable = state.undoManager.isRedoAvailable();
});

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

const handleMutateNote = (mut: NoteMutation) =>
  produce((state: StratSyncStore) => {
    if ('upsert' in mut) {
      state.strategyData.notes = state.strategyData.notes.filter((n) => n.id !== mut.upsert.id);
      state.strategyData.notes.push({ ...mut.upsert, strategy: state.strategyData.id });
    } else {
      state.strategyData.notes = state.strategyData.notes.filter((n) => n.id !== mut.delete);
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
      getStore: () => get(),
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
              state.undoManager = new UndoManager();

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
            if (get().eventStream !== eventStream) {
              return;
            }

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
              get().undoManager.lockEntries([...upserts.map((e) => e.id), ...deletes]);
              set(handleMutateEntries({ upserts, deletes }));
            }

            if (event.case === 'updatePlayerJobEvent') {
              const { id, job } = event.value;
              get().undoManager.lockEntries(
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
        if (entryMutation.upserts.length === 0 && entryMutation.deletes.length === 0) return;

        set(
          produce((state: StratSyncStore) => {
            state.undoManager.pushEntryMutation(
              entryMutation,
              state.strategyData.strategy_players.flatMap((p) => p.strategy_player_entries),
            );
          }),
        );

        set(refreshUndoRedoAvailability);

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
      undo: () => {
        const backwardMutation = get().undoManager.undo();

        if (backwardMutation) {
          if (backwardMutation.type === 'entry') {
            optimisticDispatch(
              handleMutateEntries(backwardMutation.mutation),
              (state: StratSyncState) =>
                state.client?.mutateEntries({
                  token: state.token,
                  upserts: backwardMutation.mutation.upserts,
                  deletes: backwardMutation.mutation.deletes,
                }),
              false,
            )(get());
          }

          if (backwardMutation.type === 'note') {
            optimisticDispatch(
              handleMutateNote(backwardMutation.mutation),
              (state: StratSyncState) => {
                if ('upsert' in backwardMutation.mutation) {
                  return state.client?.upsertNote({
                    token: state.token,
                    note: backwardMutation.mutation.upsert,
                  });
                }

                return state.client?.deleteNote({
                  token: state.token,
                  id: backwardMutation.mutation.delete,
                });
              },
              false,
            )(get());
          }
        }

        set(refreshUndoRedoAvailability);

        return backwardMutation;
      },
      redo: () => {
        const forwardMutation = get().undoManager.redo();

        if (forwardMutation) {
          if (forwardMutation.type === 'entry') {
            optimisticDispatch(
              handleMutateEntries(forwardMutation.mutation),
              (state: StratSyncState) =>
                state.client?.mutateEntries({
                  token: state.token,
                  upserts: forwardMutation.mutation.upserts,
                  deletes: forwardMutation.mutation.deletes,
                }),
              false,
            )(get());
          }

          if (forwardMutation.type === 'note') {
            optimisticDispatch(
              handleMutateNote(forwardMutation.mutation),
              (state: StratSyncState) => {
                if ('upsert' in forwardMutation.mutation) {
                  return state.client?.upsertNote({
                    token: state.token,
                    note: forwardMutation.mutation.upsert,
                  });
                }

                return state.client?.deleteNote({
                  token: state.token,
                  id: forwardMutation.mutation.delete,
                });
              },
              false,
            )(get());
          }
        }

        set(refreshUndoRedoAvailability);

        return forwardMutation;
      },
      updatePlayerJob: (id: string, job: string | undefined, local = false) => {
        get().undoManager.lockEntries(
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
      mutateNote: (noteMutation: NoteMutation) => {
        get().undoManager.pushNoteMutation(noteMutation, get().strategyData.notes);

        optimisticDispatch(
          handleMutateNote(noteMutation),
          (state: StratSyncState) => {
            if ('upsert' in noteMutation) {
              return state.client?.upsertNote({
                token: state.token,
                note: noteMutation.upsert,
              });
            }
            return state.client?.deleteNote({
              token: state.token,
              id: noteMutation.delete,
            });
          },
          false,
        )(get());

        set(refreshUndoRedoAvailability);
      },
    };
  });
