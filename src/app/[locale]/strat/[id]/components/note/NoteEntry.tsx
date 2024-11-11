import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import type { Tables } from '@/lib/database.types';
import { useNoteState, usePixelPerFrame } from '@/lib/states';
import { cn } from '@/lib/utils';
import { deepEqual } from 'fast-equals';
import { animate, motion, useMotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';
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
    const pixelPerFrame = usePixelPerFrame();
    const mutateNote = useStratSyncStore((state) => state.mutateNote);
    const [noteState, setNoteState] = useNoteState();

    const blockOffsetToX = blockOffsetToXFactory(noteState.editColumnWidths);
    const xToBlockOffset = xToBlockOffsetFactory(noteState.editColumnWidths);

    const [open, setOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState(note);

    const xMotionValue = useMotionValue(blockOffsetToX(note.block, note.offset));
    const yMotionValue = useMotionValue(timeToY(note.at, pixelPerFrame));

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      setIsEditing(false);
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
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <motion.div
              className="bg-amber-600 dark:bg-amber-400 w-2 h-2 cursor-pointer"
              animate={{ rotate: open ? 135 : 45 }}
              whileHover={{ scale: 1.1 }}
              onTap={() => setOpen(!open)}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => mutateNote({ delete: note.id })}>{'Delete Note'}</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        {isEditing ? (
          <motion.input
            className="text-amber-600 dark:text-amber-400 text-xs font-bold bg-transparent w-32 outline-none cursor-text"
            animate={{ opacity: open ? 1 : 0 }}
            type="text"
            value={currentNote.content}
            onChange={(e) =>
              setCurrentNote({
                ...currentNote,
                content: e.target.value,
              })
            }
            autoFocus
            onBlur={() => {
              mutateNote({ upsert: currentNote });
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                mutateNote({ upsert: currentNote });
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <motion.div
            className="text-xs text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap cursor-text"
            animate={{ opacity: open ? 1 : 0 }}
            onDoubleClick={() => setIsEditing(true)}
          >
            {currentNote.content}
          </motion.div>
        )}
      </motion.div>
    );
  }),
  deepEqual,
);

NoteEntry.displayName = 'NoteEntry';

export { NoteEntry };
