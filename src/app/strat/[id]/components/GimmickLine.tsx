import { type RaidDataType } from '@/lib/queries';
import {
  cn,
  gimmickBorderColor,
  gimmickTextColor,
  maxDisplayCount,
  usePixelPerFrame,
  type ArrayElement,
  type MergedGimmick,
  type SuperMergedGimmick,
} from '@/lib/utils';
import React from 'react';
import { DamageText } from './DamageText';

type GimmickSubLineProps = {
  time: number;
  primaryTime: number;
  pixelPerFrame: number;
  textColor: string;
  borderColor: string;
  resizePanelSize: number;
  name: string;
  lineType: string;
};

export const GimmickSubLine = ({
  time,
  primaryTime,
  pixelPerFrame,
  textColor,
  borderColor,
  resizePanelSize,
  name,
  lineType,
}: GimmickSubLineProps) =>
  time &&
  Math.abs(time - primaryTime) * pixelPerFrame > 5 && (
    <>
      <div
        className={`absolute border-0 border-t ${borderColor}  right-0 ${lineType} z-10`}
        style={{ top: `${time * pixelPerFrame}px`, width: `${resizePanelSize}vw` }}
      />
      {Math.abs(time - primaryTime) * pixelPerFrame > 10 && (
        <div
          className={`absolute ${textColor} text-xs z-10 right-0`}
          style={{
            top: `${pixelPerFrame * time}px`,
          }}
        >
          <div className="text-xs font-thin right-0">{name}</div>
        </div>
      )}
    </>
  );

type GimmicksNamesProps = {
  mergedGimmicks: MergedGimmick[];
};

const GimmicksNames = React.forwardRef<
  HTMLDivElement,
  GimmicksNamesProps & { className?: string } & React.ComponentPropsWithRef<'div'>
>(({ className, mergedGimmicks }, ref) => {
  console.log(mergedGimmicks);
  const superMergeGimmicks = (mergedGimmicks: MergedGimmick[]) => {
    const superMergedGimmicks: SuperMergedGimmick[] = [];

    for (const mergedGimmick of mergedGimmicks) {
      if (
        superMergedGimmicks.length === 0 ||
        superMergedGimmicks[superMergedGimmicks.length - 1].name !== mergedGimmick.name ||
        superMergedGimmicks[superMergedGimmicks.length - 1].type !== mergedGimmick.type
      )
        superMergedGimmicks.push({ ...mergedGimmick, mergeCount: 1 });
      else superMergedGimmicks[superMergedGimmicks.length - 1].mergeCount++;
    }

    return superMergedGimmicks;
  };

  const superMergedGimmicks = superMergeGimmicks(mergedGimmicks);

  return (
    <div className={cn('flex text-md', className)}>
      {superMergedGimmicks.slice(0, maxDisplayCount).map((superMergedGimmick, idx, array) => (
        <div
          key={superMergedGimmick.id}
          className={cn(gimmickTextColor[superMergedGimmick.type], 'mr-1')}
        >
          {superMergedGimmick.name}
          {superMergedGimmick.mergeCount >= 2 && `x${superMergedGimmick.mergeCount}`}
          {idx !== array.length - 1 && ','}
        </div>
      ))}
      {superMergedGimmicks.length > 3 && (
        <div className={gimmickTextColor.AutoAttack}>외 {superMergedGimmicks.length - 3}</div>
      )}
    </div>
  );
});

export type GimmickLineProps = ArrayElement<RaidDataType> & {
  mergedGimmicks: MergedGimmick[];
  resizePanelSize: number;
};

const GimmickLine = React.forwardRef<
  HTMLDivElement,
  GimmickLineProps & { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const {
    damages,
    name,
    type: gimmickType,
    prepare_at: prepareAt,
    cast_at: castAt,
    resolve_at: resolveAt,
    mergedGimmicks,
    resizePanelSize,
  } = props;
  const pixelPerFrame = usePixelPerFrame();
  const textColor = gimmickTextColor[gimmickType];
  const borderColor = gimmickBorderColor[gimmickType];
  const borderWidth = gimmickType === 'Enrage' ? 'border-t-4' : 'border-t-2';
  const titleWeight = gimmickType === 'Enrage' ? 'font-extrabold' : 'font-bold';

  return (
    <div ref={ref}>
      {castAt && (
        <GimmickSubLine
          time={castAt}
          primaryTime={prepareAt}
          textColor={textColor}
          borderColor={borderColor}
          resizePanelSize={resizePanelSize}
          name={name}
          lineType="border-dashed"
          pixelPerFrame={pixelPerFrame}
        />
      )}
      {resolveAt && (
        <GimmickSubLine
          time={resolveAt}
          primaryTime={prepareAt}
          textColor={textColor}
          borderColor={borderColor}
          resizePanelSize={resizePanelSize}
          name={name}
          lineType=""
          pixelPerFrame={pixelPerFrame}
        />
      )}
      <div
        className={`absolute border-0 ${borderWidth} ${borderColor} w-[98dvw] right-0 z-10`}
        style={{ top: `${prepareAt * pixelPerFrame}px` }}
      />
      <div
        className={`absolute top-[${prepareAt * pixelPerFrame}px] left-[2dvw] -z-10`}
        style={{ top: `${prepareAt * pixelPerFrame}px` }}
      >
        <div className="-z-10 space-y-1">
          {mergedGimmicks.length !== 0 && (
            <GimmicksNames
              mergedGimmicks={mergedGimmicks}
              className={cn(titleWeight, gimmickType === 'Enrage' && 'mt-1')}
            />
          )}
          {mergedGimmicks.length === 1 && (
            <div className={className}>
              <div
                className="grid text-sm gap-x-2 gap-y-1"
                style={{ gridTemplateColumns: 'auto auto auto' }}
              >
                <DamageText damages={mergedGimmicks[0].damages} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

GimmickSubLine.displayName = 'GimmickSubLine';
GimmicksNames.displayName = 'GimmicksNames';
GimmickLine.displayName = 'DamageEvaluation';

export { GimmickLine };
