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
const PixelPerSecTemp = 4;
const PixelStepTemp = TimeStepTemp * PixelPerSecTemp;
const DurationTemp = 10;
const CoolDownTemp = 30;
const RaidDurationTemp = 600;
const uidLength = 10;

const snapToStep = (currentY: number) => {
  if (currentY < 0) currentY = 0;

  return PixelStepTemp * Math.round(currentY / PixelStepTemp);
};

const removeOverlap = (
  currentYCoord: number,
  prevYCoord: number,
  otherYCoords: number[],
  cooldown: number,
) => {
  const overlaps = (currentYCoord: number, otherYCoord: number, cooldown: number) =>
    Math.abs(currentYCoord - otherYCoord) < cooldown * PixelPerSecTemp;

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
          className={`lg:w-10 lg:h-0 float-left absolute`}
          style={{ y: yMotionValue }}
        >
          <div
            className="absolute lg:w-10 bg-red-300"
            style={{ height: `${CoolDownTemp * PixelPerSecTemp}px` }}
          />
          <div
            className="absolute lg:w-10 bg-green-300"
            style={{ height: `${DurationTemp * PixelPerSecTemp}px` }}
          />
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent className="lg:w-32">
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
  const [menuOpenMouseY, setMenuOpenMouseY] = useState(0);

  const [boxValues, setBoxValues] = useState<Array<{ yCoord: number; key: string }>>([]);
  const y = useMotionValue(30);

  const onContextMenu = (evt: MouseEvent<HTMLSpanElement>) => {
    setMenuOpenMouseY(evt.clientY - evt.currentTarget.getBoundingClientRect().top);
  };

  const onCreate: MouseEventHandler<HTMLDivElement> = (evt) => {
    setBoxValues([...boxValues, { yCoord: snapToStep(menuOpenMouseY), key: uidSync(uidLength) }]);
  };

  const onDebug: MouseEventHandler<HTMLDivElement> = (evt) => {
    console.log(boxValues);
  };

  return (
    <li
      className="flex lg:w-10 md:w-5 pb-10 overflow-hidden"
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
        <ContextMenuContent className="lg:w-32">
          <ContextMenuItem inset onClick={onCreate}>
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
