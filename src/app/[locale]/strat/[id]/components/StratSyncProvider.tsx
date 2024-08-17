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
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect } from 'react';

export type StratSyncProviderProps = {
  children: ReactNode;
  strategyData: StrategyDataType;
  isAuthor: boolean;
  editable: boolean;
};

const StratSyncLoader = (props: { strategy: string; isAuthor: boolean; editable: boolean }) => {
  const supabase = createClient();
  const { connect, abort, connectionAborted, updateStrategyData } = useStratSyncStore((state) => state);
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

  useEffect(() => {
    const channel = supabase
      .channel(`strat:${props.strategy}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'strategies',
          filter: `id=eq.${props.strategy}`,
        },
        (payload) => {
          updateStrategyData(payload.new);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase.channel, props.strategy, updateStrategyData]);

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
