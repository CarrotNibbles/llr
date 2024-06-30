'use server';

import type { QueryData } from '@supabase/supabase-js';
import type { createClient } from '../supabase/server';

export const buildActionDataQuery = (supabase: ReturnType<typeof createClient>) => {
  return supabase.from('actions').select('*, mitigations(*)').order('priority');
};

export type ActionDataType = QueryData<ReturnType<typeof buildActionDataQuery>>;

export const buildStrategyCardDataQuery = (supabase: ReturnType<typeof createClient>, raidId: string) => {
  return supabase.from('strategies').select('*, strategy_players(*)').eq('raid', raidId);
};

export type StrategyCardDataType = QueryData<ReturnType<typeof buildStrategyCardDataQuery>>;

export const buildStrategyDataQuery = async (supabase: ReturnType<typeof createClient>, strategyId: string) => {
  return supabase
    .from('strategies')
    .select(
      `*, 
      strategy_players(*, strategy_player_entries(*)),
      raids!inner(*, gimmicks(*, damages(*, strategy_damage_options(*))))`,
    )
    .eq('id', strategyId)
    .maybeSingle();
};

export type StrategyDataType = QueryData<ReturnType<typeof buildStrategyDataQuery>>;

export const buildRaidsDataQuery = async (supabase: ReturnType<typeof createClient>) => supabase.from('raids').select();

export type RaidsDataType = QueryData<ReturnType<typeof buildRaidsDataQuery>>;
