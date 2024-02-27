import { type QueryData } from '@supabase/supabase-js';
import { type createClient } from './supabase/server';

export const buildRaidDataQuery = (supabase: ReturnType<typeof createClient>, id: string) => {
  return supabase.from('gimmicks').select().eq('raid', id).select('*, damages(*)');
};

export type RaidDataType = QueryData<ReturnType<typeof buildRaidDataQuery>>;
