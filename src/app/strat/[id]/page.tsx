'use server';

import { buildActionDataQuery, buildStrategyDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { CoreArea } from './components/CoreArea';
import { StratHeader } from './components/StratHeader';

export default async function StratPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: strategyData, error: strategyDataQueryError } = await buildStrategyDataQuery(supabase, params.id);
  const { data: actionData, error: actionDataQueryError } = await buildActionDataQuery(supabase);

  if (strategyDataQueryError || strategyData === null) throw strategyDataQueryError;
  if (actionDataQueryError || actionData === null) throw actionDataQueryError;

  return (
    <div className="flex flex-col max-h-screen h-screen">
      <StratHeader strategyData={strategyData} />
      <CoreArea strategyData={strategyData} actionData={actionData} />
    </div>
  );
}
