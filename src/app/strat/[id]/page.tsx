'use server';

import { buildAbilityDataQuery, buildStrategyDataQuery } from '@/lib/queries';
import { createClient } from '@/lib/supabase/server';
import { CoreArea } from './components/CoreArea';
import { StratHeader } from './components/StratHeader';

export default async function StratPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: strategyData, error: strategyDataQueryError } = await buildStrategyDataQuery(
    supabase,
    params.id,
  );
  const { data: abilityData, error: abilityDataQueryError } = await buildAbilityDataQuery(supabase);

  // eslint-disable-next-line
  if (strategyDataQueryError || strategyData === null) throw strategyDataQueryError;

  // eslint-disable-next-line
  if (abilityDataQueryError || abilityData === null) throw abilityDataQueryError;

  return (
    <div className="flex flex-col max-h-screen h-screen">
      <StratHeader strategyData={strategyData} />
      <CoreArea strategyData={strategyData} abilityData={abilityData} />
    </div>
  );
}
