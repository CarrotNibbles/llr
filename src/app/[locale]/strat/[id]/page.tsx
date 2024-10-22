import type { Locale } from '@/lib/i18n';
import { buildActionDataQuery, buildStrategyDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { StratHeader } from './components/StratHeader';
import { StratMain } from './components/StratMain';
import { StratSyncProvider } from './components/StratSyncProvider';

export default async function StratPage({
  params: { id, locale },
}: Readonly<{
  params: { id: string; locale: Locale };
}>) {
  const supabase = createClient();

  const [
    { data: strategyData, error: strategyDataQueryError },
    { data: actionData, error: actionDataQueryError },
    { data: userResponse },
  ] = await Promise.all([
    buildStrategyDataQuery(supabase, id),
    buildActionDataQuery(supabase),
    supabase.auth.getUser(),
  ]);

  if (strategyData === null || strategyData.strategy_players.length === 0) {
    notFound();
  }

  if (strategyDataQueryError || actionDataQueryError || actionData === null) {
    throw new Error('Failed to fetch data');
  }

  return (
    <div className="flex flex-col max-h-screen h-screen">
      <StratSyncProvider
        strategyData={strategyData}
        userId={userResponse?.user?.id}
        isAuthor={userResponse?.user?.id === strategyData.author}
        editable={strategyData.is_editable}
      >
        <StratHeader />
        <StratMain />
      </StratSyncProvider>
    </div>
  );
}
