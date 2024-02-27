'use client';

import { type Database } from '@/lib/database.types';
import { usePixelPerFrame } from '@/lib/utils';
import React from 'react';
import { GimmickSubLine } from './GimmickLine';

export type DamageEvaluationProps = Database['public']['Tables']['gimmicks']['Row'] & {
  damages: Array<Database['public']['Tables']['damages']['Row']>;
} & {
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
  const pixelPerFrame = usePixelPerFrame();
  const prepareAt = defaultPrepareAt;
  const castAt = defaultCastAt ? defaultCastAt : null;
  const resolveAt = defaultResolveAt ? defaultResolveAt : null;

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
        className={`absolute border-0 border-t-2 ${borderColor} w-[98dvw] right-0 z-10`}
        style={{ top: `${prepareAt * pixelPerFrame}px` }}
      />
      <div
        className={`absolute top-[${prepareAt * pixelPerFrame}px] left-[2dvw] -z-10`}
        style={{ top: `${prepareAt * pixelPerFrame}px` }}
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
