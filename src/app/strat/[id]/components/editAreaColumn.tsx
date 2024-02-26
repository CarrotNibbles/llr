import {
  ContextMenu,
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

const TimeStepTemp = 1;
const PixelPerSecTemp = 4;
const PixelStepTemp = TimeStepTemp * PixelPerSecTemp;
const DurationTemp = 10;
const CoolDownTemp = 120;
const RaidDurationTemp = 600;

const snapToStep = (num: number) => {
  if (num < 0) num = 0;

  return PixelStepTemp * Math.round(num / PixelStepTemp);
};

const DraggableBox = ({
  yValue,
  setYValue,
  dragConstraints,
}: {
  yValue: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  setYValue: (yValue: number) => void;
  dragConstraints?: false | Partial<BoundingBox> | RefObject<Element>;
}) => {
  const y = useMotionValue(yValue);
  useMotionValueEvent(y, 'animationComplete', () => {
    const snappedValue = snapToStep(y.get());
    y.set(snappedValue);
    setYValue(snappedValue);
  });

  return (
    <motion.div
      drag="y"
      dragConstraints={dragConstraints}
      dragMomentum={false}
      onDragEnd={() => null}
      _dragY={y}
      className={`lg:w-10 lg:h-0 float-left absolute`}
      style={{ y }}
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
  );
};

export const EditAreaColumn = ({ job }: { job: any }) => {
  const constraintRef = useRef<HTMLSpanElement>(null);
  const [menuOpenMouseY, setMenuOpenMouseY] = useState(0);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [yValues, setYValues] = useState<number[]>([]);
  const y = useMotionValue(30);

  const onContextMenu = (evt: MouseEvent<HTMLSpanElement>) => {
    setMenuOpenMouseY(evt.clientY - evt.currentTarget.getBoundingClientRect().top);
  };

  const onCreate: MouseEventHandler<HTMLDivElement> = (evt) => {
    setYValues([...yValues, snapToStep(menuOpenMouseY)]);
  };

  const onDebug: MouseEventHandler<HTMLDivElement> = (evt) => {
    console.log(yValues);
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
          {...yValues.map((yValue, index) => (
            <DraggableBox
              key={index}
              yValue={yValue}
              setYValue={(newValue) => {
                setYValues(yValues.map((oldValue, j) => (j === index ? newValue : oldValue)));
              }}
              dragConstraints={constraintRef}
            />
          ))}
        </ContextMenuTrigger>
        <ContextMenuContent className="lg:w-32">
          <ContextMenuItem inset onClick={onCreate}>
            Create
          </ContextMenuItem>
          <ContextMenuItem inset>Lock</ContextMenuItem>
          <ContextMenuItem inset>Delete</ContextMenuItem>
          <ContextMenuItem inset onClick={onDebug}>
            Debug
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </li>
  );
};
