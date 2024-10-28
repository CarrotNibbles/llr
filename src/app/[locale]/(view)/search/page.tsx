'use server';

import { buildMaxPageQuery, buildRaidsDataQuery, buildStrategiesDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import {
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  type SearchSearchParamsRaw,
  buildSearchURL,
  tryParseInt,
  tryParseJobs,
  tryParsePatch,
} from '@/lib/utils';
import { redirect } from 'next/navigation';
import { LimitCombobox } from '../components/LimitCombobox';
import { SortCombobox } from '../components/SortCombobox';
import { StrategyTable } from '../components/StrategyTable';
import { ViewPagination } from '../components/ViewPagination';
import { SearchForm } from './components/SearchForm';

type BoardPageProps = Readonly<{
  params: { locale: string };
  searchParams: Partial<SearchSearchParamsRaw>;
}>;

export default async function BoardPage({ params: { locale }, searchParams }: BoardPageProps) {
  const supabase = createClient();

  const q = searchParams.q;
  const raid = searchParams.raid;
  const patch = tryParsePatch(searchParams.patch) ?? undefined;
  const jobs = tryParseJobs(searchParams.jobs) ?? undefined;
  const page = tryParseInt(searchParams.page, false);
  const limit = tryParseInt(searchParams.limit, false);
  const sort = searchParams.sort;

  // Redirect to default if page or limit is not a valid number
  const queried = q !== undefined || patch !== undefined || jobs !== undefined;
  const patchValid = searchParams.patch === undefined || patch !== undefined;
  const jobsValid = searchParams.jobs === undefined || jobs !== undefined;
  const pageValid = page !== null && page > 0;
  const limitValid = limit !== null && limit > 0;
  const sortValid = sort === 'like' || sort === 'recent';
  const paramsValid = patchValid && jobsValid && pageValid && limitValid && sortValid;

  if (queried && !paramsValid)
    redirect(
      buildSearchURL(searchParams, {
        q,
        patch: patchValid ? patch : undefined,
        jobs: jobsValid ? jobs : undefined,
        page: pageValid ? page : 1,
        limit: limitValid ? limit : DEFAULT_LIMIT,
        sort: sortValid ? sort : DEFAULT_SORT,
      }),
    );

  return (
    <div className="flex flex-col w-full max-w-screen-xl px-4 py-1">
      <div className="px-4 mt-2 mb-8">
        <SearchForm q={q} raid={raid} patch={patch} jobs={jobs} dataPromise={buildRaidsDataQuery(supabase)} />
        {queried && paramsValid && (
          <>
            <StrategyTable
              dataPromise={buildStrategiesDataQuery(supabase, {
                q,
                raid_skey: raid,
                patch,
                page,
                lim: limit,
                sort,
                jobs,
              })}
            />
            <div className="w-full flex flex-col-reverse xl:grid xl:grid-cols-3 gap-y-2 mt-2">
              <div />
              <ViewPagination
                currentPage={page}
                dataPromise={buildMaxPageQuery(supabase, limit, { q, raid_skey: raid, patch, jobs })}
              />
              <div className="flex flex-row-reverse gap-x-2">
                <LimitCombobox currentLimit={limit} />
                <SortCombobox currentSort={sort} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
