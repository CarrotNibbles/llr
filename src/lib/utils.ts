import { type ClassValue, clsx } from 'clsx';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import type { Enums } from './database.types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type NonEmptyArray<T> = [T, ...T[]];
export type ArrayElement<T> = T extends Array<infer R> ? R : never;

const notNullOrUndefined = <ValueType>(value: ValueType | undefined): value is ValueType =>
  value !== null && value !== undefined;
const filteredMin = (...values: Array<number | undefined>) => Math.min(...values.filter(notNullOrUndefined));
const filteredMax = (...values: Array<number | undefined>) => Math.max(...values.filter(notNullOrUndefined));
export const clamp = (num: number, min?: number, max?: number) => filteredMax(filteredMin(num, max), min);

export const patchRegex = /^[234567]\.[012345]$/;
export type Patch = Readonly<{
  version: number;
  subversion: number;
}>;

export const ALL_PATCHES = [
  { version: 2, subversion: 0 },
  { version: 2, subversion: 1 },
  { version: 2, subversion: 2 },
  { version: 2, subversion: 3 },
  { version: 2, subversion: 4 },
  { version: 2, subversion: 5 },
  { version: 3, subversion: 0 },
  { version: 3, subversion: 1 },
  { version: 3, subversion: 2 },
  { version: 3, subversion: 3 },
  { version: 3, subversion: 4 },
  { version: 3, subversion: 5 },
  { version: 4, subversion: 0 },
  { version: 4, subversion: 1 },
  { version: 4, subversion: 2 },
  { version: 4, subversion: 3 },
  { version: 4, subversion: 4 },
  { version: 4, subversion: 5 },
  { version: 5, subversion: 0 },
  { version: 5, subversion: 1 },
  { version: 5, subversion: 2 },
  { version: 5, subversion: 3 },
  { version: 5, subversion: 4 },
  { version: 5, subversion: 5 },
  { version: 6, subversion: 0 },
  { version: 6, subversion: 1 },
  { version: 6, subversion: 2 },
  { version: 6, subversion: 3 },
  { version: 6, subversion: 4 },
  { version: 6, subversion: 5 },
  { version: 7, subversion: 0 },
] as const satisfies Patch[];

export type Role = 'Tank' | 'Healer' | 'DPS' | 'Others';
export type DiversedRole = 'Tank' | 'Healer' | 'Ranged' | 'Melee' | 'Caster';

export const getRole = (job: Enums<'job'>): Role => {
  switch (job) {
    case 'PLD':
    case 'WAR':
    case 'DRK':
    case 'GNB':
      return 'Tank';
    case 'WHM':
    case 'SCH':
    case 'AST':
    case 'SGE':
      return 'Healer';
    case 'LB':
      return 'Others';
    default:
      return 'DPS';
  }
};

export const getDiversedRole = (job: Exclude<Enums<'job'>, 'LB'>): DiversedRole => {
  switch (job) {
    case 'PLD':
    case 'WAR':
    case 'DRK':
    case 'GNB':
      return 'Tank';
    case 'WHM':
    case 'SCH':
    case 'AST':
    case 'SGE':
      return 'Healer';
    case 'BRD':
    case 'MCH':
    case 'DNC':
      return 'Ranged';
    case 'BLM':
    case 'RDM':
    case 'SMN':
    case 'PCT':
    case 'BLU':
      return 'Caster';
    default:
      return 'Melee';
  }
};

export const getOrderedRole = (job: Enums<'job'> | null, order: number): Role => {
  if (job === null || job === 'LB') {
    if (1 <= order && order <= 2) return 'Tank';
    if (3 <= order && order <= 4) return 'Healer';
    if (5 <= order && order <= 8) return 'DPS';
    return 'Others';
  }

  return getRole(job);
};

export const DEFAULT_LIMIT = 10;
export const SEARCH_BUTTON_LIMIT = 5;
export const SEARCH_BUTTON_MOBILE_LIMIT = 3;
export const PAGINATION_OFFSET = 2;
export const PAGINATION_TOTAL_PAGE = PAGINATION_OFFSET * 2 + 1;

export const tryParseInt = (input: string | undefined | null, allowNegative = false): number | null => {
  if (input === undefined || input === null) return null;

  // Regular expression to check for a valid integer (positive or negative)
  const integerRegex = allowNegative ? /^-?\d+$/ : /^\d+$/;

  if (integerRegex.test(input)) return Number.parseInt(input, 10);

  return null;
};

export const tryParsePatch = (input: string | undefined | null): Patch | null => {
  if (input === undefined || input === null) return null;

  if (!patchRegex.test(input)) return null;

  const [version, subversion] = input.split('.').map(Number);
  return { version, subversion };
};

