'use server';

import { buildRaidsDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { BoardHeader } from './components/BoardHeader';

export default async function BoardPage({
  params: { lang },
}: Readonly<{
  params: { lang: string };
}>) {
  const supabase = createClient();
  const { data: raidsData, error: raidsDataQueryError } = await buildRaidsDataQuery(supabase);

  if (raidsDataQueryError || raidsData === null) throw raidsDataQueryError;

  return (
    <div>
      <BoardHeader />
      <div className="flex flex-row">
      </div>
    </div>
  );
}
