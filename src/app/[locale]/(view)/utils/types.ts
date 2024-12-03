import type { Enums } from '@/lib/database.types';
import type { ALL_SELECTABLE_JOBS } from '@/lib/utils/constants';
import type { Patch } from '@/lib/utils/types';
import {
  type ALL_SORT_OPTIONS,
  JOBS_PARAM,
  LIMIT_PARAM,
  PAGE_PARAM,
  PATCH_PARAM,
  Q_PARAM,
  RAID_PARAM,
  SORT_PARAM,
} from './constants';

export type BoardSearchParamsRaw = {
  [RAID_PARAM]?: string;
  [PATCH_PARAM]?: string;
  [JOBS_PARAM]?: string;
  [PAGE_PARAM]: string;
  [LIMIT_PARAM]: string;
  [SORT_PARAM]: string;
};
export type BoardSearchParamsParsed = {
  [RAID_PARAM]?: string;
  [PATCH_PARAM]?: Patch;
  [JOBS_PARAM]?: SelectableJob[];
  [PAGE_PARAM]: number;
  [LIMIT_PARAM]: number;
  [SORT_PARAM]: SortOption;
};
export type BoardSearchParams = BoardSearchParamsRaw | BoardSearchParamsParsed;
export type BoardSearchParamKeys = keyof BoardSearchParams;

export type SearchSearchParamsRaw = BoardSearchParamsRaw & {
  [Q_PARAM]: string;
};
export type SearchSearchParamsParsed = BoardSearchParamsParsed & {
  [Q_PARAM]: string;
};
export type SearchSearchParams = SearchSearchParamsRaw | SearchSearchParamsParsed;
export type SearchSearchParamKeys = keyof SearchSearchParams;

export type SortOption = (typeof ALL_SORT_OPTIONS)[number];

export type StaticAssert<T extends true> = never;
export type TypeEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;

export type SelectableJob = Exclude<Enums<'job'>, 'BLU' | 'LB'>;

type SelectableJobsExhaustive = StaticAssert<TypeEqual<(typeof ALL_SELECTABLE_JOBS)[number], SelectableJob>>;
