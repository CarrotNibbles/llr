import { type QueryData } from '@supabase/supabase-js';
import { type createClient } from './supabase/server';

export const buildRaidDataQuery = (supabase: ReturnType<typeof createClient>, raidId: string) => {
  return supabase.from('gimmicks').select('*, damages(*)').eq('raid', raidId);
};

export type RaidDataType = QueryData<ReturnType<typeof buildRaidDataQuery>>;

export const buildAbilityDataQuery = (supabase: ReturnType<typeof createClient>) => {
  return supabase.from('abilities').select('*, mitigations(*)');
};

export type AbilityDataType = QueryData<ReturnType<typeof buildAbilityDataQuery>>;

export const buildStrategyCardDataQuery = (
  supabase: ReturnType<typeof createClient>,
  raidId: string,
) => {
  return supabase.from('strategies').select('*, strategy_players(*)').eq('raid', raidId);
};

export type StrategyCardDataType = QueryData<ReturnType<typeof buildStrategyCardDataQuery>>;

export const buildStrategyDataQuery = async (
  supabase: ReturnType<typeof createClient>,
  strategyId: string,
) => {
  return supabase
    .from('strategies')
    .select(
      `*, 
      strategy_players(*, strategy_player_entries(*)),
      strategy_damage_options(*),
      raids!inner(*, gimmicks(*, damages(*)))`,
    )
    .eq('id', strategyId)
    .maybeSingle();
};

export type StrategyDataType = QueryData<ReturnType<typeof buildStrategyDataQuery>>;
