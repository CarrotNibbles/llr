'use client';

import { type Tables } from '../database.types';
import { type createClient } from '../supabase/client';

// Strategy
export const buildClientInsertStrategyQuery = (
  supabase: ReturnType<typeof createClient>,
  strategy: Omit<Tables<'strategies'>, 'id'>,
) => {
  return supabase.from('strategies').insert(strategy);
};

export const buildClientUpdateStrategyQuery = (
  supabase: ReturnType<typeof createClient>,
  strategy: Tables<'strategies'>,
) => {
  return supabase.from('strategies').update(strategy).eq('id', strategy.id);
};

export const buildClientDeleteStrategyQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyId: string,
) => {
  return supabase.from('strategies').delete().eq('id', strategyId);
};

// StrategyPlayer
export const buildClientInsertStrategyPlayerQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyPlayer: Omit<Tables<'strategy_players'>, 'id'>,
) => {
  return supabase.from('strategy_players').insert(strategyPlayer);
};

export const buildClientUpdateStrategyPlayerQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyPlayer: Tables<'strategy_players'>,
) => {
  return supabase.from('strategy_players').update(strategyPlayer).eq('id', strategyPlayer.id);
};

export const buildClientDeleteStrategyPlayerQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyPlayerId: string,
) => {
  return supabase.from('strategy_players').delete().eq('id', strategyPlayerId);
};

// StrategyPlayerEntry
export const buildClientInsertStrategyPlayerEntryQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyPlayerEntry: Omit<Tables<'strategy_player_entries'>, 'id'>,
) => {
  return supabase.from('strategy_player_entries').insert(strategyPlayerEntry).select();
};

export const buildClientUpdateStrategyPlayerEntryQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyPlayerEntry: Tables<'strategy_player_entries'>,
) => {
  return supabase
    .from('strategy_player_entries')
    .update(strategyPlayerEntry)
    .eq('id', strategyPlayerEntry.id);
};

export const buildClientDeleteStrategyPlayerEntryQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyPlayerEntryUseAt: number,
  strategyPlayerEntryAction: string,
) => {
  return supabase
    .from('strategy_player_entries')
    .delete()
    .eq('action', strategyPlayerEntryAction)
    .eq('use_at', strategyPlayerEntryUseAt);
};

// StrategyDamageOption
export const buildClientInsertStrategyDamageOptionQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyDamageOption: Tables<'strategy_damage_options'>,
) => {
  return supabase.from('strategy_damage_options').insert(strategyDamageOption);
};

export const buildClientUpdateStrategyDamageOptionQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyDamageOption: Tables<'strategy_damage_options'>,
) => {
  return supabase
    .from('strategy_damage_options')
    .update(strategyDamageOption)
    .eq('strategy', strategyDamageOption.strategy)
    .eq('damage', strategyDamageOption.damage);
};

export const buildClientDeleteStrategyDamageOptionQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyDamageOptionStrategy: string,
  strategyDamageOptionDamage: string,
) => {
  return supabase
    .from('strategy_damage_options')
    .delete()
    .eq('strategy', strategyDamageOptionStrategy)
    .eq('damage', strategyDamageOptionDamage);
};

// SupabaseSubscription
export const subscribeClientStrategyTable = (
  supabase: ReturnType<typeof createClient>,
  strategyId: string,
) => {
  return supabase
    .channel(`strategy-${strategyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'strategies',
        filter: `id=eq.${strategyId}`,
      },
      (payload) => {
        console.log('Change received!', payload);
      },
    )
    .subscribe();
};

export const subscribeClientStrategyPlayerTable = (
  supabase: ReturnType<typeof createClient>,
  strategyId: string,
) => {
  return supabase
    .channel(`strategy-${strategyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'strategy_players',
        filter: `strategy=eq.${strategyId}`,
      },
      (payload) => {
        console.log('Change received!', payload);
      },
    )
    .subscribe();
};

export const subscribeClientStrategyPlayerEntryTable = (
  supabase: ReturnType<typeof createClient>,
  playerId: string,
) => {
  return supabase
    .channel(`Player-${playerId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'strategy_player_entries',
        filter: `player=eq.${playerId}`,
      },
      (payload) => {
        console.log('Change received!', payload);
      },
    )
    .subscribe();
};
