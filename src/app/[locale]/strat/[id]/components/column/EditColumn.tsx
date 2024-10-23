import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useToast } from '@/components/ui/use-toast';
import type { ActionDataType, StrategyDataType } from '@/lib/queries/server';
import { type ArrayElement, clamp } from '@/lib/utils';
import { AnimatePresence, animate, motion, useDragControls, useMotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import { type MouseEventHandler, useContext, useEffect, useState } from 'react';

import { usePixelPerFrame } from '@/lib/states';
import { BOTTOM_PADDING_PX, TIME_STEP, columnWidth, contextMenuWidth } from '../../utils/constants';
import { EntrySelectionContext } from './EntrySelectionContext';

const snapToStep = (currentUseAt: number) => {
  const clampedUseAt = currentUseAt > 0 ? currentUseAt : 0;

  return TIME_STEP * Math.round(clampedUseAt / TIME_STEP);
};

const overlaps = (currentUseAt: number, otherUseAt: number, cooldown: number) =>
  Math.abs(currentUseAt - otherUseAt) < cooldown;

const evaluateOverlap = (currentUseAt: number, prevUseAt: number, otherUseAt: number, cooldown: number) => {
  if (Math.abs(currentUseAt - otherUseAt) >= cooldown * 0.5) return currentUseAt < otherUseAt ? 'up' : 'down';
  return prevUseAt < otherUseAt ? 'up' : 'down';
};

function buildHelperFunctions(raidDuration: number, cooldown: number) {
  const removeOverlap = (currentUseAt: number, prevUseAt: number, otherUseAts: number[]) => {
    const sortedOtherUseAts = otherUseAts.toSorted((a, b) => a - b);

    const overlapIndex = sortedOtherUseAts.reduce(
      (acc, curr, index) =>
        Math.abs(curr - currentUseAt) < acc.value ? { value: Math.abs(curr - currentUseAt), index } : acc,
      { value: cooldown, index: -1 },
    ).index;

    if (overlapIndex === -1) return currentUseAt;

    const newUseAt =
      evaluateOverlap(currentUseAt, prevUseAt, sortedOtherUseAts[overlapIndex], cooldown) === 'up'
        ? sortedOtherUseAts[overlapIndex] - cooldown
        : sortedOtherUseAts[overlapIndex] + cooldown;

    if (
      newUseAt >= 0 &&
      newUseAt <= raidDuration &&
      sortedOtherUseAts.every((otherUseAt) => !overlaps(newUseAt, otherUseAt, cooldown))
    )
      return newUseAt;

    return null;
  };

  const snapAndRemoveOverlap = (currentUseAt: number, prevUseAt: number, otherUseAts: number[]) =>
    removeOverlap(snapToStep(currentUseAt), prevUseAt, otherUseAts);

  return { removeOverlap, snapAndRemoveOverlap };
}

type DraggableBoxProps = {
  action: ArrayElement<ActionDataType>;
  entry: ArrayElement<ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries']>;
  otherUseAts: number[];
  raidDuration: number;
  durations: number[];
  cooldown: number;
};

const DraggableBox = ({ action, entry, otherUseAts, raidDuration, durations, cooldown }: DraggableBoxProps) => {
  const { use_at: useAt, id: entryId, action: actionId, player: playerId } = entry;

  const pixelPerFrame = usePixelPerFrame();
  const t = useTranslations('StratPage.EditColumn');
  const src = `/icons/action/${action.job}/${action.semantic_key}.png`;
  const { snapAndRemoveOverlap } = buildHelperFunctions(raidDuration, cooldown);

  const { upsertEntry, deleteEntry, elevated } = useStratSyncStore((state) => state);

  const [holdingShift, setHoldingShift] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const yMotionValue = useMotionValue(useAt * pixelPerFrame);

  const { activeEntries, setActiveEntries } = useContext(EntrySelectionContext);
  const draggable = elevated && !isLocked;

  const dragControls = useDragControls();
  const effectiveDragControls = draggable ? dragControls : undefined;

  const [primaryDuration, ...otherDurations] = [...new Set(durations)].toSorted((a, b) => a - b);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    void animate(yMotionValue, useAt * pixelPerFrame);
  }, [pixelPerFrame, useAt]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') setHoldingShift(true);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') setHoldingShift(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const onDragEnd = async () => {
    // AdjustPosition
    yMotionValue.animation?.cancel();

    const oldUseAt = useAt;
    const newUseAt = clamp(yMotionValue.get() / pixelPerFrame, 0, raidDuration);
    const newUseAtCalced = snapAndRemoveOverlap(newUseAt, useAt, otherUseAts);

    const snappedUseAt = newUseAtCalced !== null ? snapToStep(newUseAtCalced) : oldUseAt;

    void animate(yMotionValue, snappedUseAt * pixelPerFrame);

    if (newUseAtCalced === null) return;

    setActiveEntries((prev) => {
      const newActiveEntries = new Map(prev);
      newActiveEntries.delete(entryId);
      return newActiveEntries;
    });

    upsertEntry(
      {
        id: entryId,
        action: actionId,
        player: playerId,
        useAt: snappedUseAt,
      },
      false,
    );
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="relative" disabled={!elevated}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          drag={draggable ? 'y' : false}
          dragControls={effectiveDragControls}
          dragListener={false}
          dragMomentum={false}
          dragPropagation
          onPointerDown={(e) => {
            if (effectiveDragControls) {
              if (!activeEntries.get(entryId)) {
                if (!holdingShift) {
                  activeEntries.clear();
                }
                activeEntries.set(entryId, dragControls);
                setActiveEntries(new Map(activeEntries));
              } else if (holdingShift) {
                activeEntries.delete(entryId);
                setActiveEntries(new Map(activeEntries));
              }

              for (const dc of activeEntries.values()) {
                dc.start(e);
              }
            }
          }}
          onPointerUp={() => {
            if (activeEntries.get(entryId)) {
              if (activeEntries.size === 1 && !holdingShift) {
                activeEntries.clear();
                setActiveEntries(new Map());
              }
            }
          }}
          onDragEnd={onDragEnd}
          className={`${columnWidth} h-0 absolute z-[5] shadow-xl filter ${activeEntries.get(entryId) ? 'drop-shadow-selection' : ''}`}
          style={{
            y: yMotionValue,
            cursor: draggable ? 'grab' : 'not-allowed',
            transitionProperty: 'filter',
            transitionDuration: '0.3s',
            transitionTimingFunction: 'ease-in-out',
          }}
        >
          <div
            className={`relative ${columnWidth} overflow-hidden border-zinc-300 dark:border-zinc-700 border-b-[2px]`}
            style={{ height: `${cooldown * pixelPerFrame}px` }}
          >
            <div
              className={`absolute top-0 mx-auto ${columnWidth} ml-[calc(50%-1.5px)] border-zinc-300 dark:border-zinc-700 border-l-[3px] border-dotted`}
              style={{ height: `${cooldown * pixelPerFrame}px` }}
            />
            {otherDurations.length > 0 && (
              <>
                <div
                  className={`absolute top-0 ${columnWidth} ml-[calc(50%-1.5px)] border-zinc-400 dark:border-zinc-600 border-l-[3px] border-solid`}
                  style={{ height: `${otherDurations[0] * pixelPerFrame}px` }}
                />
                <div
                  className={`absolute top-0 ${columnWidth} border-zinc-400 dark:border-zinc-600 border-b-[2px] border-solid`}
                  style={{ height: `${otherDurations[0] * pixelPerFrame}px` }}
                />
              </>
            )}
            <div
              className={`absolute top-0 ${columnWidth} ml-[calc(50%-1.5px)] border-zinc-500 dark:border-zinc-500 border-l-[3px] border-solid`}
              style={{ height: `${primaryDuration * pixelPerFrame}px` }}
            />
            <div
              className={`absolute top-0 ${columnWidth} border-zinc-500 dark:border-zinc-500 border-b-[2px] border-solid`}
              style={{ height: `${primaryDuration * pixelPerFrame}px` }}
            />
            <div className="aspect-square relative w-full pointer-events-none">
              <Image
                src={src}
                alt={action.name}
                onDragStart={() => {
                  return false;
                }}
                layout="fill"
                objectFit="contain"
                className="pointer-events-none select-none"
                draggable={false}
                unselectable="on"
              />
            </div>
          </div>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className={`${contextMenuWidth}`}>
        <ContextMenuCheckboxItem
          checked={isLocked}
          onCheckedChange={(checked) => {
            setIsLocked(checked);
            setActiveEntries((prev) => {
              const newActiveEntries = new Map(prev);
              newActiveEntries.delete(entryId);
              return newActiveEntries;
            });
          }}
        >
          {t('Lock')}
        </ContextMenuCheckboxItem>
        <ContextMenuItem
          inset
          onClick={() => {
            deleteEntry(entryId, false);
            setActiveEntries((prev) => {
              const newActiveEntries = new Map(prev);
              newActiveEntries.delete(entryId);
              return newActiveEntries;
            });
          }}
        >
          {t('Delete')}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

type EditSubColumnProps = {
  raidDuration: number;
  action: ArrayElement<ActionDataType>;
  entries: ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries'];
  playerId: string;
};

const EditSubColumn = ({ raidDuration, action, entries, playerId }: EditSubColumnProps) => {
  const { toast } = useToast();
  const t = useTranslations('StratPage.EditColumn');

  const { upsertEntry } = useStratSyncStore((state) => state);
  const boxValues = entries.map((entry) => ({ useAt: entry.use_at, id: entry.id }));
  const pixelPerFrame = usePixelPerFrame();
  const { snapAndRemoveOverlap } = buildHelperFunctions(raidDuration, action.cooldown);
  const { elevated } = useStratSyncStore((state) => state);

  const { setActiveEntries } = useContext(EntrySelectionContext);

  const createBox: MouseEventHandler<HTMLDivElement> = async (evt) => {
    const cursorY = evt.clientY - evt.currentTarget.getBoundingClientRect().top;
    const cursorUseAt = cursorY / pixelPerFrame;

    setActiveEntries(new Map());

    if (
      boxValues.some((boxValue) => cursorUseAt - boxValue.useAt >= 0 && cursorUseAt - boxValue.useAt <= action.cooldown)
    ) {
      toast({
        description: t('ActionOverlapError'),
      });

      return false;
    }

    const useAtCalced = snapAndRemoveOverlap(
      cursorUseAt,
      snapToStep(cursorUseAt),
      boxValues.map((boxValue) => boxValue.useAt),
    );

    if (useAtCalced === null) {
      toast({
        description: t('ActionOverlapError'),
      });

      return false;
    }

    upsertEntry(
      {
        id: crypto.randomUUID(),
        action: action.id,
        player: playerId,
        useAt: useAtCalced,
      },
      false,
    );
  };

  return (
    <div
      className={`flex flex-shrink-0 ${columnWidth} overflow-hidden hover:bg-muted`}
      style={{ height: `${raidDuration * pixelPerFrame + BOTTOM_PADDING_PX}px` }}
    >
      <AnimatePresence>
        {...boxValues.map((boxValue, index) => (
          <DraggableBox
            key={boxValue.id}
            action={action}
            entry={entries[index]}
            raidDuration={raidDuration}
            durations={action.mitigations.map(({ duration }) => duration)}
            cooldown={action.cooldown}
            otherUseAts={boxValues.filter((_, j) => j !== index).map((boxValue) => boxValue.useAt)}
          />
        ))}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className="relative top-0 left-0 w-full h-full"
          onClick={createBox}
          style={{ cursor: !elevated ? 'not-allowed' : 'pointer' }}
        />
      </AnimatePresence>
    </div>
  );
};

export type EditColumnProps = {
  raidDuration: number;
  playerStrategy: ArrayElement<StrategyDataType['strategy_players']>;
  actions: ActionDataType;
};

export const EditColumn = ({ raidDuration, playerStrategy, actions }: EditColumnProps) => {
  const pixelPerFrame = usePixelPerFrame();

  return (
    <div
      className="flex px-1 space-x-1 border-r-[1px]"
      style={{ height: raidDuration * pixelPerFrame + BOTTOM_PADDING_PX }}
    >
      {actions.map((action) => (
        <EditSubColumn
          key={`subcolumn-${playerStrategy.id}-${action.id}`}
          raidDuration={raidDuration}
          action={action}
          entries={playerStrategy.strategy_player_entries.filter(({ action: actionId }) => actionId === action.id)}
          playerId={playerStrategy.id}
        />
      ))}
      {actions.length === 0 && (
        <>
          <div className={`${columnWidth}`} />
          <div className={`${columnWidth}`} />
          <div className={`${columnWidth}`} />
        </>
      )}
    </div>
  );
};
