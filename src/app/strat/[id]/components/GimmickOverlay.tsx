'use client';

import { type StrategyDataType } from '@/lib/queries/server';
import { GimmickLine } from './GimmickLine';
import React from 'react';
import {
  type ArrayElement,
  usePixelPerFrame,
  mergePixelThresholdDefault,
  mergePixelThresholdIncremental,
  type MergedGimmick,
} from '@/lib/utils';
import { useFilterState } from '@/lib/states';

type GimmickOverlayProps = {
  gimmicks: Exclude<StrategyDataType['raids'], null>['gimmicks']; // eslint-disable-line
  raidDuration: number;
  resizePanelSize: number;
};

const GimmickOverlay = React.forwardRef<
  HTMLDivElement,
  GimmickOverlayProps & { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const { gimmicks, raidDuration, resizePanelSize } = props;
  const pixelPerFrame = usePixelPerFrame();
  const [filterState, _] = useFilterState();

  const mergeGimmicks = (gimmicks: GimmickOverlayProps['gimmicks']) => {
    const gimmicksWithMerged = gimmicks
      .filter((gimmick) => filterState.get(gimmick.type))
      .toSorted((gimmick1, gimmick2) => gimmick1.prepare_at - gimmick2.prepare_at)
      .map<
        ArrayElement<GimmickOverlayProps['gimmicks']> & {
          damageDisplayGimmick?: ArrayElement<GimmickOverlayProps['gimmicks']>;
          displayDamage: boolean;
          mergedGimmicks: MergedGimmick[];
        }
      >((gimmick) => ({
        ...gimmick,
        displayDamage: gimmick.damages.length > 0,
        mergedGimmicks: [],
      }));

    for (let i = 0; i < gimmicksWithMerged.length; i++) {
      gimmicksWithMerged[i].mergedGimmicks.push({
        id: gimmicksWithMerged[i].id,
        name: gimmicksWithMerged[i].name,
        damages: gimmicksWithMerged[i].damages,
        type: gimmicksWithMerged[i].type,
      });

      if (gimmicksWithMerged[i].damages.length > 0) {
        if (gimmicksWithMerged[i].damageDisplayGimmick) gimmicksWithMerged[i].displayDamage = false;
        else {
          gimmicksWithMerged[i].damageDisplayGimmick = gimmicksWithMerged[i];
          gimmicksWithMerged[i].displayDamage = true;
        }
      }

      if (
        i + 1 >= gimmicksWithMerged.length ||
        (gimmicksWithMerged[i + 1].prepare_at - gimmicksWithMerged[i].prepare_at) * pixelPerFrame >=
          mergePixelThresholdDefault +
            mergePixelThresholdIncremental *
              (gimmicksWithMerged[i].damageDisplayGimmick?.damages.length ?? 0) ||
        gimmicksWithMerged[i + 1].type === 'Enrage'
      )
        continue;

      if (
        (gimmicksWithMerged[i + 1].prepare_at - gimmicksWithMerged[i].prepare_at) * pixelPerFrame >=
        mergePixelThresholdDefault
      ) {
        let j = i;
        let stopMerge = false;

        while (
          j + 1 < gimmicksWithMerged.length &&
          (gimmicksWithMerged[j + 1].prepare_at - gimmicksWithMerged[j].prepare_at) *
            pixelPerFrame <
            mergePixelThresholdDefault +
              mergePixelThresholdIncremental *
                (gimmicksWithMerged[i].damageDisplayGimmick?.damages.length ?? 0) &&
          gimmicksWithMerged[i + 1].type !== 'Enrage'
        ) {
          if (
            gimmicksWithMerged[j + 1].damages.length !== 0 &&
            gimmicksWithMerged[i].damageDisplayGimmick !== undefined
          ) {
            gimmicksWithMerged[i].displayDamage = false;
            stopMerge = true;
            break;
          }

          j++;
        }

        if (stopMerge) continue;
      }

      gimmicksWithMerged[i + 1].mergedGimmicks = gimmicksWithMerged[i].mergedGimmicks;
      gimmicksWithMerged[i + 1].displayDamage = gimmicksWithMerged[i].displayDamage;
      gimmicksWithMerged[i + 1].damageDisplayGimmick = gimmicksWithMerged[i].damageDisplayGimmick;

      gimmicksWithMerged[i].mergedGimmicks = [];
      gimmicksWithMerged[i].displayDamage = false;
    }

    return gimmicksWithMerged;
  };

  return (
    <div
      className="absolute top-0 left-0 w-screen"
      style={{ height: `${(raidDuration + 420) * pixelPerFrame}px` }}
    >
      {mergeGimmicks(gimmicks).map((value, index) => {
        return <GimmickLine {...value} resizePanelSize={resizePanelSize} key={index} />;
      })}
    </div>
  );
});

GimmickOverlay.displayName = 'GimmickOverlay';

export { GimmickOverlay };
