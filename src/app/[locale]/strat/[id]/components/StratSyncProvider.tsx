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
import { useEffect, useState, type ReactNode } from 'react';

export type StratSyncProviderProps = {
  children: ReactNode;
  strategyData: StrategyDataType;
};

const StratSyncLoader = (props: { strategy: string }) => {
  const { connect, abort, connectionAborted } = useStratSyncStore((state) => state);
  const t = useTranslations("StratPage.StratSyncProvider");

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
          <AlertDialogTitle>{t("ErrorTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("ErrorDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              window.location.reload();
            }}
          >
            {t("Refresh")}
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
