'use server';

import { DEFAULT_LIMIT, DEFAULT_SORT, type SearchSearchParamsRaw, buildSearchURL, tryParseInt } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { LimitCombobox } from '../components/LimitCombobox';
import { SortCombobox } from '../components/SortCombobox';
import { SearchForm } from './components/SearchForm';
import { SearchPagination } from './components/SearchPagination';
import { SearchStrategyTable } from './components/SearchStrategyTable';

type BoardPageProps = Readonly<{
  params: { locale: string };
  searchParams: Partial<SearchSearchParamsRaw>;
}>;

export default async function BoardPage({ params: { locale }, searchParams }: BoardPageProps) {
  const q = searchParams.q;
  const raid = searchParams.raid;
  const page = tryParseInt(searchParams.page, false);
  const limit = tryParseInt(searchParams.limit, false);
  const sort = searchParams.sort;

  // Redirect to default if page or limit is not a valid number
  const qExist = q !== undefined && q !== '';
  const limitValid = limit !== null && limit > 0;
  const pageValid = page !== null && page > 0;
  const sortValid = sort === 'like' || sort === 'recent';
  const paramValid = limitValid && pageValid && sortValid;
  if (qExist && !paramValid)
    redirect(
      buildSearchURL(searchParams, {
        page: pageValid ? page : 1,
        limit: limitValid ? limit : DEFAULT_LIMIT,
        sort: sortValid ? sort : DEFAULT_SORT,
      }),
    );

  return (
    <div className="flex flex-col w-full max-w-screen-xl px-4 py-1">
      <div className="px-4 mt-2 mb-8">
        <SearchForm q={q ?? ''} />
        {qExist && paramValid && (
          <>
            <SearchStrategyTable q={q} raid={raid} page={page} limit={limit} sort={sort} />
            <div className="w-full flex flex-col-reverse xl:grid xl:grid-cols-3 gap-y-2 mt-2">
              <div />
              <SearchPagination q={q} raid={raid} currentPage={page} limit={limit} />
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
