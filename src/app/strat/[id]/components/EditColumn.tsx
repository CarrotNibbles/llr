import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { type AbilityDataType, type StrategyDataType } from '@/lib/queries';
import { clamp, usePixelPerFrame, type ArrayElement } from '@/lib/utils';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useState, type MouseEventHandler } from 'react';
import { uidSync } from 'uid-ts';
import { columnWidth, columnWidthLarge, timeStep } from './coreAreaConstants';

const uidLength = 10;
const contextMenuWidth = 16;
const contextMenuWidthLarge = 32;

const snapToStep = (currentUseAt: number) => {
  if (currentUseAt < 0) currentUseAt = 0;

  return timeStep * Math.round(currentUseAt / timeStep);
};

const overlaps = (currentUseAt: number, otherUseAt: number, cooldown: number) =>
  Math.abs(currentUseAt - otherUseAt) < cooldown;

const evaluateOverlap = (
  currentUseAt: number,
  prevUseAt: number,
  otherUseAt: number,
  cooldown: number,
) => {
  if (Math.abs(currentUseAt - otherUseAt) >= cooldown * 0.5)
    return currentUseAt < otherUseAt ? 'up' : 'down';
  return prevUseAt < otherUseAt ? 'up' : 'down';
};

function buildHelperFunctions(raidDuration: number, cooldown: number) {
  const removeOverlap = (currentUseAt: number, prevUseAt: number, otherUseAts: number[]) => {
    otherUseAts = otherUseAts.toSorted((a, b) => a - b);

    const overlapIndex = otherUseAts.reduce(
      (acc, curr, index) =>
        Math.abs(curr - currentUseAt) < acc.value
          ? { value: Math.abs(curr - currentUseAt), index }
          : acc,
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
}: {
  useAt: number;
  setUseAt: (useAt: number) => void;
  deleteBox: () => void;
  otherUseAts: number[];
  raidDuration: number;
  durations: number[];
  cooldown: number;
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const pixelPerFrame = usePixelPerFrame();
  const yMotionValue = useMotionValue(useAt * pixelPerFrame);
  const { snapAndRemoveOverlap } = buildHelperFunctions(raidDuration, cooldown);
  const [primaryDuration, ...otherDurations] = [...new Set(durations)].toSorted((a, b) => a - b);

  useEffect(() => {
    yMotionValue.set(useAt * pixelPerFrame);
  }, [yMotionValue, pixelPerFrame, useAt]);

  const adjustPosition = () => {
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
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="relative">
        <motion.div
          drag={isLocked ? false : 'y'}
          dragMomentum={false}
          onDragEnd={adjustPosition}
          className={`${columnWidth} ${columnWidthLarge} h-0 absolute active:z-[5]`}
          style={{ y: yMotionValue }}
        >
          <div
            className={`relative ${columnWidth} ${columnWidthLarge} rounded-sm overflow-hidden bg-slate-300 shadow-inner`}
            style={{
              height: `${cooldown * pixelPerFrame}px`,
              borderWidth: isLocked ? '2px' : undefined,
              borderColor: isLocked ? 'gray' : undefined,
            }}
          >
            {otherDurations.length > 0 && (
              <div
                className={`absolute top-0 ${columnWidth} ${columnWidthLarge} rounded-sm bg-slate-400 shadow-inner`}
                style={{ height: `${otherDurations[0] * pixelPerFrame}px` }}
              />
            )}
            <div
              className={`absolute top-0 ${columnWidth} ${columnWidthLarge} rounded-sm bg-slate-500 shadow-inner`}
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
  ability,
  entries,
}: {
  raidDuration: number;
  ability: ArrayElement<AbilityDataType>;
  entries: ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries'];
}) => {
  const [boxValues, setBoxValues] = useState<Array<{ useAt: number; key: string }>>(
    entries.map(({ use_at: useAt }) => ({ useAt, key: uidSync(uidLength) })),
  );
  const pixelPerFrame = usePixelPerFrame();
  const { snapAndRemoveOverlap } = buildHelperFunctions(raidDuration, ability.cooldown);

  const createBox: MouseEventHandler<HTMLDivElement> = (evt) => {
    const cursorY = evt.clientY - evt.currentTarget.getBoundingClientRect().top;
    const cursorUseAt = cursorY / pixelPerFrame;

    if (
      boxValues.some(
        (boxValue) =>
          cursorUseAt - boxValue.useAt >= 0 && cursorUseAt - boxValue.useAt <= ability.cooldown,
      )
    )
      return false;

    const useAtCalced = snapAndRemoveOverlap(
      cursorUseAt,
      snapToStep(cursorUseAt),
      boxValues.map((boxValue) => boxValue.useAt),
    );

    if (useAtCalced !== null)
      setBoxValues(
        [
          ...boxValues,
          {
            useAt: useAtCalced,
            key: uidSync(uidLength),
          },
        ].toSorted((a, b) => a.useAt - b.useAt),
      );
  };

  return (
    <div
      className={`flex flex-shrink-0 ${columnWidth} ${columnWidthLarge} overflow-hidden hover:bg-slate-100`}
      style={{ height: raidDuration * pixelPerFrame }}
      onClick={createBox}
    >
      {...boxValues.map((boxValue, index) => (
        <DraggableBox
          key={boxValue.key}
          raidDuration={raidDuration}
          durations={ability.mitigations.map(({ duration }) => duration)}
          cooldown={ability.cooldown}
          useAt={boxValue.useAt}
          setUseAt={(useAt) => {
            setBoxValues(
              boxValues
                .map((oldValue) =>
                  oldValue.key === boxValue.key ? { useAt, key: boxValue.key } : oldValue,
                )
                .toSorted((a, b) => a.useAt - b.useAt),
            );
          }}
          deleteBox={() => {
            setBoxValues(
              boxValues
                .filter((oldValue) => oldValue.key !== boxValue.key)
                .toSorted((a, b) => a.useAt - b.useAt),
            );
          }}
          otherUseAts={boxValues.filter((_, j) => j !== index).map((boxValue) => boxValue.useAt)}
        />
      ))}
    </div>
  );
};

export type EditColumnProps = {
  raidDuration: number;
  playerStrategy: ArrayElement<StrategyDataType['strategy_players']>;
  abilities: AbilityDataType;
};

export const EditColumn = ({ raidDuration, playerStrategy, abilities }: EditColumnProps) => {
  const pixelPerFrame = usePixelPerFrame();

  return (
    <div className="flex px-1 border-r-[1px]" style={{ height: raidDuration * pixelPerFrame }}>
      {abilities.map((ability) => (
        <EditSubColumn
          key={`subcolumn-${ability.id}`}
          raidDuration={raidDuration}
          ability={ability}
          entries={playerStrategy.strategy_player_entries.filter(
            ({ ability: abilityId }) => abilityId === ability.id,
          )}
        />
      ))}
    </div>
  );
};
