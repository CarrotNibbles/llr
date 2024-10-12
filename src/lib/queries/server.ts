'use server';

import type { QueryData } from '@supabase/supabase-js';
import type { createClient } from '../supabase/server';

export const buildActionDataQuery = (supabase: ReturnType<typeof createClient>) => {
  return supabase.from('actions').select('*, mitigations(*)').order('priority');
};

export type ActionDataType = QueryData<ReturnType<typeof buildActionDataQuery>>;

export const buildStrategyCountQuery = async (supabase: ReturnType<typeof createClient>) => {
  const res = await supabase.from('strategies').select('*', { count: 'estimated', head: true }).eq('is_public', true);

  return res;
};

export const buildStrategiesDataQuery = async (
  supabase: ReturnType<typeof createClient>,
  page: number,
  limit: number,
) => {
  const res = await supabase
    .from('strategies')
    .select(
      `id, name, version, subversion, modified_at, created_at,
      raids(name),
      like_counts(user_likes, anon_likes), 
      strategy_players(id, job, order)`,
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (res.data) for (const strategy of res.data) strategy.strategy_players.sort((a, b) => a.order - b.order);

  return res;
};

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

  if (res.data) res.data.strategy_players.sort((a, b) => a.order - b.order);

  return res;
};

export type StrategyDataType = QueryData<ReturnType<typeof buildStrategyDataQuery>>;

export const buildRaidsDataQuery = async (supabase: ReturnType<typeof createClient>) => supabase.from('raids').select();

export type RaidsDataType = QueryData<ReturnType<typeof buildRaidsDataQuery>>;
