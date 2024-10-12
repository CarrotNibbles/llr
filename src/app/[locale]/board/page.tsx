'use server';

import { buildRaidsDataQuery, buildStrategiesDataQuery, buildStrategyCountQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_LIMIT, buildURL, tryParseInt } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { BoardHeader } from './components/BoardHeader';
import { BoardPagination } from './components/BoardPagination';
import { BoardSubHeader } from './components/BoardSubHeader';
import { LimitCombobox } from './components/LimitCombobox';
import { StrategyTable } from './components/StrategyTable';
import { Suspense } from 'react';

type BoardPageProps = Readonly<{
  params: { locale: string };
  searchParams: { page?: string; limit?: string };
}>;

export default async function BoardPage({ params: { locale }, searchParams }: BoardPageProps) {
  const supabase = createClient();
  const page = tryParseInt(searchParams.page, false);
  const limit = tryParseInt(searchParams.limit, false);

  // Redirect to default if page or limit is not a valid number
  const limitValid = limit !== null && limit > 0;
  const pageValid = page !== null && page > 0;
  if (!limitValid || !pageValid)
    redirect(buildURL('/board', { page: pageValid ? page : 1, limit: limitValid ? limit : DEFAULT_LIMIT }));

  const { count: strategyCount, error: strategyCountQueryError } = await buildStrategyCountQuery(supabase);
  if (strategyCountQueryError || strategyCount === null) throw strategyCountQueryError;

  const maxPage = Math.floor((strategyCount - 1) / limit) + 1;
  if (page > maxPage) redirect(buildURL('/board', { page: maxPage, limit }));

  const { data: raidsData, error: raidsDataQueryError } = await buildRaidsDataQuery(supabase);
  if (raidsDataQueryError || raidsData === null) throw raidsDataQueryError;

  return (
    <div className="flex flex-col items-center">
      <BoardHeader />
      <div className="flex flex-col w-full max-w-screen-xl px-4 py-1">
        <BoardSubHeader raidsData={raidsData} />
        <div className="px-4 mt-2 mb-8">
          <StrategyTable page={page} limit={limit} />
          <div className="w-full flex flex-col-reverse md:grid md:grid-cols-3 gap-y-2 mt-2">
            <div />
            <BoardPagination currentPage={page} maxPage={maxPage} />
            <div className="flex flex-row-reverse">
              <LimitCombobox currentLimit={limit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
