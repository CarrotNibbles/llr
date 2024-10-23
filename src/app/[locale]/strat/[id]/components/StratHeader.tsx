'use client';

import { ModeToggle } from '@/components/ModeToggle';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Share1Icon, ZoomInIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  AnonymousLikeButton,
  AuthenticatedLikeButton,
  ElevationDialog,
  FilterMenu,
  StratInfoDialog,
  StratSettingsDialog,
  ZoomSlider,
} from './header';

const StratHeader = React.forwardRef<HTMLDivElement, { className?: string } & React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const { toast } = useToast();

    const {
      userId,
      elevatable,
      isAuthor,
      strategyData: { raids },
    } = useStratSyncStore((state) => state);
    const t = useTranslations('StratPage.StratHeader');
    const tRaids = useTranslations('Common.Raids');

    return (
      <div
        ref={ref}
        className={cn('rounded-none border-b flex space-x-4 py-2 px-4 items-center', className)}
        {...props}
      >
        <StratInfoDialog />
        <div className="text-muted-foreground">{tRaids(raids?.semantic_key)}</div>
        <div className="flex-grow" />
        <ZoomInIcon className="w-5 h-5" />
        <ZoomSlider className="ml-0" />
        <div className="flex">
          {elevatable && <ElevationDialog />}
          {isAuthor && <StratSettingsDialog />}
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              try {
                await window.navigator.clipboard.writeText(window.location.href);
                toast({ description: t('Share.Success') });
              } catch {
                toast({
                  variant: 'destructive',
                  title: t('Share.FailureTitle'),
                  description: t('Share.FailureDescription'),
                });
              }
            }}
          >
            <span className="sr-only">Share this strategy</span>
            <Share1Icon />
          </Button>
          <FilterMenu />
          <ModeToggle />
        </div>
        {userId ? <AuthenticatedLikeButton /> : <AnonymousLikeButton />}
      </div>
    );
  },
);

StratHeader.displayName = 'StratHeader';

export { StratHeader };
