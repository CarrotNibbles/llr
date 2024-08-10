import type { PlainMessage } from '@bufbuild/protobuf';
import { sha384 } from 'hash-wasm';
import { produce } from 'immer';
import { createStore } from 'zustand';
import type { Enums } from '../database.types';
import type { DamageOption, Entry, EventResponse, Player } from '../proto/stratsync_pb';
import type { StrategyDataType } from '../queries/server';
import { type StratSyncClient, StratSyncClientFactory } from '../stratSyncClient';
import { createClient } from '../supabase/client';

export type StratSyncState = {
  strategy: string;
  token?: string;
  elevated: boolean;
  connectionAborted: boolean;
  eventStream?: AsyncIterable<EventResponse>;
  client?: StratSyncClient;
  strategyData: StrategyDataType;
};

export type StratSyncActions = {
  connect: (strategy: string) => Promise<void>;
  elevate: (password: string) => Promise<boolean>;
  abort: () => void;
  upsertDamageOption: (damageOption: PlainMessage<DamageOption>, local: boolean) => void;
  upsertEntry: (entry: PlainMessage<Entry>, local: boolean) => void;
  deleteEntry: (id: string, local: boolean) => void;
  updatePlayerJob: (id: string, job: string | undefined, local: boolean) => void;
};

export type StratSyncStore = StratSyncState & StratSyncActions;

const defaultState = {
  strategy: '',
  elevated: false,
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

const handleUpsertEntry = (entry: PlainMessage<Entry>) =>
  produce((state: StratSyncStore) => {
    for (const player of state.strategyData.strategy_players) {
      if (player.id !== entry.player) continue;

      player.strategy_player_entries = [
        ...player.strategy_player_entries.filter((e) => e.id !== entry.id),
        {
          action: entry.action,
          id: entry.id,
          player: entry.player,
          use_at: entry.useAt,
        },
      ];
    }
  });

const handleDeleteEntry = (id: string) =>
  produce((state: StratSyncStore) => {
    for (const player of state.strategyData.strategy_players) {
      player.strategy_player_entries = player.strategy_player_entries.filter((e) => e.id !== id);
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
  const access_token = (await supabase.auth.getSession()).data?.session?.access_token;
  return access_token ? { Authorization: `Bearer ${access_token}` } : undefined;
};

export const createStratSyncStore = (initState: Partial<StratSyncState>) =>
  createStore<StratSyncStore>()((set, get) => ({
    ...defaultState,
    ...initState,
    connect: async (strategy: string) => {
      try {
        if (StratSyncClientFactory.instance) return;

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

          if (event.case === 'upsertEntryEvent') {
            if (event.value.entry) {
              const { entry } = event.value;
              set((state: StratSyncStore) => handleUpsertEntry(entry)(state));
            }
          }

          if (event.case === 'deleteEntryEvent') {
            const { id } = event.value;
            set((state: StratSyncStore) => handleDeleteEntry(id)(state));
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
    abort: () => {
      set(
        produce((state: StratSyncStore) => {
          state.connectionAborted = true;
        }),
      );
    },
    elevate: async (password: string) => {
      if (!get().client || !get().token) return false;
      if (get().elevated) return true;

      const hashed = await sha384(password);

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
      set((state: StratSyncStore) => {
        if (!state.client || !state.token || !state.elevated) return state;
        const updatedState = handleUpsertDamageOption(damageOption)(state);
        if (!local) state.client.upsertDamageOption({ token: state.token, damageOption });
        return updatedState;
      }),
    upsertEntry: (entry: PlainMessage<Entry>, local = false) =>
      set((state: StratSyncStore) => {
        if (!state.client || !state.token || !state.elevated) return state;
        const updatedState = handleUpsertEntry(entry)(state);
        if (!local) state.client.upsertEntry({ token: state.token, entry });
        return updatedState;
      }),
    deleteEntry: (id: string, local = false) =>
      set((state: StratSyncStore) => {
        if (!state.client || !state.token || !state.elevated) return state;
        const updatedState = handleDeleteEntry(id)(state);
        if (!local) state.client.deleteEntry({ token: state.token, id });
        return updatedState;
      }),
    updatePlayerJob(id: string, job: string | undefined, local = false) {
      set((state: StratSyncStore) => {
        if (!state.client || !state.token || !state.elevated) return state;
        const updatedState = handleUpdatePlayerJob(id, job)(state);
        if (!local) state.client.updatePlayerJob({ token: state.token, id, job });
        return updatedState;
      });
    },
  }));
