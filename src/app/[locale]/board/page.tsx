'use server';

import { buildRaidsDataQuery, buildStrategiesDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { BoardHeader } from './components/BoardHeader';
import { BoardSubHeader } from './components/BoardSubHeader';
import { StrategyTable } from './components/StrategyTable';

type BoardPageProps = Readonly<{
  params: { locale: string };
}>;

export default async function BoardPage({ params: { locale } }: BoardPageProps) {
  const supabase = createClient();
  const { data: raidsData, error: raidsDataQueryError } = await buildRaidsDataQuery(supabase);
  const { data: strategiesData, error: strategiesDataQueryError } = await buildStrategiesDataQuery(supabase);

  if (raidsDataQueryError || raidsData === null) throw raidsDataQueryError;
  if (strategiesDataQueryError || strategiesData === null) throw strategiesDataQueryError;

  return (
    <div className="flex flex-col items-center">
      <BoardHeader />
      <div className="flex flex-col w-full max-w-screen-xl px-4 py-1">
        <BoardSubHeader raidsData={raidsData} />
        <div className="px-4 mt-2">
          <StrategyTable strategiesData={strategiesData} />
        </div>
      </div>
    </div>
  );
}
