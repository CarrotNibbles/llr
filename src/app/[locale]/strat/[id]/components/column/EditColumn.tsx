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
import { type MouseEventHandler, useContext, useEffect, useMemo, useState } from 'react';

import { usePixelPerFrame } from '@/lib/states';
import { BOTTOM_PADDING_PX, BOX_X_OFFSET, BOX_Z_INDEX, TIME_STEP, columnWidth } from '../../utils/constants';
import { EntrySelectionContext } from './EntrySelectionContext';
import { useStaticDataStore } from '@/components/providers/StaticDataStoreProvider';
import { MultiIntervalSet } from '../../utils/helpers';

const snapToStep = (currentUseAt: number) => {
  const clampedUseAt = currentUseAt > 0 ? currentUseAt : 0;

  return TIME_STEP * Math.round(clampedUseAt / TIME_STEP);
};

function useEntryMutation() {
  const { mutateEntries, strategyData } = useStratSyncStore((state) => state);
  const { actionData } = useStaticDataStore((state) => state);

  const moveEntries = (ids: string[], offset: number) => {
    const upserts = strategyData.strategy_players
      .flatMap((player) => {
        const targetActions = new Set(
          player.strategy_player_entries.filter((entry) => ids.includes(entry.id)).map((entry) => entry.action),
        );

        return targetActions
          .values()
          .toArray()
          .flatMap((actionId) => {
            const action = actionData?.find((action) => action.id === actionId);

            if (!action) return [];

            const entries = player.strategy_player_entries
              .filter((entry) => entry.action === action.id)
              .toSorted((lhs, rhs) => lhs.use_at - rhs.use_at);

            const fixedIntervals = entries
              .filter((entry) => !ids.includes(entry.id))
              .map((entry) => [entry.use_at, entry.use_at + action.cooldown] as [number, number]);
            const upserts = entries.filter((entry) => ids.includes(entry.id)).toReversed();

            let currentOffset = offset;
            const mis = new MultiIntervalSet(action.charges, fixedIntervals);
            return upserts.map((entry) => {
              currentOffset = mis.offsetSearch([entry.use_at, entry.use_at + action.cooldown], currentOffset);

              mis.insertInterval([entry.use_at + currentOffset, entry.use_at + action.cooldown + currentOffset]);

              return { ...entry, use_at: entry.use_at + currentOffset };
            });
          });
      })
      .map(({ id, action, player, use_at }) => ({
        id,
        action,
        player,
        useAt: use_at,
      }));

    mutateEntries(upserts, [], false);
  };

  const insertEntry = (
    entry: ArrayElement<ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries']>,
  ) => {
    const { id, player: playerId, action: actionId, use_at } = entry;
    const playerData = strategyData.strategy_players.find((p) => p.id === playerId);

    if (!playerData) return false;

    const action = actionData?.find((a) => a.id === actionId);

    if (!action) return false;

    const fixedIntervals = playerData.strategy_player_entries
      .filter((entry) => entry.action === action.id)
      .map((entry) => [entry.use_at, entry.use_at + action.cooldown] as [number, number]);

    const mis = new MultiIntervalSet(action.charges, fixedIntervals);

    const insertable = mis.isInsertable([use_at, use_at + action.cooldown]);

    if (insertable) {
      mutateEntries(
        [
          {
            id,
            action: actionId,
            player: playerId,
            useAt: use_at,
          },
        ],
        [],
        false,
      );
    }

    return insertable;
  };

  return { moveEntries, insertEntry };
}

type DraggableBoxProps = {
  action: ArrayElement<ActionDataType>;
  entry: ArrayElement<ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries']>;
  slot: number;
  raidDuration: number;
  durations: number[];
};

