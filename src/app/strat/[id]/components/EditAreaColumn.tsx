import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { type BoundingBox, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { motion } from 'framer-motion';
import React, {
  type MouseEvent,
  useRef,
  useState,
  type MouseEventHandler,
  type RefObject,
} from 'react';
import { uidSync } from 'uid-ts';

const TimeStepTemp = 1;
const PixelPerSecTemp = 5;
const PixelStepTemp = TimeStepTemp * PixelPerSecTemp;
const DurationTemp = 10;
const CoolDownTemp = 30;
const RaidDurationTemp = 600;
const uidLength = 10;
const columnWidth = 5;
const columnWidthLarge = 10;
const contextMenuWidth = 16;
const contextMenuWidthLarge = 32;

const snapToStep = (currentY: number) => {
  if (currentY < 0) currentY = 0;

  return PixelStepTemp * Math.round(currentY / PixelStepTemp);
};

const overlaps = (currentYCoord: number, otherYCoord: number, cooldown: number) =>
  Math.abs(currentYCoord - otherYCoord) < cooldown * PixelPerSecTemp;

const removeOverlap = (
  currentYCoord: number,
  prevYCoord: number,
  otherYCoords: number[],
  cooldown: number,
) => {
  otherYCoords = otherYCoords.toSorted((a, b) => a - b);

  let overlapIndex = 0;
  for (; overlapIndex < otherYCoords.length; overlapIndex++)
    if (overlaps(currentYCoord, otherYCoords[overlapIndex], cooldown)) break;

  if (overlapIndex < otherYCoords.length) {
    if (prevYCoord < otherYCoords[overlapIndex])
      while (overlaps(currentYCoord, otherYCoords[overlapIndex], cooldown)) {
        currentYCoord = otherYCoords[overlapIndex] - cooldown * PixelPerSecTemp;
        overlapIndex -= 1;
      }
    else
      while (overlaps(currentYCoord, otherYCoords[overlapIndex], cooldown)) {
        currentYCoord = otherYCoords[overlapIndex] + cooldown * PixelPerSecTemp;
        overlapIndex += 1;
      }
  }

  return currentYCoord;
};

const DraggableBox = ({
  yCoord,
  setYCoord,
  deleteBox,
  otherYCoords,
  dragConstraints,
}: {
  yCoord: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  setYCoord: (yCoord: number) => void;
  deleteBox: () => void;
  otherYCoords: number[];
  dragConstraints?: false | Partial<BoundingBox> | RefObject<Element>;
}) => {
  const [isLocked, setIsLocked] = useState(false);

  const yMotionValue = useMotionValue(yCoord);

  const adjustPosition = () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const calcedYCoord = snapToStep(
      removeOverlap(snapToStep(yMotionValue.get()), yCoord, otherYCoords, CoolDownTemp),
    );
    yMotionValue.set(calcedYCoord);
    setYCoord(calcedYCoord);
  };

  const onLock = (checked: boolean) => {
    setIsLocked(checked);
  };

  const onDelete: React.MouseEventHandler<HTMLDivElement> = (evt) => {
    deleteBox();
  };

  useMotionValueEvent(yMotionValue, 'animationComplete', adjustPosition);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full h-full relative">
        <motion.div
          drag={isLocked ? false : 'y'}
          dragConstraints={dragConstraints}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 1000 }}
          _dragY={yMotionValue}
          className={`w-${columnWidth} lg:w-${columnWidthLarge} h-0 float-left absolute`}
          style={{ y: yMotionValue }}
        >
          <div
            className={`w-${columnWidth} lg:w-${columnWidthLarge} rounded-sm overflow-hidden bg-red-300`}
            style={{
              height: `${CoolDownTemp * PixelPerSecTemp}px`,
              borderWidth: isLocked ? '2px' : undefined,
              borderColor: isLocked ? 'gray' : undefined,
            }}
          >
            <div
              className={`w-${columnWidth} lg:w-${columnWidthLarge} bg-green-300`}
              style={{ height: `${DurationTemp * PixelPerSecTemp}px` }}
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

export const EditAreaColumn = ({ job }: { job: any }) => {
  const constraintRef = useRef<HTMLSpanElement>(null);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [menuOpenMouseYCoord, setMenuOpenMouseYCoord] = useState(0);

  const [boxValues, setBoxValues] = useState<Array<{ yCoord: number; key: string }>>([]);

  const checkCanCreate = () => {
    const tryY = removeOverlap(
      snapToStep(menuOpenMouseYCoord),
      snapToStep(menuOpenMouseYCoord),
      boxValues.map((boxValue) => boxValue.yCoord),
      CoolDownTemp,
    );

    return tryY >= 0 && tryY <= RaidDurationTemp * PixelPerSecTemp;
  };

  const onContextMenu = (evt: MouseEvent<HTMLSpanElement>) => {
    setMenuOpenMouseYCoord(evt.clientY - evt.currentTarget.getBoundingClientRect().top);
  };

  const onCreate: MouseEventHandler<HTMLDivElement> = (evt) => {
    if (checkCanCreate())
      setBoxValues([
        ...boxValues,
        {
          yCoord: snapToStep(
            removeOverlap(
              snapToStep(menuOpenMouseYCoord),
              snapToStep(menuOpenMouseYCoord),
              boxValues.map((boxValue) => boxValue.yCoord),
              CoolDownTemp,
            ),
          ),
          key: uidSync(uidLength),
        },
      ]);
  };

  const onDebug: MouseEventHandler<HTMLDivElement> = (evt) => {
    console.log(boxValues);
  };

  return (
    <li
      className={`flex w-${columnWidth} lg:w-${columnWidthLarge} overflow-hidden`}
      style={{ height: RaidDurationTemp * PixelPerSecTemp }}
    >
      <ContextMenu>
        <ContextMenuTrigger
          onContextMenu={onContextMenu}
          className="w-full h-full relative"
          ref={constraintRef}
        >
          {...boxValues.map((boxValue, index) => (
            <DraggableBox
              key={boxValue.key}
              yCoord={boxValue.yCoord}
              setYCoord={(yCoord) => {
                setBoxValues(
                  boxValues.map((oldValue, j) =>
                    j === index ? { yCoord, key: oldValue.key } : oldValue,
                  ),
                );
              }}
              deleteBox={() => {
                setBoxValues(boxValues.filter((_, j) => j !== index));
              }}
              otherYCoords={boxValues
                .filter((_, j) => j !== index)
                .map((boxValue) => boxValue.yCoord)}
              dragConstraints={constraintRef}
            />
          ))}
        </ContextMenuTrigger>
        <ContextMenuContent className={`w-${contextMenuWidth} lg:w-${contextMenuWidthLarge}`}>
          <ContextMenuItem inset disabled={!checkCanCreate()} onClick={onCreate}>
            Create
          </ContextMenuItem>
          <ContextMenuItem inset onClick={onDebug}>
            Debug
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </li>
  );
};
