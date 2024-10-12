'use server';

import { buildRaidsDataQuery, buildStrategiesDataQuery, buildStrategyCountQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { buildURL, DEFAULT_LIMIT, tryParseInt } from '@/lib/utils';
import { BoardHeader } from './components/BoardHeader';
import { BoardSubHeader } from './components/BoardSubHeader';
import { StrategyTable } from './components/StrategyTable';
import { redirect } from 'next/navigation';
import { BoardPagination } from './components/BoardPagination';
import { Button } from '@/components/ui/button';
import { LimitCombobox } from './components/LimitCombobox';

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

  const { data: strategiesData, error: strategiesDataQueryError } = await buildStrategiesDataQuery(
    supabase,
    page,
    limit,
  );
  if (strategiesDataQueryError || strategiesData === null) throw strategiesDataQueryError;

  return (
    <div className="flex flex-col items-center">
      <BoardHeader />
      <div className="flex flex-col w-full max-w-screen-xl px-4 py-1">
        <BoardSubHeader raidsData={raidsData} />
        <div className="px-4 mt-2 mb-8">
          <StrategyTable strategiesData={strategiesData} />
          <div className="w-full flex h-10 mt-2 relative">
            <BoardPagination currentPage={page} maxPage={maxPage} />
            <div className="absolute flex flex-row-reverse right-0 top-0 bottom-0">
              <LimitCombobox currentLimit={limit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