export const tryParseJobs = (input: string | undefined | null): SelectableJob[] | null => {
  if (input === undefined || input === null) return null;

  const jobs = input.split(',');
  if (jobs.some((job) => !ALL_SELECTABLE_JOBS.includes(job as SelectableJob))) return null;

  return jobs as SelectableJob[];
};

export const buildURL = (
  url: string,
  ...searchParams: (
    | Record<string, string | number | Patch | null | undefined | string[]>
    | [string, string | number | Patch | null | undefined | string[]]
    | URLSearchParams
    | ReadonlyURLSearchParams
  )[]
) => {
  const newSearchParams = new URLSearchParams();

  for (const searchParam of searchParams) {
    if (Array.isArray(searchParam)) {
      const [key, value] = searchParam;

      if (value === null || value === undefined) newSearchParams.delete(key);
      else if (typeof value === 'string') newSearchParams.set(key, value);
      else if (typeof value === 'number') newSearchParams.set(key, value.toString());
      else if (Array.isArray(value)) newSearchParams.set(key, value.join(','));
      else newSearchParams.set(key, `${value.version}.${value.subversion}`);
    } else if (searchParam instanceof URLSearchParams || searchParam instanceof ReadonlyURLSearchParams) {
      for (const [key, value] of searchParam.entries()) {
        newSearchParams.set(key, value);
      }
    } else {
      for (const key of Object.keys(searchParam)) {
        const value = searchParam[key];

        if (value === undefined || value === null) newSearchParams.delete(key);
        else if (typeof value === 'string') newSearchParams.set(key, value);
        else if (typeof value === 'number') newSearchParams.set(key, value.toString());
        else if (Array.isArray(value)) newSearchParams.set(key, value.join(','));
        else newSearchParams.set(key, `${value.version}.${value.subversion}`);
      }
    }
  }

  return `${url}?${newSearchParams.toString()}`;
};

export const Q_PARAM = 'q';
export const PAGE_PARAM = 'page';
export const LIMIT_PARAM = 'limit';
export const SORT_PARAM = 'sort';
export const RAID_PARAM = 'raid';
export const PATCH_PARAM = 'patch';
export const JOBS_PARAM = 'jobs';

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

export const buildBoardURL = (
  ...searchParams: (
    | Partial<BoardSearchParams>
    | [BoardSearchParamKeys, string | number | null | undefined]
    | URLSearchParams
    | ReadonlyURLSearchParams
  )[]
) => buildURL('/board', ...searchParams);

export const buildSearchURL = (
  ...searchParams: (
    | Partial<SearchSearchParams>
    | [SearchSearchParamKeys, string | number | null | undefined]
    | URLSearchParams
    | ReadonlyURLSearchParams
  )[]
) => buildURL('/search', ...searchParams);

export const rangeInclusive = (start: number, end: number): number[] => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

export const NAV_RAID_CATEGORIES = ['Savage', 'Ultimate'] as const;
export const ALL_RAIG_CATEGORIES = ['Savage', 'Ultimate', 'Trial', 'Raid', 'Dungeon'] as const;

export const ALL_SORT_OPTIONS = ['like', 'recent'] as const;
export type SortOption = (typeof ALL_SORT_OPTIONS)[number];
export const DEFAULT_SORT: SortOption = 'like';

export type StaticAssert<T extends true> = never;
export type TypeEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;

export type SelectableJob = Exclude<Enums<'job'>, 'BLU' | 'LB'>;
// biome-ignore format: job array too long
export const ALL_SELECTABLE_JOBS = [
  'PLD', 'WAR', 'DRK', 'GNB',
  'WHM', 'SCH', 'AST', 'SGE',
  'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR',
  'BRD', 'MCH', 'DNC',
  'BLM', 'SMN', 'RDM', 'PCT',
] as const;
/* prettier-ignore-end */
type SelectableJobsExhaustive = StaticAssert<TypeEqual<(typeof ALL_SELECTABLE_JOBS)[number], SelectableJob>>;

export const sortJobs = (jobs: SelectableJob[]) =>
  jobs.sort((job1, job2) => ALL_SELECTABLE_JOBS.indexOf(job1) - ALL_SELECTABLE_JOBS.indexOf(job2));

export const JOB_LAYOUT = [
  ['PLD', 'WAR', 'DRK', 'GNB'],
  ['WHM', 'SCH', 'AST', 'SGE'],
  ['MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR'],
  ['BRD', 'MCH', 'DNC'],
  ['BLM', 'SMN', 'RDM', 'PCT'],
  [null],
] satisfies (Enums<'job'> | null)[][];
