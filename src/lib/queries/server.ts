'use server';

import type { QueryData } from '@supabase/supabase-js';
import type { createClient } from '../supabase/server';
import type { SortOption, Patch } from '../utils';

export const buildActionDataQuery = (supabase: ReturnType<typeof createClient>) => {
  return supabase.from('actions').select('*, mitigations(*)').order('priority');
};

export type ActionDataType = QueryData<ReturnType<typeof buildActionDataQuery>>;

export const buildStrategyCountQuery = async (
  supabase: ReturnType<typeof createClient>,
  params: { q?: string; raid?: string; patch?: Patch },
) => {
  const { q, raid, patch } = params;

  let query = supabase
    .from('strategies')
    .select('*, raids!inner(semantic_key)', { count: 'exact', head: true })
    .eq('is_public', true);

  if (raid !== undefined) query = query.eq('raids.semantic_key', raid);
  if (patch !== undefined) query = query.eq('version', patch.version).eq('subversion', patch.subversion);
  if (q !== undefined) query = query.ilike('name', `%${q}%`);
  
  const res = await query;
  return res;
};

export const buildMaxPageQuery = async (
  supabase: ReturnType<typeof createClient>,
  limit: number,
  params: { q?: string; raid?: string; patch?: Patch },
) => {
  const { count, error } = await buildStrategyCountQuery(supabase, params);
  if (error) return { data: null, error };

  const maxPage = Math.floor((count ?? 1 - 1) / limit) + 1;
  return { data: maxPage, error: null };
};

export const buildStrategiesDataQuery = async (
  supabase: ReturnType<typeof createClient>,
  params: {
    q?: string;
    raid?: string;
    patch?: Patch;
    page: number;
    limit: number;
    sort: SortOption;
  },
) => {
  const { q, raid, patch, page, limit, sort } = params;
  let query = supabase
    .from('strategies')
    .select(
      `id, name, version, subversion, modified_at, created_at,
      raids!inner(name, semantic_key),
      like_counts!inner(total_likes), 
      strategy_players!inner(id, job, order)`,
    )
    .eq('is_public', true);

  if (raid !== undefined) query = query.eq('raids.semantic_key', raid);
  if (patch !== undefined) query = query.eq('version', patch.version).eq('subversion', patch.subversion);
  if (q !== undefined) query = query.ilike('name', `%${q}%`);
  
  if (sort === 'like') query = query.order('like_counts(total_likes)', { ascending: false });
  else if (sort === 'recent') query = query.order('created_at', { ascending: false });

  query = query.range((page - 1) * limit, page * limit - 1);

  const res = await query

  if (res.data) for (const strategy of res.data) strategy.strategy_players.sort((a, b) => a.order - b.order);

  return res;
};

export type BoardStrategiesDataType = QueryData<ReturnType<typeof buildStrategiesDataQuery>>;

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
