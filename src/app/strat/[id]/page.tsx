'use server';

import { buildAbilityDataQuery, buildStrategyDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { CoreArea } from './components/CoreArea';
import { StratHeader } from './components/StratHeader';
import { fetchQueryFallbackData } from '@supabase-cache-helpers/postgrest-swr/react-server';

export default async function StratPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const abilityDataQuery = buildAbilityDataQuery(supabase);
  const { data: abilityData, error: abilityDataQueryError } = await abilityDataQuery;
  const strategyDataQuery = buildStrategyDataQuery(supabase, params.id);
  const { data: strategyData, error: strategyDataQueryError } = await strategyDataQuery;
  const [_, fallStrategyData] = await fetchQueryFallbackData(strategyDataQuery);

  // eslint-disable-next-line
  if (strategyDataQueryError || strategyData === null || fallStrategyData === null) throw strategyDataQueryError;

  // eslint-disable-next-line
  if (abilityDataQueryError || abilityData === null) throw abilityDataQueryError;

  return (
    <div className="flex flex-col max-h-screen h-screen">
      <StratHeader strategyData={strategyData} />
      <CoreArea
        strategyData={strategyData}
        abilityData={abilityData}
        strategyFallbackData={fallStrategyData}
        stratId={params.id}
      />
    </div>
  );
}
