'use client';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { noteAtom, pixelPerFrameAtom } from '@/lib/atoms';
import type { Tables } from '@/lib/database.types';
import { cn } from '@/lib/utils/helpers';
import { deepEqual } from 'fast-equals';
import { AnimatePresence } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import React from 'react';
import { horizontalTransformsFactory, verticalTransformsFactory } from '../../utils/helpers';
import { NoteEntry } from './NoteEntry';

type NoteOverlayProps = {
  raidDuration: number;
  notes: Tables<'notes'>[];
};

const NoteOverlay = React.memo(
  React.forwardRef<HTMLDivElement, { className?: string } & React.ComponentPropsWithoutRef<'div'> & NoteOverlayProps>(
    ({ className, raidDuration, notes, ...props }, ref) => {
      const t = useTranslations('StratPage.Note');
      const [noteState, setNoteState] = useAtom(noteAtom);
      const pixelPerFrame = useAtomValue(pixelPerFrameAtom);

      const { xToBlockOffset } = horizontalTransformsFactory(noteState.editColumnWidths);
      const { yToTime } = verticalTransformsFactory(raidDuration, pixelPerFrame);

      const mutateNote = useStratSyncStore((state) => state.mutateNote);

      return (
        <div
          ref={ref}
          className={cn(
            className,
            noteState.moving || noteState.inserting ? 'pointer-events-auto' : 'pointer-events-none',
            noteState.inserting ? 'cursor-crosshair' : 'cursor-default',
          )}
          onClick={(e) => {
            if (noteState.inserting) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              const { block, offset } = xToBlockOffset(x);
              const at = yToTime(y);

              mutateNote({
                upsert: {
                  id: crypto.randomUUID(),
                  at,
                  block,
                  offset,
                  content: t('NewNote'),
                },
              });

              setNoteState({ ...noteState, inserting: false });
            }
          }}
          {...props}
        >
          <AnimatePresence>
            {notes.map((note) => {
              return (
                <NoteEntry
                  key={`note-${note.id}`}
                  className="absolute z-20 pointer-events-auto"
                  note={note}
                  raidDuration={raidDuration}
                />
              );
            })}
          </AnimatePresence>
        </div>
      );
    },
  ),
  deepEqual,
);

NoteOverlay.displayName = 'NoteOverlay';

export { NoteOverlay };