const DraggableBox = ({ action, entry, slot, raidDuration, durations }: DraggableBoxProps) => {
  const { use_at: useAt, id: entryId, action: actionId, player: playerId } = entry;

  const pixelPerFrame = usePixelPerFrame();
  const t = useTranslations('StratPage.EditColumn');
  const src = `/icons/action/${action.job}/${action.semantic_key}.png`;

  const { toast } = useToast();

  const { mutateEntries, elevated } = useStratSyncStore((state) => state);
  const { insertEntry, moveEntries } = useEntryMutation();

  const [holdingShift, setHoldingShift] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const xMotionValue = useMotionValue(BOX_X_OFFSET[slot]);
  const yMotionValue = useMotionValue(useAt * pixelPerFrame);

  const { activeEntries, setActiveEntries, draggingCount, setDraggingCount } = useContext(EntrySelectionContext);
  const draggable = elevated && !isLocked;
  const [isDragging, setIsDragging] = useState(false);

  const dragControls = useDragControls();
  const effectiveDragControls = draggable ? dragControls : undefined;

  const [primaryDuration, ...otherDurations] = [...new Set(durations)].toSorted((a, b) => a - b);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    void animate(xMotionValue, BOX_X_OFFSET[slot])
  }, [slot]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    void animate(yMotionValue, useAt * pixelPerFrame);
  }, [pixelPerFrame, useAt]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (draggingCount === 0) {
      void animate(yMotionValue, useAt * pixelPerFrame);
    }
  }, [draggingCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setHoldingShift(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setHoldingShift(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="relative" disabled={!elevated}>
        <motion.div
          className={`${columnWidth} h-0 absolute z-[5] shadow-xl filter ${activeEntries.get(entryId) ? 'drop-shadow-selection' : ''}`}
          style={{
            x: xMotionValue,
            y: yMotionValue,
            zIndex: BOX_Z_INDEX[slot],
            cursor: draggable ? 'grab' : 'not-allowed',
            transitionProperty: 'filter',
            transitionDuration: '0.3s',
            transitionTimingFunction: 'ease-in-out',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
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

              setDraggingCount(activeEntries.size);
            }
          }}
          onDragStart={() => {
            setIsDragging(true);
          }}
          onDragEnd={() => {
            setIsDragging(false);
            yMotionValue.animation?.stop();

            const oldUseAt = useAt;
            const newUseAt = snapToStep(clamp(yMotionValue.get() / pixelPerFrame, 0, raidDuration));
            const offset = newUseAt - oldUseAt;

            moveEntries(activeEntries.keys().toArray(), offset);
            setActiveEntries(new Map());

            setDraggingCount((prev) => prev - 1);
          }}
          onClick={(e) => {
            if (!holdingShift) {
              setActiveEntries(new Map());

              if (action.charges > 1 && !isDragging) {
                const cursorY = e.clientY - e.currentTarget.getBoundingClientRect().top + useAt * pixelPerFrame;
                const cursorUseAt = snapToStep(clamp(cursorY / pixelPerFrame, 0, raidDuration));

                const success = insertEntry({
                  id: crypto.randomUUID(),
                  action: actionId,
                  player: playerId,
                  use_at: cursorUseAt,
                });

                if (!success) {
                  toast({
                    description: t('ActionOverlapError'),
                  });
                }
              }
            }
          }}
        >
          <div
            className={`relative ${columnWidth} overflow-hidden border-zinc-300 dark:border-zinc-700 border-b-[2px]`}
            style={{ height: `${action.cooldown * pixelPerFrame}px` }}
          >
            <div
              className={`absolute top-0 mx-auto ${columnWidth} ml-[calc(50%-1.5px)] border-zinc-300 dark:border-zinc-700 border-l-[3px] border-dotted`}
              style={{ height: `${action.cooldown * pixelPerFrame}px` }}
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
      <ContextMenuContent>
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
            mutateEntries([], [entryId], false);
            setActiveEntries((prev) => {
              const newActiveEntries = new Map(prev);
              newActiveEntries.delete(entryId);
              return newActiveEntries;
            });
          }}
        >
          {t('Delete')}
        </ContextMenuItem>
        {activeEntries.size > 1 && (
          <ContextMenuItem
            inset
            onClick={() => {
              mutateEntries([], activeEntries.keys().toArray(), false);
              setActiveEntries(new Map());
            }}
          >
            {t('DeleteAll')}
          </ContextMenuItem>
        )}
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

  const pixelPerFrame = usePixelPerFrame();
  const { insertEntry } = useEntryMutation();
  const { elevated } = useStratSyncStore((state) => state);

  const { setActiveEntries } = useContext(EntrySelectionContext);

  const slotMap: Map<string, number> = useMemo(() => {
    const slots: { id: string; use_at: number }[][] = Array.from({ length: action.charges }, () => []);

    for (const { id, use_at } of entries.toSorted((lhs, rhs) => lhs.use_at - rhs.use_at)) {
      let idx = 0;

      while (slots[idx].length > 0 && slots[idx][slots[idx].length - 1].use_at + action.cooldown > use_at) {
        idx++;
      }

      slots[idx].push({ id, use_at });
    }

    return new Map(slots.flatMap((slot, idx) => slot.map(({ id }) => [id, idx])));
  }, [entries, action]);

  const createBox: MouseEventHandler<HTMLDivElement> = async (evt) => {
    const cursorY = evt.clientY - evt.currentTarget.getBoundingClientRect().top;
    const cursorUseAt = cursorY / pixelPerFrame;
    const useAt = snapToStep(cursorUseAt);

    setActiveEntries(new Map());

    const success = insertEntry({
      id: crypto.randomUUID(),
      action: action.id,
      player: playerId,
      use_at: useAt,
    });

    if (!success) {
      toast({
        description: t('ActionOverlapError'),
      });
    }
  };

  return (
    <div
      className={`flex flex-shrink-0 ${columnWidth} overflow-hidden hover:bg-muted`}
      style={{ height: `${raidDuration * pixelPerFrame + BOTTOM_PADDING_PX}px` }}
    >
      <AnimatePresence>
        {...entries.map(({ id, use_at }, index) => (
          <DraggableBox
            key={`draggable-box-${id}`}
            action={action}
            entry={entries[index]}
            slot={slotMap.get(id) ?? 0}
            raidDuration={raidDuration}
            durations={action.mitigations.map(({ duration }) => duration)}
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
