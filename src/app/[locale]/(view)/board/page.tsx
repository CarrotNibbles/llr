'use server';

import { buildMaxPageQuery, buildStrategiesDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LimitCombobox } from '../components/LimitCombobox';
import { SortCombobox } from '../components/SortCombobox';
import { StrategyTable } from '../components/StrategyTable';
import { ViewPagination } from '../components/ViewPagination';
import { DEFAULT_LIMIT, DEFAULT_SORT } from '../utils/constants';
import { buildBoardURL, tryParseInt, tryParseJobs, tryParsePatch } from '../utils/helpers';
import type { BoardSearchParamsRaw } from '../utils/types';
import { BoardSubheader } from './components/BoardSubheader';

type BoardPageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<Partial<BoardSearchParamsRaw>>;
}>;

export default async function BoardPage(props: BoardPageProps) {
  const searchParams = await props.searchParams;

  const supabase = await createClient();

  const raid = searchParams.raid;
  const page = tryParseInt(searchParams.page, false);
  const limit = tryParseInt(searchParams.limit, false);
  const patch = tryParsePatch(searchParams.patch) ?? undefined;
  const jobs = tryParseJobs(searchParams.jobs) ?? undefined;
  const sort = searchParams.sort;

  // Redirect to default if page or limit is not a valid number
  const patchValid = searchParams.patch === undefined || patch !== undefined;
  const jobsValid = searchParams.jobs === undefined || jobs === undefined;
  const pageValid = page !== null && page > 0;
  const limitValid = limit !== null && limit > 0;
  const sortValid = sort === 'like' || sort === 'recent';
  const paramsValid = patchValid && jobsValid && pageValid && limitValid && sortValid;
  if (!paramsValid)
    redirect(
      buildBoardURL(searchParams, {
        patch: patchValid ? patch : undefined,
        page: pageValid ? page : 1,
        limit: limitValid ? limit : DEFAULT_LIMIT,
        sort: sortValid ? sort : DEFAULT_SORT,
      }),
    );

  return (
    <div className="flex flex-col w-full max-w-screen-xl px-6 py-3">
      <BoardSubheader />
      <div className="mt-2 mb-8">
        <StrategyTable
          dataPromise={buildStrategiesDataQuery(supabase, { raid_skey: raid, patch, page, lim: limit, sort, jobs })}
        />
        <div className="w-full flex flex-col-reverse lg:grid lg:grid-cols-3 gap-y-4 mt-2 lg:mt-4">
          <div />
          <ViewPagination
            currentPage={page}
            dataPromise={buildMaxPageQuery(supabase, limit, { raid_skey: raid, patch, jobs })}
          />
          <div className="flex text-xs flex-row justify-end gap-x-2">
            <SortCombobox currentSort={sort} />
            <LimitCombobox currentLimit={limit} />
          </div>
        </div>
      </div>
    </div>
  );
}
