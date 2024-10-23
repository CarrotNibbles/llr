'use server';

import { buildMaxPageQuery, buildRaidsDataQuery, buildStrategiesDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import {
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  type SearchSearchParamsRaw,
  buildSearchURL,
  tryParseInt,
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
  const page = tryParseInt(searchParams.page, false);
  const limit = tryParseInt(searchParams.limit, false);
  const sort = searchParams.sort;

  // Redirect to default if page or limit is not a valid number
  const qExist = q !== undefined;
  const patchValid = searchParams.patch === undefined || patch !== undefined;
  const pageValid = page !== null && page > 0;
  const limitValid = limit !== null && limit > 0;
  const sortValid = sort === 'like' || sort === 'recent';
  const paramValid = patchValid && pageValid && limitValid && sortValid;
  if (qExist && !paramValid)
    redirect(
      buildSearchURL(searchParams, {
        patch: patchValid ? patch : undefined,
        page: pageValid ? page : 1,
        limit: limitValid ? limit : DEFAULT_LIMIT,
        sort: sortValid ? sort : DEFAULT_SORT,
      }),
    );

  return (
    <div className="flex flex-col w-full max-w-screen-xl px-4 py-1">
      <div className="px-4 mt-2 mb-8">
        <SearchForm q={q ?? ''} dataPromise={buildRaidsDataQuery(supabase)} />
        {qExist && paramValid && (
          <>
            <StrategyTable dataPromise={buildStrategiesDataQuery(supabase, { q, raid, patch, page, limit, sort })} />
            <div className="w-full flex flex-col-reverse xl:grid xl:grid-cols-3 gap-y-2 mt-2">
              <div />
              <ViewPagination
                currentPage={page}
                dataPromise={buildMaxPageQuery(supabase, limit, { q, raid, patch })}
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
