import { produce } from 'immer';
import { createStore } from 'zustand';
import type { Enums } from '../database.types';
import type { DamageOption, Entry, EventResponse, Player } from '../proto/stratsync_pb';
import type { StrategyDataType } from '../queries/server';
import { StratSyncClientFactory, createStratSyncClient, type StratSyncClient } from '../stratSyncClient';
import { sha384 } from 'hash-wasm';
import type { PlainMessage } from '@bufbuild/protobuf';

export type StratSyncState = {
  strategy: string;
  token?: string;
  elevated: boolean;
  eventStream?: AsyncIterable<EventResponse>;
  client?: StratSyncClient;
  strategyData: StrategyDataType;
};

export type StratSyncActions = {
  connect: (strategy: string) => Promise<void>;
  elevate: (password: string) => Promise<boolean>;
  upsertDamageOption: (damageOption: PlainMessage<DamageOption>, local: boolean) => void;
  upsertEntry: (entry: PlainMessage<Entry>, local: boolean) => void;
  deleteEntry: (id: string, local: boolean) => void;
  insertPlayer: (player: PlainMessage<Player>, local: boolean) => void;
  deletePlayer: (id: string, local: boolean) => void;
};

export type StratSyncStore = StratSyncState & StratSyncActions;

const defaultState = {
  strategy: '',
  elevated: false,
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

const handleInsertPlayer = (player: PlainMessage<Player>) =>
  produce((state: StratSyncStore) => {
    state.strategyData.strategy_players.push({
      id: player.id,
      job: player.job as Enums<'job'>,
      strategy: state.strategy,
      strategy_player_entries: [],
    });
  });

const handleDeletePlayer = (id: string) =>
  produce((state: StratSyncStore) => {
    state.strategyData.strategy_players = state.strategyData.strategy_players.filter((p) => p.id !== id);
  });

export const createStratSyncStore = (initState: Partial<StratSyncState>) => {
  return createStore<StratSyncStore>()((set, get) => ({
    ...defaultState,
    ...initState,
    connect: async (strategy: string) => {
      if (StratSyncClientFactory.instance) return;

      const client = new StratSyncClientFactory().client;
      const eventStream = client.event({ strategy });
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
            job: player.job as Enums<'job'>,
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
            const damageOption = event.value.damageOption;
            set((state: StratSyncStore) => handleUpsertDamageOption(damageOption)(state));
          }
        }

        if (event.case === 'upsertEntryEvent') {
          if (event.value.entry) {
            const entry = event.value.entry;
            set((state: StratSyncStore) => handleUpsertEntry(entry)(state));
          }
        }

        if (event.case === 'deleteEntryEvent') {
          if (event.value.id) {
            const id = event.value.id;
            set((state: StratSyncStore) => handleDeleteEntry(id)(state));
          }
        }

        if (event.case === 'insertPlayerEvent') {
          if (event.value.player) {
            const player = event.value.player;
            set((state: StratSyncStore) => handleInsertPlayer(player)(state));
          }
        }

        if (event.case === 'deletePlayerEvent') {
          if (event.value.id) {
            const id = event.value.id;
            set((state: StratSyncStore) => handleDeletePlayer(id)(state));
          }
        }
      }
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
    insertPlayer: (player: PlainMessage<Player>, local = false) =>
      set((state: StratSyncStore) => {
        if (!state.client || !state.token || !state.elevated) return state;
        const updatedState = handleInsertPlayer(player)(state);
        if (!local) state.client.insertPlayer({ token: state.token, player });
        return updatedState;
      }),
    deletePlayer: (id: string, local = false) =>
      set((state: StratSyncStore) => {
        if (!state.client || !state.token || !state.elevated) return state;
        const updatedState = handleDeletePlayer(id)(state);
        if (!local) state.client.deletePlayer({ token: state.token, id });
        return updatedState;
      }),
  }));
};
