'use client';

import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/use-toast';
import { autoScrollAtom, noteAtom } from '@/lib/atoms';
import { cn } from '@/lib/utils';
import { Pencil2Icon, PlayIcon, ResetIcon, StopIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect } from 'react';

export const StratToolbar = React.forwardRef<
  HTMLDivElement,
  { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const { toast } = useToast();
  const t = useTranslations('StratPage.StratToolbar');

  const [autoScroll, setAutoScroll] = useAtom(autoScrollAtom);
  const [noteState, setNoteState] = useAtom(noteAtom);

  const elevated = useStratSyncStore((state) => state.elevated);
  const undo = useStratSyncStore((state) => state.undo);
  const redo = useStratSyncStore((state) => state.redo);
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

    if (!undo()) {
      toast({
        description: t('NoMoreUndo'),
        variant: 'destructive',
      });
    }
  }, [elevated, toast, undo, t]);

  const redoAction = useCallback(() => {
    if (!elevated) return;

    if (!redo()) {
      toast({
        description: t('NoMoreRedo'),
        variant: 'destructive',
      });
    }
  }, [elevated, toast, redo, t]);

  useEffect(() => {
    const autoScrollHandler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        if (['input', 'textarea', 'button'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;

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
      <Toggle
        aria-label="New Note"
        disabled={!elevated}
        pressed={noteState.inserting}
        onPressedChange={(pressed) => setNoteState({ ...noteState, inserting: pressed })}
      >
        <Pencil2Icon />
      </Toggle>
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
