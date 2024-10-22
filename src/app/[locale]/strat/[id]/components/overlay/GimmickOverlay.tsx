'use client';

import type { StrategyDataType } from '@/lib/queries/server';
import { useFilterState, usePixelPerFrame } from '@/lib/states';
import type { ArrayElement } from '@/lib/utils';
import React from 'react';
import { BOTTOM_PADDING_PX, MERGE_THRESHOLD_DEFAULT, MERGE_THRESHOLD_INCREMENTAL } from '../constants';
import type { MergedGimmick } from '../utils';
import { GimmickLine } from './GimmickLine';

type GimmickOverlayProps = {
  gimmicks: Exclude<StrategyDataType['raids'], null>['gimmicks'];
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
        translationKey: gimmicksWithMerged[i].semantic_key,
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
          MERGE_THRESHOLD_DEFAULT +
            MERGE_THRESHOLD_INCREMENTAL * (gimmicksWithMerged[i].damageDisplayGimmick?.damages.length ?? 0) ||
        gimmicksWithMerged[i + 1].type === 'Enrage'
      )
        continue;

      if (
        (gimmicksWithMerged[i + 1].prepare_at - gimmicksWithMerged[i].prepare_at) * pixelPerFrame >=
        MERGE_THRESHOLD_DEFAULT
      ) {
        let j = i;
        let stopMerge = false;

        while (
          j + 1 < gimmicksWithMerged.length &&
          (gimmicksWithMerged[j + 1].prepare_at - gimmicksWithMerged[j].prepare_at) * pixelPerFrame <
            MERGE_THRESHOLD_DEFAULT +
              MERGE_THRESHOLD_INCREMENTAL * (gimmicksWithMerged[i].damageDisplayGimmick?.damages.length ?? 0) &&
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
      style={{ height: `${raidDuration * pixelPerFrame + BOTTOM_PADDING_PX}px` }}
    >
      {mergeGimmicks(gimmicks).map((value) => {
        return <GimmickLine {...value} resizePanelSize={resizePanelSize} key={`gimmick-${value.id}`} />;
      })}
    </div>
  );
});

GimmickOverlay.displayName = 'GimmickOverlay';

export { GimmickOverlay };
