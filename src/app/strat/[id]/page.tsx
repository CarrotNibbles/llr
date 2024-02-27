'use server';

import { StratHeader } from './components/StratHeader';
import { CoreArea } from './components/CoreArea';
import { createClient } from '@/lib/supabase/server';
import { buildRaidDataQuery } from '@/lib/queries';

export default async function StratPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: raidData, error } = await buildRaidDataQuery(supabase, params.id);

  // eslint-disable-next-line
  if (error) throw error;

  return (
    <div className="flex flex-col max-h-screen h-screen">
      <StratHeader />
      <CoreArea data={raidData} />
    </div>
  );
}
