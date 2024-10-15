'use server';

import {
  type BoardSearchParamsRaw,
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  buildBoardURL,
  tryParseInt,
  tryParseVersion,
} from '@/lib/utils';
import { redirect } from 'next/navigation';
import { LimitCombobox } from '../components/LimitCombobox';
import { BoardPagination } from './components/BoardPagination';
import { BoardStrategyTable } from './components/BoardStrategyTable';
import { BoardSubheader } from './components/BoardSubheader';
import { SortCombobox } from '../components/SortCombobox';

type BoardPageProps = Readonly<{
  params: { locale: string };
  searchParams: Partial<BoardSearchParamsRaw>;
}>;

export default async function BoardPage({ params: { locale }, searchParams }: BoardPageProps) {
  const raid = searchParams.raid;
  const page = tryParseInt(searchParams.page, false);
  const limit = tryParseInt(searchParams.limit, false);
  const version = tryParseVersion(searchParams.version) ?? undefined;
  const sort = searchParams.sort;

  // Redirect to default if page or limit is not a valid number
  const versionValid = searchParams.version === undefined || version !== undefined;
  const pageValid = page !== null && page > 0;
  const limitValid = limit !== null && limit > 0;
  const sortValid = sort === 'like' || sort === 'recent';
  const paramValid = versionValid && pageValid && limitValid && sortValid;
  if (!paramValid)
    redirect(
      buildBoardURL(searchParams, {
        version: versionValid ? version : undefined,
        page: pageValid ? page : 1,
        limit: limitValid ? limit : DEFAULT_LIMIT,
        sort: sortValid ? sort : DEFAULT_SORT,
      }),
    );

  return (
    <div className="flex flex-col w-full max-w-screen-xl px-4 py-1">
      <BoardSubheader />
      <div className="px-4 mt-2 mb-8">
        <BoardStrategyTable raid={raid} version={version} page={page} limit={limit} sort={sort} />
        <div className="w-full flex flex-col-reverse lg:grid lg:grid-cols-3 gap-y-2 mt-2">
          <div />
          <BoardPagination raid={raid} version={version} currentPage={page} limit={limit} />
          <div className="flex text-xs flex-row-reverse gap-x-2">
            <LimitCombobox currentLimit={limit} />
            <SortCombobox currentSort={sort} />
          </div>
        </div>
      </div>
    </div>
  );
}
