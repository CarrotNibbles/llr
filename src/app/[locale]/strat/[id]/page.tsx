import type { Locale } from '@/lib/i18n';
import { buildActionDataQuery, buildStrategyDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { StratHeader } from './components/StratHeader';
import { StratMain } from './components/StratMain';
import { StratSyncProvider } from './components/StratSyncProvider';
import { StratToolbar } from './components/StratToolbar';

export async function generateMetadata(
  props: Readonly<{
    params: Promise<{ id: string; locale: Locale }>;
  }>,
) {
  const { id } = await props.params;

  const t = await getTranslations('Common.Meta');

  const supabase = await createClient();

  const { data: strategyData } = await buildStrategyDataQuery(supabase, id);

  if (strategyData === null) {
    notFound();
  }

  const title = `${strategyData.name} ⬩ LLR`;
  const description = t('StratDescription', { raid: strategyData.raids.name });
  const host_uri = process.env.HOST_URI;
  const author = strategyData.profiles?.display_name ?? t('UnknownAuthor');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${host_uri}/strat/${id}`,
    },
    twitter: {
      card: 'summary',
      site: '@replace-this-with-twitter-handle',
      creator: author,
    },
  };
}

export default async function StratPage(
  props: Readonly<{
    params: Promise<{ id: string; locale: Locale }>;
  }>,
) {
  const id = (await props.params).id;

  const supabase = await createClient();

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
        <StratToolbar className="fixed bottom-8 right-8 z-20" />
      </StratSyncProvider>
    </div>
  );
}
