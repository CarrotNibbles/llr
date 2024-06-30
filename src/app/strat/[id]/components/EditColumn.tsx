import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  buildClientDeleteStrategyPlayerEntryQuery,
  buildClientInsertStrategyPlayerEntryQuery,
  buildClientUpdateStrategyPlayerEntryQuery,
} from '@/lib/queries/client';
import type { ActionDataType, StrategyDataType } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/client';
import { type ArrayElement, clamp, usePixelPerFrame } from '@/lib/utils';
import { animate, motion, useMotionValue } from 'framer-motion';
import { type MouseEventHandler, useEffect, useState } from 'react';
import { columnWidth, columnWidthLarge, timeStep } from './coreAreaConstants';

const contextMenuWidth = 16;
const contextMenuWidthLarge = 32;

const snapToStep = (currentUseAt: number) => {
  if (currentUseAt < 0) currentUseAt = 0;

  return timeStep * Math.round(currentUseAt / timeStep);
};

const overlaps = (currentUseAt: number, otherUseAt: number, cooldown: number) =>
  Math.abs(currentUseAt - otherUseAt) < cooldown;

const evaluateOverlap = (currentUseAt: number, prevUseAt: number, otherUseAt: number, cooldown: number) => {
  if (Math.abs(currentUseAt - otherUseAt) >= cooldown * 0.5) return currentUseAt < otherUseAt ? 'up' : 'down';
  return prevUseAt < otherUseAt ? 'up' : 'down';
};

function buildHelperFunctions(raidDuration: number, cooldown: number) {
  const removeOverlap = (currentUseAt: number, prevUseAt: number, otherUseAts: number[]) => {
    otherUseAts = otherUseAts.toSorted((a, b) => a - b);

    const overlapIndex = otherUseAts.reduce(
      (acc, curr, index) =>
        Math.abs(curr - currentUseAt) < acc.value ? { value: Math.abs(curr - currentUseAt), index } : acc,
      { value: cooldown, index: -1 },
    ).index;

    if (overlapIndex === -1) return currentUseAt;

    const newUseAt =
      evaluateOverlap(currentUseAt, prevUseAt, otherUseAts[overlapIndex], cooldown) === 'up'
        ? otherUseAts[overlapIndex] - cooldown
        : otherUseAts[overlapIndex] + cooldown;

    if (
      newUseAt >= 0 &&
      newUseAt <= raidDuration &&
      otherUseAts.every((otherUseAt) => !overlaps(newUseAt, otherUseAt, cooldown))
    )
      return newUseAt;

    return null;
  };

  const snapAndRemoveOverlap = (currentUseAt: number, prevUseAt: number, otherUseAts: number[]) =>
    removeOverlap(snapToStep(currentUseAt), prevUseAt, otherUseAts);

  return { removeOverlap, snapAndRemoveOverlap };
}

