'use server';

import type { QueryData } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { createClient } from '../supabase/server';
import type { ArrayElement, Patch, SelectableJob, SortOption } from '../utils';

export const buildActionDataQuery = (supabase: ReturnType<typeof createClient>) => {
  return supabase.from('actions').select('*, mitigations(*)').order('priority');
};

export type ActionDataType = QueryData<ReturnType<typeof buildActionDataQuery>>;

export const buildStrategyCountQuery = async (
  supabase: ReturnType<typeof createClient>,
  params: { q?: string; raid_skey?: string; patch?: Patch; jobs?: SelectableJob[] },
) => {
  return supabase.rpc('count_strategies', params);
};

export const buildMaxPageQuery = async (
  supabase: ReturnType<typeof createClient>,
  limit: number,
  params: { q?: string; raid_skey?: string; patch?: Patch; jobs?: SelectableJob[] },
) => {
  const { data, error } = await buildStrategyCountQuery(supabase, params);
  if (error) return { data: null, error };

  const maxPage = Math.floor(((data ?? 1) - 1) / limit) + 1;
  return { data: maxPage, error: null };
};

export const buildStrategiesDataQuery = async (
  supabase: ReturnType<typeof createClient>,
  params: {
    q?: string;
    raid_skey?: string;
    patch?: Patch;
    page: number;
    lim: number;
    sort?: SortOption;
    jobs?: SelectableJob[];
  },
) => {
  const { data, error } = await supabase.rpc('select_strategies', params);
  if (data === null || error) return { data: null, error };
  return { data: data as ViewStrategiesDataType, error };
};

type ViewStrategyType = Readonly<
  Omit<ArrayElement<Database['public']['Functions']['select_strategies']['Returns']>, 'strategy_players'> & {
    strategy_players:
      | {
          id: string;
          job: SelectableJob | null;
          order: number;
        }[]
      | null;
  }
>;
export type ViewStrategiesDataType = Readonly<ViewStrategyType[]>;

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
