'use client';

import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAutoScrollState } from '@/lib/states';
import { cn } from '@/lib/utils';
import { Pencil2Icon, PlayIcon, ResetIcon, StopIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect } from 'react';

export const StratToolbar = React.forwardRef<
  HTMLDivElement,
  { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const { toast } = useToast();
  const t = useTranslations('StratPage.StratToolbar');

  const [autoScroll, setAutoScroll] = useAutoScrollState();

  const elevated = useStratSyncStore((state) => state.elevated);
  const undoEntryMutation = useStratSyncStore((state) => state.undoEntryMutation);
  const redoEntryMutation = useStratSyncStore((state) => state.redoEntryMutation);
  const undoAvailable = useStratSyncStore((state) => state.undoAvailable);
  const redoAvailable = useStratSyncStore((state) => state.redoAvailable);

  const toggleAutoScrollAction = useCallback(() => {
    setAutoScroll((prev) => ({
      active: !prev.active,
      context: null,
    }));
  }, [setAutoScroll]);

  const undoAction = useCallback(() => {
    if (!elevated) return;

    if (!undoEntryMutation()) {
      toast({
        description: t('NoMoreUndo'),
        variant: 'destructive',
      });
    }
  }, [elevated, toast, undoEntryMutation, t]);

  const redoAction = useCallback(() => {
    if (!elevated) return;

    if (!redoEntryMutation()) {
      toast({
        description: t('NoMoreRedo'),
        variant: 'destructive',
      });
    }
  }, [elevated, toast, redoEntryMutation, t]);

  useEffect(() => {
    const autoScrollHandler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();

        toggleAutoScrollAction();
      }
    };

    window.addEventListener('keydown', autoScrollHandler);

    return () => {
      window.removeEventListener('keydown', autoScrollHandler);
    };
  }, [toggleAutoScrollAction]);

  useEffect(() => {
    const undoHandler = (e: KeyboardEvent) => {
      const isMac = navigator.userAgent.toLowerCase().includes('mac');
      const isCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCtrl) {
        if (e.key === 'z') {
          e.preventDefault();

          if (!e.shiftKey) {
            undoAction();
          } else {
            redoAction();
          }
        }
      }
    };

    window.addEventListener('keydown', undoHandler);

    return () => {
      window.removeEventListener('keydown', undoHandler);
    };
  }, [undoAction, redoAction]);

  return (
    <div ref={ref} className={cn('bg-background rounded-lg border shadow-sm flex py-1 px-2', className)} {...props}>
      <Button variant="ghost" size="icon">
        <span className="sr-only select-none">New Note</span>
        <Pencil2Icon />
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleAutoScrollAction}>
        <span className="sr-only select-none">Play/Stop</span>
        {autoScroll.active ? <StopIcon /> : <PlayIcon />}
      </Button>
      <Button variant="ghost" size="icon" onClick={undoAction} disabled={!elevated || !undoAvailable}>
        <span className="sr-only select-none">Undo</span>
        <ResetIcon />
      </Button>
      <Button variant="ghost" size="icon" onClick={redoAction} disabled={!elevated || !redoAvailable}>
        <span className="sr-only select-none">Redo</span>
        <ResetIcon className="transform -scale-x-100" />
      </Button>
    </div>
  );
});