const DraggableBox = ({
  useAt,
  setUseAt,
  deleteBox,
  otherUseAts,
  raidDuration,
  durations,
  cooldown,
  id,
  actionId,
  playerId,
}: {
  useAt: number;
  setUseAt: (useAt: number) => void;
  deleteBox: () => void;
  otherUseAts: number[];
  raidDuration: number;
  durations: number[];
  cooldown: number;
  id: string;
  actionId: string;
  playerId: string;
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const pixelPerFrame = usePixelPerFrame();
  const yMotionValue = useMotionValue(useAt * pixelPerFrame);
  const { snapAndRemoveOverlap } = buildHelperFunctions(raidDuration, cooldown);
  const [primaryDuration, ...otherDurations] = [...new Set(durations)].toSorted((a, b) => a - b);

  useEffect(() => {
    yMotionValue.set(useAt * pixelPerFrame);
  }, [yMotionValue, pixelPerFrame, useAt]);

  const onDragEnd = async () => {
    // AdjustPosition
    yMotionValue.animation?.cancel();

    const oldUseAt = useAt;
    const newUseAt = clamp(yMotionValue.get() / pixelPerFrame, 0, raidDuration);
    const newUseAtCalced = snapAndRemoveOverlap(newUseAt, useAt, otherUseAts);

    if (newUseAtCalced === null) {
      void animate(yMotionValue, oldUseAt * pixelPerFrame);
      setUseAt(oldUseAt);
    } else {
      void animate(yMotionValue, snapToStep(newUseAtCalced) * pixelPerFrame);
      setUseAt(snapToStep(newUseAtCalced));
    }

    // Supabase update
    await buildClientUpdateStrategyPlayerEntryQuery(createClient(), {
      id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      use_at: newUseAtCalced ?? newUseAt,
      action: actionId,
      player: playerId,
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="relative">
        <motion.div
          drag={isLocked ? false : 'y'}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          className={`${columnWidth} ${columnWidthLarge} h-0 absolute active:z-[5]`}
          style={{ y: yMotionValue, cursor: isLocked ? 'not-allowed' : 'grab' }}
        >
          <div
            className={`relative ${columnWidth} ${columnWidthLarge} rounded-sm overflow-hidden bg-zinc-200 dark:bg-zinc-700 shadow-inner`}
            style={{
              height: `${cooldown * pixelPerFrame}px`,
              borderWidth: isLocked ? '2px' : undefined,
              borderColor: isLocked ? 'gray' : undefined,
            }}
          >
            {otherDurations.length > 0 && (
              <div
                className={`absolute top-0 ${columnWidth} ${columnWidthLarge} rounded-sm bg-zinc-300 dark:bg-zinc-600 shadow-inner`}
                style={{ height: `${otherDurations[0] * pixelPerFrame}px` }}
              />
            )}
            <div
              className={`absolute top-0 ${columnWidth} ${columnWidthLarge} rounded-sm bg-zinc-400 dark:bg-zinc-500 shadow-inner`}
              style={{ height: `${primaryDuration * pixelPerFrame}px` }}
            />
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
          Lock
        </ContextMenuCheckboxItem>
        <ContextMenuItem
          inset
          onClick={() => {
            deleteBox();
          }}
        >
          Delete
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
  const [boxValues, setBoxValues] = useState<Array<{ useAt: number; key: string }>>(
    entries.map((entry) => ({ useAt: entry.use_at, key: entry.id })),
  );
  const pixelPerFrame = usePixelPerFrame();
  const { snapAndRemoveOverlap } = buildHelperFunctions(raidDuration, action.cooldown);

  const supabase = createClient();

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
      // Supabase insert
      const response = await buildClientInsertStrategyPlayerEntryQuery(supabase, {
        action: action.id,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        use_at: useAtCalced,
        player: playerId,
      });

      const insertedId = response.data?.[0]?.id ?? '';

      setBoxValues(
        [
          ...boxValues,
          {
            useAt: useAtCalced,
            // 흑마법 (쿼리횟수 줄이기)
            key: insertedId,
          },
        ].toSorted((a, b) => a.useAt - b.useAt),
      );
    }
  };

  return (
    <div
      className={`flex flex-shrink-0 ${columnWidth} ${columnWidthLarge} overflow-hidden hover:bg-muted`}
      style={{ height: raidDuration * pixelPerFrame }}
      onClick={createBox}
    >
      {...boxValues.map((boxValue, index) => (
        <DraggableBox
          key={boxValue.key}
          raidDuration={raidDuration}
          durations={action.mitigations.map(({ duration }) => duration)}
          cooldown={action.cooldown}
          useAt={boxValue.useAt}
          setUseAt={(useAt) => {
            setBoxValues(
              boxValues
                .map((oldValue) => (oldValue.key === boxValue.key ? { useAt, key: boxValue.key } : oldValue))
                .toSorted((a, b) => a.useAt - b.useAt),
            );
          }}
          deleteBox={async () => {
            setBoxValues(
              boxValues.filter((oldValue) => oldValue.key !== boxValue.key).toSorted((a, b) => a.useAt - b.useAt),
            );
            // Supabase delete
            await buildClientDeleteStrategyPlayerEntryQuery(supabase, boxValue.useAt, action.id);
          }}
          otherUseAts={boxValues.filter((_, j) => j !== index).map((boxValue) => boxValue.useAt)}
          id={boxValue.key}
          actionId={action.id}
          playerId={playerId}
        />
      ))}
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
          key={`subcolumn-${action.id}`}
          raidDuration={raidDuration}
          action={action}
          entries={playerStrategy.strategy_player_entries.filter(({ action: actionId }) => actionId === action.id)}
          playerId={playerStrategy.id}
        />
      ))}
    </div>
  );
};
