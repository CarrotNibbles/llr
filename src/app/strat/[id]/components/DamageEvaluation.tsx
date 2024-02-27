'use client';

import { type RaidDataType } from '@/lib/queries';
import {
  gimmickBorderColor,
  gimmickTextColor,
  usePixelPerFrame,
  type ArrayElement,
} from '@/lib/utils';
import React from 'react';
import { GimmickSubLine } from './GimmickLine';
import { DamageText } from './DamageText';

export type DamageEvaluationProps = ArrayElement<RaidDataType> & {
  resizePanelSize: number;
};

const DamageEvaluation = React.forwardRef<
  HTMLDivElement,
  DamageEvaluationProps & { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const textColor = gimmickTextColor[props.type];
  const borderColor = gimmickBorderColor[props.type];
  const borderWidth = props.type === 'Enrage' ? 'border-t-4' : 'border-t-2';
  const titleWeight = props.type === 'Enrage' ? 'font-extrabold' : 'font-bold';

  const {
    damages,
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
        className={`absolute border-0 ${borderWidth} ${borderColor} w-[98dvw] right-0 z-10`}
        style={{ top: `${prepareAt * pixelPerFrame}px` }}
      />
      <div
        className={`absolute top-[${prepareAt * pixelPerFrame}px] left-[2dvw] -z-10`}
        style={{ top: `${prepareAt * pixelPerFrame}px` }}
      >
        <div className="-z-10 space-y-2">
          <div
            className={`${textColor} ${titleWeight} text-md ${props.type === 'Enrage' && 'mt-1'}`}
          >
            {name}
          </div>
          <div
            className="inline-grid text-sm gap-x-2 gap-y-1"
            style={{ gridTemplateColumns: 'auto auto auto' }}
          >
            <DamageText damages={damages} />
          </div>
        </div>
      </div>
    </div>
  );
});

DamageEvaluation.displayName = 'DamageEvaluation';

export { DamageEvaluation };
