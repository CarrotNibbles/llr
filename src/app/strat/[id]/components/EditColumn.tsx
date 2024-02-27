import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { clamp, usePixelPerFrame } from '@/lib/utils';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useState, type MouseEventHandler } from 'react';
import { uidSync } from 'uid-ts';
import {
  columnWidth,
  columnWidthLarge,
  raidDurationTemp,
  timeStep,
  type JobTemp,
  type SkillTemp,
} from './coreAreaConstants';

const DurationTemp = 10 * 60;
const CoolDownTemp = 30 * 60;
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

const removeOverlap = (
  currentUseAt: number,
  prevUseAt: number,
  otherUseAts: number[],
  cooldown: number,
) => {
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
    newUseAt <= raidDurationTemp &&
    otherUseAts.every((otherUseAt) => !overlaps(newUseAt, otherUseAt, cooldown))
  )
    return newUseAt;

  return null;
};

const snapAndRemoveOverlap = (
  currentUseAt: number,
  prevUseAt: number,
  otherUseAts: number[],
  cooldown: number,
) => removeOverlap(snapToStep(currentUseAt), prevUseAt, otherUseAts, cooldown);

const DraggableBox = ({
  useAt,
  setUseAt,
  deleteBox,
  otherUseAts,
}: {
  useAt: number;
  setUseAt: (useAt: number) => void;
  deleteBox: () => void;
  otherUseAts: number[];
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const pixelPerFrame = usePixelPerFrame();
  const yMotionValue = useMotionValue(useAt * pixelPerFrame);

  useEffect(() => {
    yMotionValue.set(useAt * pixelPerFrame);
  }, [yMotionValue, pixelPerFrame, useAt]);

  const adjustPosition = () => {
    yMotionValue.animation?.cancel();

    const oldUseAt = useAt;
    const newUseAt = clamp(yMotionValue.get() / pixelPerFrame, 0, raidDurationTemp);
    const newUseAtCalced = snapAndRemoveOverlap(newUseAt, useAt, otherUseAts, CoolDownTemp);

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
          className={`w-${columnWidth} lg:w-${columnWidthLarge} h-0 absolute active:z-[5]`}
          style={{ y: yMotionValue }}
        >
          <div
            className={`w-${columnWidth} lg:w-${columnWidthLarge} rounded-sm overflow-hidden bg-slate-300 shadow-inner`}
            style={{
              height: `${CoolDownTemp * pixelPerFrame}px`,
              borderWidth: isLocked ? '2px' : undefined,
              borderColor: isLocked ? 'gray' : undefined,
            }}
          >
            <div
              className={`w-${columnWidth} lg:w-${columnWidthLarge} rounded-sm bg-slate-400 shadow-inner`}
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

const EditSubColumn = ({ job, skill }: { job: JobTemp; skill: SkillTemp }) => {
  const [boxValues, setBoxValues] = useState<Array<{ useAt: number; key: string }>>([
    {
      useAt: 1600,
      key: uidSync(uidLength),
    },
  ]);
  const pixelPerFrame = usePixelPerFrame();

  const createBox: MouseEventHandler<HTMLDivElement> = (evt) => {
    const cursorY = evt.clientY - evt.currentTarget.getBoundingClientRect().top;
    const cursorUseAt = cursorY / pixelPerFrame;

    if (
      boxValues.some(
        (boxValue) =>
          cursorUseAt - boxValue.useAt >= 0 && cursorUseAt - boxValue.useAt <= CoolDownTemp,
      )
    )
      return false;

    const useAtCalced = snapAndRemoveOverlap(
      cursorUseAt,
      snapToStep(cursorUseAt),
      boxValues.map((boxValue) => boxValue.useAt),
      CoolDownTemp,
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
      className={`flex flex-shrink-0 w-${columnWidth} lg:w-${columnWidthLarge} overflow-hidden`}
      style={{ height: raidDurationTemp * pixelPerFrame }}
      onClick={createBox}
    >
      {...boxValues.map((boxValue, index) => (
        <DraggableBox
          key={boxValue.key}
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
