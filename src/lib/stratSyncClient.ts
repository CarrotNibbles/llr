import { createClient } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { StratSync } from './proto/stratsync_connect';

const transport = createGrpcWebTransport({
  baseUrl: process.env.NEXT_PUBLIC_STRATSYNC_URI ?? '',
});

export const createStratSyncClient = () => createClient(StratSync, transport);
export type StratSyncClient = ReturnType<typeof createStratSyncClient>;

export class StratSyncClientFactory {
  static instance: StratSyncClientFactory | null;
  client!: StratSyncClient;

  constructor() {
    if (StratSyncClientFactory.instance)
      // biome-ignore lint/correctness/noConstructorReturn: Singleton Pattern
      return StratSyncClientFactory.instance;

    this.client = createStratSyncClient();

    StratSyncClientFactory.instance = this;
  }
}
