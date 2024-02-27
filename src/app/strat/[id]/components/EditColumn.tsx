import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { animate, motion, useMotionValue } from 'framer-motion';
import React, { useState, type MouseEventHandler } from 'react';
import { uidSync } from 'uid-ts';
import {
  type JobTemp,
  type SkillTemp,
  columnWidth,
  columnWidthLarge,
  pixelPerSecTemp,
  raidDurationTemp,
} from './coreAreaConstants';

const TimeStepTemp = 1;
const PixelStepTemp = TimeStepTemp * pixelPerSecTemp;
const DurationTemp = 10;
const CoolDownTemp = 30;
const uidLength = 10;
const contextMenuWidth = 16;
const contextMenuWidthLarge = 32;

const snapToStep = (currentY: number) => {
  if (currentY < 0) currentY = 0;

  return PixelStepTemp * Math.round(currentY / PixelStepTemp);
};

const overlaps = (currentYCoord: number, otherYCoord: number, cooldown: number) =>
  Math.abs(currentYCoord - otherYCoord) < cooldown * pixelPerSecTemp;

const evaluateOverlap = (
  currentYCoord: number,
  prevYCoord: number,
  otherYCoord: number,
  cooldown: number,
) => {
  if (Math.abs(currentYCoord - otherYCoord) >= cooldown * pixelPerSecTemp * 0.5)
    return currentYCoord < otherYCoord ? 'up' : 'down';
  return prevYCoord < otherYCoord ? 'up' : 'down';
};

const removeOverlap = (
  currentYCoord: number,
  prevYCoord: number,
  otherYCoords: number[],
  cooldown: number,
) => {
  otherYCoords = otherYCoords.toSorted((a, b) => a - b);

  const overlapIndex = otherYCoords.reduce(
    (acc, curr, index) =>
      Math.abs(curr - currentYCoord) < acc.value
        ? { value: Math.abs(curr - currentYCoord), index }
        : acc,
    { value: cooldown * pixelPerSecTemp, index: -1 },
  ).index;

  if (overlapIndex !== -1) {
    if (evaluateOverlap(currentYCoord, prevYCoord, otherYCoords[overlapIndex], cooldown) === 'up')
      return otherYCoords
        .slice(0, overlapIndex + 1)
        .reduceRight(
          (acc, curr, _) =>
            overlaps(acc, curr, cooldown) ? curr - cooldown * pixelPerSecTemp : acc,
          currentYCoord,
        );

    return otherYCoords
      .slice(overlapIndex)
      .reduce(
        (acc, curr, _) => (overlaps(acc, curr, cooldown) ? curr + cooldown * pixelPerSecTemp : acc),
        currentYCoord,
      );
  }

  return currentYCoord;
};

