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
  raidDurationTemp,
  timeStep,
  usePixelPerFrame,
} from './coreAreaConstants';

const DurationTemp = 10 * 60;
const CoolDownTemp = 30 * 60;
const uidLength = 10;
const contextMenuWidth = 16;
const contextMenuWidthLarge = 32;

const snapToStep = (currentY: number, pixelPerFrame: number) => {
  if (currentY < 0) currentY = 0;

  return timeStep * pixelPerFrame * Math.round(currentY / (timeStep * pixelPerFrame));
};

const overlaps = (
  currentYCoord: number,
  otherYCoord: number,
  cooldown: number,
  pixelPerFrame: number,
) => Math.abs(currentYCoord - otherYCoord) < cooldown * pixelPerFrame;

const evaluateOverlap = (
  currentYCoord: number,
  prevYCoord: number,
  otherYCoord: number,
  cooldown: number,
  pixelPerFrame: number,
  // eslint-disable-next-line max-params
) => {
  if (Math.abs(currentYCoord - otherYCoord) >= cooldown * pixelPerFrame * 0.5)
    return currentYCoord < otherYCoord ? 'up' : 'down';
  return prevYCoord < otherYCoord ? 'up' : 'down';
};

const removeOverlap = (
  currentYCoord: number,
  prevYCoord: number,
  otherYCoords: number[],
  cooldown: number,
  pixelPerFrame: number,
  // eslint-disable-next-line max-params
) => {
  otherYCoords = otherYCoords.toSorted((a, b) => a - b);

  const overlapIndex = otherYCoords.reduce(
    (acc, curr, index) =>
      Math.abs(curr - currentYCoord) < acc.value
        ? { value: Math.abs(curr - currentYCoord), index }
        : acc,
    { value: cooldown * pixelPerFrame, index: -1 },
  ).index;

  if (overlapIndex !== -1) {
    if (
      evaluateOverlap(
        currentYCoord,
        prevYCoord,
        otherYCoords[overlapIndex],
        cooldown,
        pixelPerFrame,
      ) === 'up'
    )
      return otherYCoords
        .slice(0, overlapIndex + 1)
        .reduceRight(
          (acc, curr, _) =>
            overlaps(acc, curr, cooldown, pixelPerFrame) ? curr - cooldown * pixelPerFrame : acc,
          currentYCoord,
        );

    return otherYCoords
      .slice(overlapIndex)
      .reduce(
        (acc, curr, _) =>
          overlaps(acc, curr, cooldown, pixelPerFrame) ? curr + cooldown * pixelPerFrame : acc,
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
  const pixelPerFrame = usePixelPerFrame();

  const adjustPosition = () => {
    yMotionValue.animation?.cancel();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const clampedYCoord = Math.max(Math.min(yCoord, raidDurationTemp * pixelPerFrame), 0);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const calcedYCoord = snapToStep(
      removeOverlap(
        snapToStep(yMotionValue.get(), pixelPerFrame),
        clampedYCoord,
        otherYCoords,
        CoolDownTemp,
        pixelPerFrame,
      ),
      pixelPerFrame,
    );
    void animate(yMotionValue, calcedYCoord);
    setYCoord(calcedYCoord);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="relative">
        <motion.div
          drag={isLocked ? false : 'y'}
          dragMomentum={false}
          onDragEnd={adjustPosition}
          className={`w-${columnWidth} lg:w-${columnWidthLarge} h-0 absolute active:z-[5]`}
          style={{ y: yMotionValue }}
        >
          <div
            className={`w-${columnWidth} lg:w-${columnWidthLarge} rounded-sm overflow-hidden bg-secondary shadow-inner`}
            style={{
              height: `${CoolDownTemp * pixelPerFrame}px`,
              borderWidth: isLocked ? '2px' : undefined,
              borderColor: isLocked ? 'gray' : undefined,
            }}
          >
            <div
              className={`w-${columnWidth} lg:w-${columnWidthLarge} rounded-sm bg-slate-300 shadow-inner`}
              style={{ height: `${DurationTemp * pixelPerFrame}px` }}
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

const EditSubColumn = ({ job }: { job: JobTemp; skill: SkillTemp }) => {
  const [boxValues, setBoxValues] = useState<Array<{ yCoord: number; key: string }>>([
    {
      yCoord: 160,
      key: uidSync(uidLength),
    },
  ]);
  const pixelPerFrame = usePixelPerFrame();

  const checkCanCreate = (cursorY: number) => {
    if (
      boxValues.some(
        (boxValue) =>
          cursorY - boxValue.yCoord >= 0 &&
          cursorY - boxValue.yCoord <= CoolDownTemp * pixelPerFrame,
      )
    )
      return false;

    const tryY = removeOverlap(
      snapToStep(cursorY, pixelPerFrame),
      snapToStep(cursorY, pixelPerFrame),
      boxValues.map((boxValue) => boxValue.yCoord),
      CoolDownTemp,
      pixelPerFrame,
    );

    return (
      Math.abs(tryY - cursorY) <= CoolDownTemp * pixelPerFrame &&
      tryY >= 0 &&
      tryY <= raidDurationTemp * pixelPerFrame
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
                snapToStep(cursorY, pixelPerFrame),
                snapToStep(cursorY, pixelPerFrame),
                boxValues.map((boxValue) => boxValue.yCoord),
                CoolDownTemp,
                pixelPerFrame,
              ),
              pixelPerFrame,
            ),
            key: uidSync(uidLength),
          },
        ].toSorted((a, b) => a.yCoord - b.yCoord),
      );
  };

  return (
    <div
      className={`flex flex-shrink-0 w-${columnWidth} lg:w-${columnWidthLarge} overflow-hidden`}
      style={{ height: raidDurationTemp * pixelPerFrame }}
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

export const EditColumn = ({ job, skills }: { job: JobTemp; skills: SkillTemp[] }) => {
  const pixelPerFrame = usePixelPerFrame();

  return (
    <div className="flex px-1 border-r-[1px]" style={{ height: raidDurationTemp * pixelPerFrame }}>
      {skills.map((skill) => (
        <EditSubColumn key={skill.id} job={job} skill={skill} />
      ))}
    </div>
  );
};
