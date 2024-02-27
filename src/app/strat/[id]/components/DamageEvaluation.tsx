import { type Database } from '@/lib/database.types';
import { useZoomState } from '@/lib/states';
import React, { useEffect } from 'react';
import { pixelPerSecTemp } from './coreAreaConstants';
import { type RaidDataType } from '@/lib/queries';
import { type ArrayElement } from '@/lib/utils';

export type DamageEvaluationProps = ArrayElement<RaidDataType> & {
  resizePanelSize: number;
};

const TankbusterTextColor = 'text-blue-600';
const RaidwideTextColor = 'text-red-600';
const CombinedTextColor = 'text-purple-600';
const TankbusterBorderColor = 'border-blue-600';
const RaidwideBorderColor = 'border-red-600';
const CombinedBorderColor = 'border-purple-600';

const DamageEvaluation = React.forwardRef<
  HTMLDivElement,
  DamageEvaluationProps & { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const { damages } = props;
  const textColor = damages.some((d) => d.target === 'Tankbuster')
    ? damages.some((d) => d.target === 'Raidwide')
      ? CombinedTextColor
      : TankbusterTextColor
    : RaidwideTextColor;
  const borderColor = damages.some((d) => d.target === 'Tankbuster')
    ? damages.some((d) => d.target === 'Raidwide')
      ? CombinedBorderColor
      : TankbusterBorderColor
    : RaidwideBorderColor;
  const {
    name,
    prepare_at: defaultPrepareAt,
    cast_at: defaultCastAt,
    resolve_at: defaultResolveAt,
    resizePanelSize,
  } = props;
  const prepareAt = (defaultPrepareAt / 60) * pixelPerSecTemp;
  const castAt = defaultCastAt ? (defaultCastAt / 60) * pixelPerSecTemp : null;
  const resolveAt = defaultResolveAt ? (defaultResolveAt / 60) * pixelPerSecTemp : null;

  const [zoom, _] = useZoomState();
  useEffect(() => {
    console.log(zoom * prepareAt);
  }, [zoom, prepareAt]);

  return (
    <div ref={ref}>
      {castAt && Math.abs(castAt - prepareAt) > 5 / zoom && (
        <>
          <div
            className={`absolute border-0 border-t ${borderColor}  right-0 border-dashed z-10`}
            style={{ top: `${zoom * castAt}px`, width: `${resizePanelSize}vw` }}
          />
          {Math.abs(castAt - prepareAt) > 10 / zoom && (
            <div
              className={`absolute ${textColor} text-xs z-10 right-0`}
              style={{
                top: `${zoom * castAt}px`,
              }}
            >
              <text className="text-xs font-thin right-0">{name}</text>
            </div>
          )}
        </>
      )}
      {resolveAt && Math.abs(resolveAt - prepareAt) > 5 / zoom && (
        <>
          <div
            className={`absolute border-0 border-t ${borderColor} right-0 z-10`}
            style={{ top: `${zoom * resolveAt}px`, width: `${resizePanelSize}vw` }}
          />
          {Math.abs(resolveAt - prepareAt) > 10 / zoom && (
            <div
              className={`absolute ${textColor} text-xs z-10 right-0`}
              style={{
                top: `${zoom * resolveAt}px`,
              }}
            >
              <text className="text-xs font-thin right-0">{name}</text>
            </div>
          )}
        </>
      )}
      <div
        className={`absolute border-0 border-t-2 ${borderColor} w-[98dvw] right-0 z-10`}
        style={{ top: `${zoom * prepareAt}px` }}
      />
      <div
        className={`absolute top-[${zoom * prepareAt}px] left-[2dvw] -z-10`}
        style={{ top: `${zoom * prepareAt}px` }}
      >
        <div className="-z-10 space-y-2">
          <div className={`${textColor} font-bold text-md`}>{name}</div>
          <div
            className="inline-grid text-sm gap-x-2 gap-y-1"
            style={{ gridTemplateColumns: 'auto auto auto' }}
          >
            <div className="space-x-1 pr-6">
              <span className="font-bold">T1+T2</span>
            </div>
            <span className="tabular-nums font-bold">100000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">180000</span>

            {/* <div className="space-x-1 pr-6">
              <span className="font-bold">T1</span>
              <span className="text-muted-foreground">T2</span>
            </div>
            <span className="tabular-nums font-bold">100000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">180000</span>

            <div className="space-x-1 pr-6">
              <span className="text-muted-foreground">T1+T2</span>
              <span className="font-bold">T1</span>
              <span className="text-muted-foreground">T2</span>
            </div>
            <span className="tabular-nums font-bold">240000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">480000</span>

            <div className="space-x-1 pr-6">
              <span className="font-bold">쉐어</span>
            </div>
            <span className="tabular-nums font-bold">40000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">70000</span>

            <div className="space-x-1 pr-6">
              <span className="font-bold">전체</span>
            </div>
            <span className="tabular-nums font-bold">35000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">60000</span>

            <div className="space-x-1 pr-6">
              <span className="font-bold">4+4</span>
              <span className="text-muted-foreground">3+5</span>
            </div>
            <span className="tabular-nums font-bold">21000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">40000</span> */}
          </div>
        </div>
      </div>
    </div>
  );
});

DamageEvaluation.displayName = 'DamageEvaluation';

export { DamageEvaluation };
