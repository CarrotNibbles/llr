'use client';

import { StratSyncStoreProvider, useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import type { StrategyDataType } from '@/lib/queries/server';
import { useEffect, type ReactNode } from 'react';

export type StratSyncProviderProps = {
  children: ReactNode;
  strategyData: StrategyDataType;
};

const StratSyncLoader = (props: { strategy: string }) => {
  const { connect } = useStratSyncStore((state) => state);

  useEffect(() => {
    connect(props.strategy);
  }, [connect, props.strategy]);

  return <></>;
};

export function StratSyncProvider(props: StratSyncProviderProps) {
  return (
    <StratSyncStoreProvider initState={{ strategyData: props.strategyData }}>
      <StratSyncLoader strategy={props.strategyData.id} />
      {props.children}
    </StratSyncStoreProvider>
  );
}
