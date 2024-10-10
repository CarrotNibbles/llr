'use server';

import type { QueryData } from '@supabase/supabase-js';
import type { createClient } from '../supabase/server';

export const buildActionDataQuery = (supabase: ReturnType<typeof createClient>) => {
  return supabase.from('actions').select('*, mitigations(*)').order('priority');
};

export type ActionDataType = QueryData<ReturnType<typeof buildActionDataQuery>>;

export const buildStrategiesDataQuery = (supabase: ReturnType<typeof createClient>) => {
  return supabase
    .from('strategies')
    .select(
    `*,
    like_counts(*), 
    strategy_players(*)`
  );
}; // TODO: Change select columns

export type StrategiesDataType = QueryData<ReturnType<typeof buildStrategiesDataQuery>>;

export const buildStrategyDataQuery = async (supabase: ReturnType<typeof createClient>, strategyId: string) => {
  const res = await supabase
    .from('strategies')
    .select(
      `*,
      like_counts(*),
      user_likes(*),
      strategy_players(*, strategy_player_entries(*)),
      raids!inner(*, gimmicks(*, damages(*, strategy_damage_options(*))))`,
    )
    .eq('id', strategyId)
    .maybeSingle();

  if (res.data) {
    res.data.strategy_players.sort((a, b) => a.order - b.order);
  }

  return res;
};

export type StrategyDataType = QueryData<ReturnType<typeof buildStrategyDataQuery>>;

export const buildRaidsDataQuery = async (supabase: ReturnType<typeof createClient>) => supabase.from('raids').select();

export type RaidsDataType = QueryData<ReturnType<typeof buildRaidsDataQuery>>;
