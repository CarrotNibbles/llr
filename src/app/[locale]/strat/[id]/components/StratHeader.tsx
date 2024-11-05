'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { BrandIdentity } from '@/components/icons/BrandIdentity';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Share1Icon, ZoomInIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
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

    const userId = useStratSyncStore((state) => state.userId);
    const elevatable = useStratSyncStore((state) => state.elevatable);
    const isAuthor = useStratSyncStore((state) => state.isAuthor);
    const raids = useStratSyncStore((state) => state.strategyData.raids);
    const t = useTranslations('StratPage.StratHeader');
    const tRaids = useTranslations('Common.Raids');

    return (
      <div
        ref={ref}
        className={cn('rounded-none border-b flex space-x-4 py-2 px-4 items-center', className)}
        {...props}
      >
        <div className="flex items-center">
          <Link href="/" className="flex mr-2.5">
            <BrandIdentity variant="heavy" className="fill-brand h-8" />
          </Link>
          <StratInfoDialog className="hidden sm:block" />
        </div>
        <div className="text-muted-foreground lg:block hidden whitespace-nowrap">{tRaids(raids?.semantic_key)}</div>
        <div className="flex-grow" />
        <div className="hidden sm:inline">
          <ZoomInIcon className="w-5 h-5" />
        </div>
        <ZoomSlider className="ml-0 hidden sm:flex" />
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
            <span className="sr-only select-none">Share this strategy</span>
            <Share1Icon />
          </Button>
          <FilterMenu />
          <ThemeToggle />
        </div>
        {userId ? <AuthenticatedLikeButton /> : <AnonymousLikeButton />}
      </div>
    );
  },
);

StratHeader.displayName = 'StratHeader';

export { StratHeader };
