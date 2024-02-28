'use client';

import { type RaidDataType } from '@/lib/queries';
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
  gimmicks: RaidDataType;
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

  const mergeGimmicks = (gimmicks: RaidDataType) => {
    const gimmicksWithMerged = gimmicks
      .filter((gimmick) => filterState.get(gimmick.type))
      .toSorted((gimmick1, gimmick2) => gimmick1.prepare_at - gimmick2.prepare_at)
      .map<
        ArrayElement<RaidDataType> & {
          damageRowCount?: number;
          mergedGimmicks: MergedGimmick[];
        }
      >((gimmick) => ({ ...gimmick, mergedGimmicks: [] }));

    for (let i = 0; i < gimmicksWithMerged.length; i++) {
      gimmicksWithMerged[i].mergedGimmicks.push({
        id: gimmicksWithMerged[i].id,
        name: gimmicksWithMerged[i].name,
        damages: gimmicksWithMerged[i].damages,
        type: gimmicksWithMerged[i].type,
      });

      if (gimmicksWithMerged[i].damages.length !== 0) {
        if (gimmicksWithMerged[i].damageRowCount) gimmicksWithMerged[i].damageRowCount = 0;
        else gimmicksWithMerged[i].damageRowCount = gimmicksWithMerged[i].damages.length;
      }

      if (
        i + 1 < gimmicksWithMerged.length - 1 &&
        (gimmicksWithMerged[i + 1].prepare_at - gimmicksWithMerged[i].prepare_at) * pixelPerFrame <=
          mergePixelThresholdDefault +
            mergePixelThresholdIncremental * (gimmicksWithMerged[i].damageRowCount ?? 0) &&
        gimmicksWithMerged[i + 1].type !== 'Enrage'
      ) {
        gimmicksWithMerged[i + 1].mergedGimmicks = gimmicksWithMerged[i].mergedGimmicks;
        gimmicksWithMerged[i + 1].damageRowCount = gimmicksWithMerged[i].damageRowCount;

        gimmicksWithMerged[i].mergedGimmicks = [];
        gimmicksWithMerged[i].damageRowCount = 0;
      }
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
