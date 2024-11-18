'use server';

import { removeUndefinedFields } from '@/app/[locale]/(view)/utils/helpers';
import type { SelectableJob, SortOption } from '@/app/[locale]/(view)/utils/types';
import type { ArrayElement, Patch } from '@/lib/utils/types';
import type { QueryData } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { createClient } from '../supabase/server';

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export const buildActionDataQuery = async (supabase: SupabaseServerClient) => {
  return supabase.from('actions').select('*, mitigations(*)').order('priority');
};

export type ActionDataType = QueryData<ReturnType<typeof buildActionDataQuery>>;

export const buildStrategyCountQuery = async (
  supabase: SupabaseServerClient,
  params: { q?: string; raid_skey?: string; patch?: Patch; jobs?: SelectableJob[] },
) => {
  return supabase.rpc('count_strategies', params);
};

export const buildMaxPageQuery = async (
  supabase: SupabaseServerClient,
  limit: number,
  params: { q?: string; raid_skey?: string; patch?: Patch; jobs?: SelectableJob[] },
) => {
  const { data, error } = await buildStrategyCountQuery(supabase, params);
  if (error) return { data: null, error };

  const maxPage = Math.floor(((data ?? 1) - 1) / limit) + 1;
  return { data: maxPage, error: null };
};

export const buildStrategiesDataQuery = async (
  supabase: SupabaseServerClient,
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
  const { data, error } = await supabase.rpc('select_strategies', removeUndefinedFields(params));
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

export const buildStrategyDataQuery = async (supabase: SupabaseServerClient, strategyId: string) => {
  const res = await supabase
    .from('strategies')
    .select(
      `*,
      like_counts(*),
      user_likes(*),
      notes(*),
      profiles!strategies_author_fkey(*),
      strategy_players(*, strategy_player_entries(*)),
      raids!inner(*, gimmicks(*, damages(*, strategy_damage_options(*))))`,
    )
    .eq('id', strategyId)
    .maybeSingle();

  if (res.data) res.data.strategy_players.sort((a, b) => a.order - b.order);

  return res;
};

export type StrategyDataType = QueryData<ReturnType<typeof buildStrategyDataQuery>>;

export const buildRaidsDataQuery = async (supabase: SupabaseServerClient) => supabase.from('raids').select();

export type RaidsDataType = QueryData<ReturnType<typeof buildRaidsDataQuery>>;
