import { buildStrategiesDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import type React from 'react';
import { StrategyTable } from '../../components/StrategyTable';

type BoardStrategyTableProps = Readonly<
  React.ComponentProps<'table'> & {
    q: string;
    page: number;
    limit: number;
  }
>;
const SearchStrategyTable: React.FC<BoardStrategyTableProps> = ({ q, page, limit, className, ...props }) => {
  const supabase = createClient();

  const fetchData = async () => {
    const { data: strategiesData, error: strategiesDataQueryError } = await buildStrategiesDataQuery(supabase, {
      page,
      limit,
      q,
    });
    if (strategiesDataQueryError || strategiesData === null) throw strategiesDataQueryError;

    return { strategiesData };
  };

  return <StrategyTable dataPromise={fetchData()} className={className} {...props} />;
};
SearchStrategyTable.displayName = 'SearchStrategyTable';

export { SearchStrategyTable };
