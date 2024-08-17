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
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect, useState } from 'react';

export type StratSyncProviderProps = {
  children: ReactNode;
  strategyData: StrategyDataType;
  isAuthor: boolean;
  editable: boolean;
};

const StratSyncLoader = (props: { strategy: string; isAuthor: boolean; editable: boolean }) => {
  const { connect, abort, connectionAborted } = useStratSyncStore((state) => state);
  const t = useTranslations('StratPage.StratSyncProvider');

  useEffect(() => {
    connect(props.strategy, props.isAuthor, props.editable);
  }, [connect, props.strategy, props.isAuthor, props.editable]);

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
          <AlertDialogTitle>{t('ErrorTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('ErrorDescription')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              window.location.reload();
            }}
          >
            {t('Refresh')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function StratSyncProvider(props: StratSyncProviderProps) {
  return (
    <StratSyncStoreProvider
      initState={{ strategyData: props.strategyData, elevatable: !props.isAuthor && props.strategyData.is_editable }}
    >
      <StratSyncLoader
        strategy={props.strategyData.id}
        isAuthor={props.isAuthor}
        editable={props.strategyData.is_editable}
      />
      {props.children}
    </StratSyncStoreProvider>
  );
}
