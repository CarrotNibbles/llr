import { buildActionDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { StaticDataStoreProvider } from './StaticDataStoreProvider';

export async function StaticDataProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: actionData } = await buildActionDataQuery(supabase);

  return (
    <StaticDataStoreProvider initState={{ actionData: actionData ?? undefined }}>{children}</StaticDataStoreProvider>
  );
}
