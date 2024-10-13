import type React from 'react';
import { StrategyTable } from '../../components/StrategyTable';
import { createClient } from '@/lib/supabase/server';
import { buildBoardStrategiesDataQuery } from '@/lib/queries/server';

type BoardStrategyTableProps = Readonly<
  React.ComponentProps<'table'> & {
    page: number;
    limit: number;
  }
>;
const BoardStrategyTable: React.FC<BoardStrategyTableProps> = ({ page, limit, className, ...props }) => {
  const supabase = createClient();

  const fetchData = async () => {
    const { data: strategiesData, error: strategiesDataQueryError } = await buildBoardStrategiesDataQuery(
      supabase,
      page,
      limit,
    );
    if (strategiesDataQueryError || strategiesData === null) throw strategiesDataQueryError;

    return { strategiesData };
  };

  return <StrategyTable dataPromise={fetchData()} />;
};
BoardStrategyTable.displayName = 'BoardStrategyTable';

export { BoardStrategyTable };
