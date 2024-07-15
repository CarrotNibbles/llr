'use client';

import { StratSyncStoreProvider, useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { StrategyDataType } from '@/lib/queries/server';
import { useEffect, useState, type ReactNode } from 'react';

export type StratSyncProviderProps = {
  children: ReactNode;
  strategyData: StrategyDataType;
};

const StratSyncLoader = (props: { strategy: string }) => {
  const { connect, abort, connectionAborted } = useStratSyncStore((state) => state);

  useEffect(() => {
    connect(props.strategy);
  }, [connect, props.strategy]);

  useEffect(() => {
    window.addEventListener('offline', abort);

    return () => {
      window.removeEventListener('offline', abort);
    };
  }, [abort]);

  return (
    <AlertDialog open={connectionAborted}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>연결 오류</AlertDialogTitle>
          <AlertDialogDescription>
            서버와의 연결이 끊어졌습니다. 페이지를 새로고침하여 다시 시도해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              window.location.reload();
            }}
          >
            새로고침
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function StratSyncProvider(props: StratSyncProviderProps) {
  return (
    <StratSyncStoreProvider initState={{ strategyData: props.strategyData }}>
      <StratSyncLoader strategy={props.strategyData.id} />
      {props.children}
    </StratSyncStoreProvider>
  );
}
