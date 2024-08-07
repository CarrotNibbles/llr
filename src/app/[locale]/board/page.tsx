'use server';

import { buildRaidsDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { CreateButton } from './components/CreateButton';
import { MobileHeader } from './components/MobileHeader';
import { SideBar } from './components/Sidebar';
import { StrategiesArea } from './components/StrategiesArea';

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
      <MobileHeader />
      <div className="flex flex-row">
        <div className="hidden md:block md:w-60 lg:w-96">
          <SideBar />
        </div>
        <div className="flex-auto m-5 mt-0">
          <div className="hidden md:block mt-10 mb-5">
            <text className="text-3xl font-bold">천옥 영식 4층</text>
          </div>
          <StrategiesArea raid={'17e466d6-01eb-45cb-88be-0c2f430aa024'} />
        </div>
      </div>
      <CreateButton raidsData={raidsData} />
    </div>
  );
}
