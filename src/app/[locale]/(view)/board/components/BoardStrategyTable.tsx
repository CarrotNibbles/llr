import { buildStrategiesDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import type { BoardSearchParamsParsed } from '@/lib/utils';
import type React from 'react';
import { StrategyTable } from '../../components/StrategyTable';

type BoardStrategyTableProps = Readonly<React.ComponentProps<'table'> & BoardSearchParamsParsed>;
const BoardStrategyTable: React.FC<BoardStrategyTableProps> = ({ raid, version, page, limit, sort, className, ...props }) => {
  const supabase = createClient();

  const fetchData = async () => {
    const { data: strategiesData, error: strategiesDataQueryError } = await buildStrategiesDataQuery(supabase, {
      raid,
      version,
      page,
      limit,
      sort,
    });
    if (strategiesDataQueryError || strategiesData === null) throw strategiesDataQueryError;

    return { strategiesData };
  };

  return <StrategyTable dataPromise={fetchData()} className={className} {...props} />;
};
BoardStrategyTable.displayName = 'BoardStrategyTable';

export { BoardStrategyTable };
