import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { noteAtom, pixelPerFrameAtom } from '@/lib/atoms';
import type { Tables } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { deepEqual } from 'fast-equals';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { blockOffsetToXFactory, timeToY, xToBlockOffsetFactory, yToTime } from '../../utils/helpers';

type NoteEntryProps = {
  note: Tables<'notes'>;
  raidDuration: number;
};

const NoteEntry = React.memo(
  React.forwardRef<
    HTMLDivElement,
    { className?: string } & React.ComponentPropsWithRef<typeof motion.div> & NoteEntryProps
  >(({ className, note, raidDuration, ...props }, ref) => {
    const t = useTranslations('StratPage.Note');
    const pixelPerFrame = useAtomValue(pixelPerFrameAtom);
    const mutateNote = useStratSyncStore((state) => state.mutateNote);
    const [noteState, setNoteState] = useAtom(noteAtom);

    const blockOffsetToX = blockOffsetToXFactory(noteState.editColumnWidths);
    const xToBlockOffset = xToBlockOffsetFactory(noteState.editColumnWidths);

    const [open, setOpen] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [currentNote, setCurrentNote] = useState(note);

    const xMotionValue = useMotionValue(blockOffsetToX(note.block, note.offset));
    const yMotionValue = useMotionValue(timeToY(note.at, pixelPerFrame));

    const inputRef = useRef<HTMLInputElement>(null);
    const [isComposing, setIsComposing] = useState(false);
    const [dispatchRequested, setDispatchRequested] = useState(false);

    useEffect(() => {
      if (!isComposing && dispatchRequested) {
        setDispatchRequested(false);
        inputRef.current?.blur();
      }
    }, [isComposing, dispatchRequested]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      inputRef.current?.blur();
      setCurrentNote(note);

      void animate(xMotionValue, blockOffsetToX(note.block, note.offset));
      void animate(yMotionValue, timeToY(note.at, pixelPerFrame));
    }, [note]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      void animate(xMotionValue, blockOffsetToX(note.block, note.offset));
      void animate(yMotionValue, timeToY(note.at, pixelPerFrame));
    }, [noteState.editColumnWidths, pixelPerFrame]);

    return (
      <motion.div
        drag
        dragMomentum={false}
        onDragStart={() => {
          setNoteState({ ...noteState, moving: true });
        }}
        onDragEnd={() => {
          const { block, offset } = xToBlockOffset(xMotionValue.get());
          const at = yToTime(yMotionValue.get(), pixelPerFrame, raidDuration);

          const newNote = {
            ...currentNote,
            block,
            offset,
            at,
          };

          setCurrentNote(newNote);
          mutateNote({ upsert: newNote });
          setNoteState({ ...noteState, moving: false });
        }}
        ref={ref}
        className={cn('flex space-x-2 items-center h-8 ml-[-0.35355rem] mt-[-1rem]', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          x: xMotionValue,
          y: yMotionValue,
        }}
        {...props}
      >
        <ContextMenu modal={false}>
          <ContextMenuTrigger asChild>
            <motion.div
              className="bg-amber-600 dark:bg-amber-400 w-2 h-2 cursor-pointer"
              animate={{ rotate: open ? 135 : 45 }}
              whileHover={{ scale: 1.1 }}
              onTap={() => setOpen(!open)}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onSelect={() => {
                inputRef.current?.focus();
              }}
            >
              {t('EditNote')}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => mutateNote({ delete: note.id })}>{t('DeleteNote')}</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <motion.input
          ref={inputRef}
          className={cn(
            'text-amber-600 dark:text-amber-400 decoration-dotted decoration-2 text-xs font-bold bg-transparent w-32 outline-none cursor-text',
            isFocused ? 'underline' : 'no-underline',
          )}
          animate={{ opacity: open ? 1 : 0 }}
          type="text"
          value={currentNote.content}
          onChange={(e) =>
            setCurrentNote({
              ...currentNote,
              content: e.target.value,
            })
          }
          onFocus={() => {
            console.log('focus');
            setIsFocused(true);
          }}
          onBlur={() => {
            setDispatchRequested(false);
            setIsFocused(false);
            mutateNote({ upsert: currentNote });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setDispatchRequested(true);
            }
          }}
          onCompositionStart={() => {
            setIsComposing(true);
          }}
          onCompositionEnd={() => {
            setIsComposing(false);
          }}
        />
      </motion.div>
    );
  }),
  deepEqual,
);

NoteEntry.displayName = 'NoteEntry';

export { NoteEntry };
