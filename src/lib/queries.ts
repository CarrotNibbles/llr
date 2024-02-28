import { type QueryData } from '@supabase/supabase-js';
import { type createClient } from './supabase/server';

export const buildRaidDataQuery = (supabase: ReturnType<typeof createClient>, raidId: string) => {
  return supabase.from('gimmicks').select().eq('raid', raidId).select('*, damages(*)');
};

export type RaidDataType = QueryData<ReturnType<typeof buildRaidDataQuery>>;

export const buildStrategyCardDataQuery = (
  supabase: ReturnType<typeof createClient>,
  raidId: string,
) => {
  return supabase.from('strategies').select().eq('raid', raidId).select('*, strategy_players(*)');
};

export type StrategyCardDataType = QueryData<ReturnType<typeof buildStrategyCardDataQuery>>;
