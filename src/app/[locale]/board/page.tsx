'use server';

import { buildRaidsDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { BoardHeader } from './components/BoardHeader';
import { BoardSubHeader } from './components/BoardSubHeader';
import { Separator } from '@/components/ui/separator';

export default async function BoardPage({
  params: { lang },
}: Readonly<{
  params: { lang: string };
}>) {
  const supabase = createClient();
  const { data: raidsData, error: raidsDataQueryError } = await buildRaidsDataQuery(supabase);

  if (raidsDataQueryError || raidsData === null) throw raidsDataQueryError;

  return (
    <div className='flex flex-col items-center'>
      <BoardHeader />
      <div className="flex flex-col w-full max-w-screen-xl px-4">
        <BoardSubHeader raidsData={raidsData} />
      </div>
    </div>
  );
}
