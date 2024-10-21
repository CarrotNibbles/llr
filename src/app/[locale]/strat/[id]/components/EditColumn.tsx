import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { ActionDataType, StrategyDataType } from '@/lib/queries/server';
import { type ArrayElement, clamp, usePixelPerFrame } from '@/lib/utils';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import { type MouseEventHandler, useEffect, useState } from 'react';
import { columnWidth, columnWidthLarge, timeStep } from './coreAreaConstants';

const contextMenuWidth = 16;
const contextMenuWidthLarge = 32;

const snapToStep = (currentUseAt: number) => {
  const clampedUseAt = currentUseAt > 0 ? currentUseAt : 0;

  return timeStep * Math.round(clampedUseAt / timeStep);
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

const DraggableBox = ({
  action,
  entry,
  otherUseAts,
  raidDuration,
  durations,
  cooldown,
}: {
  action: ArrayElement<ActionDataType>;
  entry: ArrayElement<ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries']>;
  otherUseAts: number[];
  raidDuration: number;
  durations: number[];
  cooldown: number;
}) => {
  const { use_at: useAt, id: entryId, action: actionId, player: playerId } = entry;
  const t = useTranslations('StratPage.EditColumn');

  const { upsertEntry, deleteEntry, elevated } = useStratSyncStore((state) => state);
  const [isLocked, setIsLocked] = useState(false);
  const pixelPerFrame = usePixelPerFrame();
  const yMotionValue = useMotionValue(useAt * pixelPerFrame);
  const { snapAndRemoveOverlap } = buildHelperFunctions(raidDuration, cooldown);
  const [primaryDuration, ...otherDurations] = [...new Set(durations)].toSorted((a, b) => a - b);

  const src = `/icons/action/${action.job}/${action.semantic_key}.png`;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    void animate(yMotionValue, useAt * pixelPerFrame);
  }, [pixelPerFrame, useAt]);

  const onDragEnd = async () => {
    // AdjustPosition
    yMotionValue.animation?.cancel();

    const oldUseAt = useAt;
    const newUseAt = clamp(yMotionValue.get() / pixelPerFrame, 0, raidDuration);
    const newUseAtCalced = snapAndRemoveOverlap(newUseAt, useAt, otherUseAts);

    const snappedUseAt = newUseAtCalced !== null ? snapToStep(newUseAtCalced) : oldUseAt;

    void animate(yMotionValue, snappedUseAt * pixelPerFrame);

    if (newUseAtCalced === null) return;

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
          drag={isLocked || !elevated ? false : 'y'}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          className={`${columnWidth} ${columnWidthLarge} h-0 absolute z-[5]`}
          style={{ y: yMotionValue, cursor: isLocked || !elevated ? 'not-allowed' : 'grab' }}
        >
          <div
            className={`relative ${columnWidth} ${columnWidthLarge} overflow-hidden border-zinc-300 dark:border-zinc-700 border-b-[2px]`}
            style={{
              height: `${cooldown * pixelPerFrame}px`,
              borderWidth: isLocked ? '2px' : undefined,
              borderColor: isLocked ? 'gray' : undefined,
            }}
          >
            <div
              className={`absolute top-0 mx-auto ${columnWidth} ${columnWidthLarge} ml-[calc(50%-1.5px)] border-zinc-300 dark:border-zinc-700 border-l-[3px] border-dotted`}
              style={{ height: `${cooldown * pixelPerFrame}px` }}
            />
            {otherDurations.length > 0 && (
              <>
                <div
                  className={`absolute top-0 ${columnWidth} ${columnWidthLarge} ml-[calc(50%-1.5px)] border-zinc-400 dark:border-zinc-600 border-l-[3px] border-solid`}
                  style={{ height: `${otherDurations[0] * pixelPerFrame}px` }}
                />
                <div
                  className={`absolute top-0 ${columnWidth} ${columnWidthLarge} border-zinc-400 dark:border-zinc-600 border-b-[2px] border-solid`}
                  style={{ height: `${otherDurations[0] * pixelPerFrame}px` }}
                />
              </>
            )}
            <div
              className={`absolute top-0 ${columnWidth} ${columnWidthLarge} ml-[calc(50%-1.5px)] border-zinc-500 dark:border-zinc-500 border-l-[3px] border-solid`}
              style={{ height: `${primaryDuration * pixelPerFrame}px` }}
            />
            <div
              className={`absolute top-0 ${columnWidth} ${columnWidthLarge} border-zinc-500 dark:border-zinc-500 border-b-[2px] border-solid`}
              style={{ height: `${primaryDuration * pixelPerFrame}px` }}
            />
            <div className="aspect-square relative w-full pointer-events-none">
              <Image src={src} alt={action.name} layout="fill" objectFit="contain" />
            </div>
          </div>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className={`w-${contextMenuWidth} lg:w-${contextMenuWidthLarge}`}>
        <ContextMenuCheckboxItem
          checked={isLocked}
          onCheckedChange={(checked) => {
            setIsLocked(checked);
          }}
        >
          {t('Lock')}
        </ContextMenuCheckboxItem>
        <ContextMenuItem
          inset
          onClick={() => {
            deleteEntry(entryId, false);
          }}
        >
          {t('Delete')}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const EditSubColumn = ({
  raidDuration,
  action,
  entries,
  playerId,
}: {
  raidDuration: number;
  action: ArrayElement<ActionDataType>;
  entries: ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries'];
  playerId: string;
}) => {
  const { upsertEntry } = useStratSyncStore((state) => state);
  const boxValues = entries.map((entry) => ({ useAt: entry.use_at, id: entry.id }));
  const pixelPerFrame = usePixelPerFrame();
  const { snapAndRemoveOverlap } = buildHelperFunctions(raidDuration, action.cooldown);
  const { elevated } = useStratSyncStore((state) => state);

  const createBox: MouseEventHandler<HTMLDivElement> = async (evt) => {
    const cursorY = evt.clientY - evt.currentTarget.getBoundingClientRect().top;
    const cursorUseAt = cursorY / pixelPerFrame;

    if (
      boxValues.some((boxValue) => cursorUseAt - boxValue.useAt >= 0 && cursorUseAt - boxValue.useAt <= action.cooldown)
    )
      return false;

    const useAtCalced = snapAndRemoveOverlap(
      cursorUseAt,
      snapToStep(cursorUseAt),
      boxValues.map((boxValue) => boxValue.useAt),
    );

    if (useAtCalced !== null) {
      upsertEntry(
        {
          id: crypto.randomUUID(),
          action: action.id,
          player: playerId,
          useAt: useAtCalced,
        },
        false,
      );
    }
  };

  return (
    <div
      className={`flex flex-shrink-0 ${columnWidth} ${columnWidthLarge} overflow-hidden hover:bg-muted`}
      style={{ height: `${raidDuration * pixelPerFrame + 60}px` }}
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
    <div className="flex px-1 space-x-1 border-r-[1px]" style={{ height: raidDuration * pixelPerFrame }}>
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
          <div className={`${columnWidth} ${columnWidthLarge}`} />
          <div className={`${columnWidth} ${columnWidthLarge}`} />
          <div className={`${columnWidth} ${columnWidthLarge}`} />
        </>
      )}
    </div>
  );
};
