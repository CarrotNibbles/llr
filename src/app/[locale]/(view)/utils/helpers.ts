import { ALL_SELECTABLE_JOBS, PATCH_REGEX } from '@/lib/utils/constants';
import type { Patch } from '@/lib/utils/types';
import { ReadonlyURLSearchParams } from 'next/navigation';
import type {
  BoardSearchParamKeys,
  BoardSearchParams,
  SearchSearchParamKeys,
  SearchSearchParams,
  SelectableJob,
} from './types';

export const tryParseInt = (input: string | undefined | null, allowNegative = false): number | null => {
  if (input === undefined || input === null) return null;

  // Regular expression to check for a valid integer (positive or negative)
  const integerRegex = allowNegative ? /^-?\d+$/ : /^\d+$/;

  if (integerRegex.test(input)) return Number.parseInt(input, 10);

  return null;
};

export const tryParsePatch = (input: string | undefined | null): Patch | null => {
  if (input === undefined || input === null) return null;

  if (!PATCH_REGEX.test(input)) return null;

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
    | Record<string, string | number | Patch | null | undefined | string[] | boolean>
    | [string, string | number | Patch | null | undefined | string[] | boolean]
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
      else if (typeof value === 'boolean') newSearchParams.set(key, value.toString());
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
        else if (typeof value === 'boolean') newSearchParams.set(key, value.toString());
        else if (Array.isArray(value)) newSearchParams.set(key, value.join(','));
        else newSearchParams.set(key, `${value.version}.${value.subversion}`);
      }
    }
  }

  return `${url}?${newSearchParams.toString()}`;
};

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

export const sortJobs = (jobs: SelectableJob[]) =>
  jobs.sort((job1, job2) => ALL_SELECTABLE_JOBS.indexOf(job1) - ALL_SELECTABLE_JOBS.indexOf(job2));

export const removeUndefinedFields = <T extends Record<string, unknown>>(obj: T) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined)) as {
    [K in keyof T]: Exclude<T[K], undefined>;
  };
};
