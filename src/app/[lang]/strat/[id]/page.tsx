import {
  buildActionDataQuery,
  buildStrategyDataQuery,
} from "@/lib/queries/server";
import { createClient } from "@/lib/supabase/server";
import { CoreArea } from "./components/CoreArea";
import { StratHeader } from "./components/StratHeader";
import { StratSyncProvider } from "./components/StratSyncProvider";

export default async function StratPage({
  params: { id, lang },
}: Readonly<{
  params: { id: string; lang: string };
}>) {
  const supabase = createClient();

  const { data: strategyData, error: strategyDataQueryError } =
    await buildStrategyDataQuery(supabase, id);
  const { data: actionData, error: actionDataQueryError } =
    await buildActionDataQuery(supabase);

  if (strategyDataQueryError || strategyData === null)
    throw strategyDataQueryError;
  if (actionDataQueryError || actionData === null) throw actionDataQueryError;

  return (
    <div className="flex flex-col max-h-screen h-screen">
      <StratSyncProvider strategyData={strategyData}>
        <StratHeader />
        <CoreArea actionData={actionData} />
      </StratSyncProvider>
    </div>
  );
}
