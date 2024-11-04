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
import type { ArrayElement } from '@/lib/utils';
import { AnimatePresence, animate, motion, useDragControls, useMotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import React, { type MouseEventHandler, useEffect, useMemo, useState } from 'react';

import { useStaticDataStore } from '@/components/providers/StaticDataStoreProvider';
import { usePixelPerFrame } from '@/lib/states';
import { useContext } from 'use-context-selector';
import { BOX_X_OFFSET, BOX_Z_INDEX, columnWidth, COUNTDOWN_DURATION } from '../../utils/constants';
import { MultiIntervalSet, getAreaHeight, timeToY, yToTime, yToTimeUnclamped } from '../../utils/helpers';
import { EntrySelectionContext } from './EntrySelectionContext';
import { deepEqual } from 'fast-equals';

function useEntryMutation() {
  const getStore = useStratSyncStore((state) => state.getStore);
  const actionData = useStaticDataStore((state) => state.actionData);

  const moveEntries = (ids: string[], offset: number) => {
    const { strategyData, mutateEntries } = getStore();

    const raidDuration = strategyData.raids?.duration ?? 0;

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

            if (offset == 0 || fixedIntervals.length === entries.length) {
              const upserts = entries.filter((entry) => ids.includes(entry.id));

              return upserts.map((entry) => {
                return { ...entry, use_at: entry.use_at };
              });
            } else if (offset > 0) {
              const upserts = entries.filter((entry) => ids.includes(entry.id)).toReversed();

              let currentOffset = offset;
              currentOffset = Math.min(currentOffset, raidDuration - upserts[0].use_at);

              const mis = new MultiIntervalSet(action.charges, fixedIntervals);
              return upserts.map((entry) => {
                currentOffset = mis.offsetSearch([entry.use_at, entry.use_at + action.cooldown], currentOffset);

                mis.insertInterval([entry.use_at + currentOffset, entry.use_at + action.cooldown + currentOffset]);

                return { ...entry, use_at: entry.use_at + currentOffset };
              });
            } else {
              const upserts = entries.filter((entry) => ids.includes(entry.id));

              let currentOffset = offset;
              currentOffset = Math.max(currentOffset, -COUNTDOWN_DURATION - upserts[0].use_at);

              const mis = new MultiIntervalSet(action.charges, fixedIntervals);
              return upserts.map((entry) => {
                currentOffset = mis.offsetSearch([entry.use_at, entry.use_at + action.cooldown], currentOffset);

                mis.insertInterval([entry.use_at + currentOffset, entry.use_at + action.cooldown + currentOffset]);

                return { ...entry, use_at: entry.use_at + currentOffset };
              });
            }
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
    const { strategyData, mutateEntries } = getStore();

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
};

const DraggableBox = ({ action, entry, slot, raidDuration }: DraggableBoxProps) => {
  const { use_at: useAt, id: entryId, player: playerId } = entry;
  const durations = action.mitigations.map(({ duration }) => duration);

  const t = useTranslations('StratPage.EditColumn');
  const tActions = useTranslations('Common.Actions');
  const pixelPerFrame = usePixelPerFrame();
  const src = `/icons/action/${action.job}/${action.semantic_key}.png`;

  const { toast } = useToast();

  const elevated = useStratSyncStore((state) => state.elevated);
  const mutateEntries = useStratSyncStore((state) => state.mutateEntries);
  const { insertEntry, moveEntries } = useEntryMutation();

  const [holdingShift, setHoldingShift] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const xMotionValue = useMotionValue(BOX_X_OFFSET[slot]);
  const yMotionValue = useMotionValue(timeToY(useAt, pixelPerFrame));

  const { activeEntries, setActiveEntries, draggingCount, setDraggingCount } = useContext(EntrySelectionContext);
  const draggable = elevated && !isLocked;
  const [isDragging, setIsDragging] = useState(false);

  const dragControls = useDragControls();
  const effectiveDragControls = draggable ? dragControls : undefined;

  const [primaryDuration, ...otherDurations] = [...new Set(durations)].toSorted((a, b) => a - b);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    animate(xMotionValue, BOX_X_OFFSET[slot]);
  }, [slot]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // yMotionValue.animation?.stop();
    animate(yMotionValue, timeToY(useAt, pixelPerFrame));
  }, [pixelPerFrame, useAt]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (draggingCount === 0) {
      void animate(yMotionValue, timeToY(useAt, pixelPerFrame));
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
          className={`${columnWidth} h-0 absolute z-[5] filter ${activeEntries.get(entryId) ? 'drop-shadow-selection' : ''}`}
          style={{
            x: xMotionValue,
            y: yMotionValue,
            height: `${action.cooldown * pixelPerFrame}px`,
            zIndex: BOX_Z_INDEX[slot],
            cursor: draggable ? 'grab' : 'not-allowed',
            transitionProperty: 'filter',
            transitionDuration: '0.3s',
            transitionTimingFunction: 'ease-in-out',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          drag={draggable ? 'y' : false}
          dragControls={effectiveDragControls}
          dragListener={false}
          dragMomentum={false}
          dragPropagation
          onPointerDown={(e) => {
            if (draggable) {
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

            if (activeEntries.keys().next().value === entryId) {
              const oldUseAt = useAt;
              const newUseAt = yToTimeUnclamped(yMotionValue.get(), pixelPerFrame);
              const offset = newUseAt - oldUseAt;

              moveEntries(activeEntries.keys().toArray(), offset);

              setActiveEntries(new Map());
            }

            setDraggingCount((prev) => prev - 1);
          }}
          onClick={(e) => {
            if (!holdingShift) {
              setActiveEntries(new Map());

              if (action.charges > 1 && !isDragging) {
                const cursorY = e.clientY - e.currentTarget.getBoundingClientRect().top + timeToY(useAt, pixelPerFrame);
                const cursorUseAt = yToTime(cursorY, pixelPerFrame, raidDuration);

                const success = insertEntry({
                  id: crypto.randomUUID(),
                  action: action.id,
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
          <div className="pointer-events-none">
            <div
              className={`absolute top-0 ${columnWidth} ml-[calc(50%-1.5px)] border-zinc-300 dark:border-zinc-700 border-l-[3px] border-dotted`}
              style={{ height: `${action.cooldown * pixelPerFrame}px` }}
            />
            <div
              className={`absolute top-0 ${columnWidth} border-zinc-300 dark:border-zinc-700 border-b-[2px] border-solid`}
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
            <div className="aspect-square relative w-full">
              <Image
                src={src}
                alt={tActions(action.semantic_key)}
                onDragStart={() => {
                  return false;
                }}
                layout="fill"
                objectFit="contain"
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

const EditSubColumn = React.memo(({ raidDuration, action, entries, playerId }: EditSubColumnProps) => {
  const { toast } = useToast();
  const t = useTranslations('StratPage.EditColumn');

  const pixelPerFrame = usePixelPerFrame();
  const areaHeight = getAreaHeight(pixelPerFrame, raidDuration);

  const { insertEntry } = useEntryMutation();
  const elevated = useStratSyncStore((state) => state.elevated);

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
    const cursorUseAt = yToTime(cursorY, pixelPerFrame, raidDuration);

    setActiveEntries(new Map());

    const success = insertEntry({
      id: crypto.randomUUID(),
      action: action.id,
      player: playerId,
      use_at: cursorUseAt,
    });

    if (!success) {
      toast({
        description: t('ActionOverlapError'),
      });
    }
  };

  return (
    <div className={`flex flex-shrink-0 ${columnWidth} overflow-hidden hover:bg-muted`} style={{ height: areaHeight }}>
      <AnimatePresence>
        {entries.map(({ id }, index) => (
          <DraggableBox
            key={`draggable-box-${id}`}
            action={action}
            entry={entries[index]}
            slot={slotMap.get(id) ?? 0}
            raidDuration={raidDuration}
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
}, deepEqual);

export type EditColumnProps = {
  playerId: string;
  raidDuration: number;
  entries: ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries'];
  actions: ActionDataType;
};

const EditColumn = React.memo(({ playerId, raidDuration, entries, actions }: EditColumnProps) => {
  const pixelPerFrame = usePixelPerFrame();
  const areaHeight = getAreaHeight(pixelPerFrame, raidDuration);

  const actionEntriesRecord = useMemo(() => {
    const record: Record<string, ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries']> = {};

    for (const entry of entries) {
      if (record[entry.action] === undefined) {
        record[entry.action] = [];
      }

      record[entry.action].push(entry);
    }

    return record;
  }, [entries]);

  return (
    <div className="flex px-1 space-x-1 border-r-[1px] relative" style={{ height: areaHeight }}>
      {actions.map((action) => (
        <EditSubColumn
          key={`subcolumn-${playerId}-${action.id}`}
          playerId={playerId}
          raidDuration={raidDuration}
          action={action}
          entries={actionEntriesRecord[action.id] ?? []}
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
}, deepEqual);

EditSubColumn.displayName = 'EditSubColumn';
EditColumn.displayName = 'EditColumn';

export { EditColumn };
