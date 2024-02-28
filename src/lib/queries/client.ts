import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { type createClient } from '../supabase/server';
import { type Equals, type RescueType } from '../utils';
import {
  type StrategyDataType,
  type StrategyCardDataType,
  type RaidDataType,
  type AbilityDataType,
} from './server';
import { type PostgrestSingleResponse } from '@supabase/supabase-js';

export type RaidFallbackDataType = PostgrestSingleResponse<RaidDataType>;
export const useRaidDataQuery = (
  supabase: ReturnType<typeof createClient>,
  raidId: string,
  fallbackData: RaidFallbackDataType,
) => {
  return useQuery(
    supabase
      .from('gimmicks')
      .select(
        `
    cast_at, id, name, prepare_at, raid, resolve_at, type
    , damages(
      combined_damage, gimmick, id, max_shared, num_targets, target, type
    )
    `,
      )
      .eq('raid', raidId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fallbackData,
    },
  );
};

export type AbilityFallbackDataType = PostgrestSingleResponse<AbilityDataType>;
export const useAbilityDataQuery = (
  supabase: ReturnType<typeof createClient>,
  fallbackData: AbilityFallbackDataType,
) => {
  return useQuery(
    supabase.from('abilities').select(`
    cooldown, icon_url, id, job, name, stacks
    , mitigations(_mitigation_id, ability, duration, is_raidwide, potency, rate, type)
    `),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fallbackData,
    },
  );
};

export type StrategyCardFallbackDataType = PostgrestSingleResponse<StrategyCardDataType>;
export const useStrategyCardDataQuery = (
  supabase: ReturnType<typeof createClient>,
  raidId: string,
  fallbackData: StrategyCardFallbackDataType,
) => {
  return useQuery(
    supabase
      .from('strategies')
      .select(
        `id, author, created_at, is_public, modified_at, name, raid, likes,
      strategy_players(id, job, strategy)`,
      )
      .eq('raid', raidId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fallbackData,
    },
  );
};

// eslint-disable-next-line
export type StrategyFallbackDataType = PostgrestSingleResponse<StrategyDataType | null>;
export const useStrategyDataQuery = (
  supabase: ReturnType<typeof createClient>,
  strategyId: string,
  fallbackData: StrategyFallbackDataType,
) => {
  return useQuery(
    supabase
      .from('strategies')
      .select(
        `author, created_at, id, is_public, likes, modified_at, name, raid,
        strategy_players(id, job, strategy, strategy_player_entries(ability, player, use_at)),
        strategy_damage_options(damage, num_shared, primary_target, strategy),
        raids!inner(category, duration, headcount, id, name, 
          gimmicks(cast_at, id, name, prepare_at, raid, resolve_at, type, 
            damages(combined_damage, gimmick, id, max_shared, num_targets, target, type)))`,
      )
      .eq('id', strategyId)
      .maybeSingle(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fallbackData,
    },
  );
};

type ServerRaidDataType = RescueType<ReturnType<typeof useRaidDataQuery>>;
type ServerRaidDataTypeCheck = Equals<RaidDataType, ServerRaidDataType[]>;

type ServerAbilityDataType = RescueType<ReturnType<typeof useAbilityDataQuery>>;
type ServerAbilityDataTypeCheck = Equals<AbilityDataType, ServerAbilityDataType[]>;

type ServerStrategyCardDataTypeCheck = RescueType<ReturnType<typeof useStrategyCardDataQuery>>;
type StrategyCardDataTypeCheck = Equals<StrategyCardDataType, ServerStrategyCardDataTypeCheck[]>;

type ClientStrategyDataType = RescueType<ReturnType<typeof useStrategyDataQuery>>;
type StrategyDataTypeCheck = Equals<StrategyDataType, ClientStrategyDataType>;
