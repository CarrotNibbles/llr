import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { StratSync } from './proto/stratsync_connect';

const transport = createConnectTransport({
  baseUrl: process.env.STRAT_SYNC_URI!,
});

export const stratSyncClient = createPromiseClient(StratSync, transport);
