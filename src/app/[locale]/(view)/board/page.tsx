'use server';

import { buildMaxPageQuery, buildStrategiesDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import {
  type BoardSearchParamsRaw,
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  buildBoardURL,
  tryParseInt,
  tryParseJobs,
  tryParsePatch,
} from '@/lib/utils';
import { redirect } from 'next/navigation';
import { LimitCombobox } from '../components/LimitCombobox';
import { SortCombobox } from '../components/SortCombobox';
import { StrategyTable } from '../components/StrategyTable';
import { ViewPagination } from '../components/ViewPagination';
import { BoardSubheader } from './components/BoardSubheader';

type BoardPageProps = Readonly<{
  params: { locale: string };
  searchParams: Partial<BoardSearchParamsRaw>;
}>;

export default async function BoardPage({ params: { locale }, searchParams }: BoardPageProps) {
  const supabase = createClient();

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
    <div className="flex flex-col w-full max-w-screen-xl px-4 py-1">
      <BoardSubheader />
      <div className="px-4 mt-2 mb-8">
        <StrategyTable dataPromise={buildStrategiesDataQuery(supabase, { raid, patch, page, limit, sort, jobs: ['NIN'] })} />
        <div className="w-full flex flex-col-reverse lg:grid lg:grid-cols-3 gap-y-2 mt-2">
          <div />
          <ViewPagination currentPage={page} dataPromise={buildMaxPageQuery(supabase, limit, { raid, patch })} />
          <div className="flex text-xs flex-row-reverse gap-x-2">
            <LimitCombobox currentLimit={limit} />
            <SortCombobox currentSort={sort} />
          </div>
        </div>
      </div>
    </div>
  );
}