const DraggableBox = ({
  yCoord,
  setYCoord,
  deleteBox,
  otherYCoords,
}: {
  yCoord: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  setYCoord: (yCoord: number) => void;
  deleteBox: () => void;
  otherYCoords: number[];
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const yMotionValue = useMotionValue(yCoord);

  const adjustPosition = () => {
    yMotionValue.animation?.cancel();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const clampedYCoord = Math.max(Math.min(yCoord, raidDurationTemp * pixelPerSecTemp), 0);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const calcedYCoord = snapToStep(
      removeOverlap(snapToStep(yMotionValue.get()), clampedYCoord, otherYCoords, CoolDownTemp),
    );
    void animate(yMotionValue, calcedYCoord);
    setYCoord(calcedYCoord);
  };

  const onLock = (checked: boolean) => {
    setIsLocked(checked);
  };

  const onDelete: React.MouseEventHandler<HTMLDivElement> = (evt) => {
    deleteBox();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="relative">
        <motion.div
          drag={isLocked ? false : 'y'}
          dragMomentum={false}
          onDragEnd={adjustPosition}
          className={`w-${columnWidth} lg:w-${columnWidthLarge} h-0 absolute`}
          style={{ y: yMotionValue }}
        >
          <div
            className={`w-${columnWidth} lg:w-${columnWidthLarge} rounded-sm overflow-hidden bg-secondary shadow-inner`}
            style={{
              height: `${CoolDownTemp * pixelPerSecTemp}px`,
              borderWidth: isLocked ? '2px' : undefined,
              borderColor: isLocked ? 'gray' : undefined,
            }}
          >
            <div
              className={`w-${columnWidth} lg:w-${columnWidthLarge} rounded-sm bg-slate-300 shadow-inner`}
              style={{ height: `${DurationTemp * pixelPerSecTemp}px` }}
            />
          </div>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className={`w-${contextMenuWidth} lg:w-${contextMenuWidthLarge}`}>
        <ContextMenuCheckboxItem checked={isLocked} onCheckedChange={onLock}>
          Lock
        </ContextMenuCheckboxItem>
        <ContextMenuItem inset onClick={onDelete}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const EditSubColumn = ({ job }: { job: JobTemp; skill: SkillTemp }) => {
  const [boxValues, setBoxValues] = useState<Array<{ yCoord: number; key: string }>>([
    {
      yCoord: 160,
      key: uidSync(uidLength),
    },
  ]);

  const checkCanCreate = (cursorY: number) => {
    if (
      boxValues.some(
        (boxValue) =>
          cursorY - boxValue.yCoord >= 0 &&
          cursorY - boxValue.yCoord <= CoolDownTemp * pixelPerSecTemp,
      )
    )
      return false;

    const tryY = removeOverlap(
      snapToStep(cursorY),
      snapToStep(cursorY),
      boxValues.map((boxValue) => boxValue.yCoord),
      CoolDownTemp,
    );

    return (
      Math.abs(tryY - cursorY) <= CoolDownTemp * pixelPerSecTemp &&
      tryY >= 0 &&
      tryY <= raidDurationTemp * pixelPerSecTemp
    );
  };

  const createBox: MouseEventHandler<HTMLDivElement> = (evt) => {
    const cursorY = evt.clientY - evt.currentTarget.getBoundingClientRect().top;

    if (checkCanCreate(cursorY))
      setBoxValues(
        [
          ...boxValues,
          {
            yCoord: snapToStep(
              removeOverlap(
                snapToStep(cursorY),
                snapToStep(cursorY),
                boxValues.map((boxValue) => boxValue.yCoord),
                CoolDownTemp,
              ),
            ),
            key: uidSync(uidLength),
          },
        ].toSorted((a, b) => a.yCoord - b.yCoord),
      );
  };

  return (
    <div
      className={`flex flex-shrink-0 w-${columnWidth} lg:w-${columnWidthLarge} overflow-hidden`}
      style={{ height: raidDurationTemp * pixelPerSecTemp }}
      onClick={createBox}
    >
      {...boxValues.map((boxValue, index) => (
        <DraggableBox
          key={boxValue.key}
          yCoord={boxValue.yCoord}
          setYCoord={(yCoord) => {
            setBoxValues(
              boxValues
                .map((oldValue) =>
                  oldValue.key === boxValue.key ? { yCoord, key: boxValue.key } : oldValue,
                )
                .toSorted((a, b) => a.yCoord - b.yCoord),
            );
          }}
          deleteBox={() => {
            setBoxValues(
              boxValues
                .filter((oldValue) => oldValue.key !== boxValue.key)
                .toSorted((a, b) => a.yCoord - b.yCoord),
            );
          }}
          otherYCoords={boxValues.filter((_, j) => j !== index).map((boxValue) => boxValue.yCoord)}
        />
      ))}
    </div>
  );
};

export const EditColumn = ({ job, skills }: { job: JobTemp; skills: SkillTemp[] }) => (
  <div className="flex px-1 border-r-[1px]" style={{ height: raidDurationTemp * pixelPerSecTemp }}>
    {skills.map((skill) => (
      <EditSubColumn key={skill.id} job={job} skill={skill} />
    ))}
  </div>
);
