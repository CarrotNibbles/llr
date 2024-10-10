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
import type { Tables } from '@/lib/database.types';
import type { StrategyDataType } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect } from 'react';

export type StratSyncProviderProps = {
  children: ReactNode;
  strategyData: StrategyDataType;
  userId?: string;
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
          console.log('strat update', payload);
          updateStrategyData(payload.new);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'like_counts',
          filter: `strategy=eq.${props.strategy}`,
        },
        (payload) => {
          console.log('like_counts update', payload);
          updateStrategyData({ like_counts: payload.new as Tables<'like_counts'> });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_likes',
          filter: `strategy=eq.${props.strategy}`,
        },
        (payload) => {
          console.log('user_likes insert', payload);
          updateStrategyData({ user_likes: [payload.new as Tables<'user_likes'>] });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'user_likes',
          filter: `strategy=eq.${props.strategy}`,
        },
        (payload) => {
          console.log('user_likes delete', payload);
          updateStrategyData({ user_likes: [] });
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
      initState={{
        strategy: props.strategyData.id,
        userId: props.userId,
        isAuthor: props.isAuthor,
        elevatable: !props.isAuthor && props.strategyData.is_editable,
        strategyData: props.strategyData,
      }}
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
