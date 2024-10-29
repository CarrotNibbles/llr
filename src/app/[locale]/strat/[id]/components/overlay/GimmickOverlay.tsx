'use client';

import type { StrategyDataType } from '@/lib/queries/server';
import { useFilterState, usePixelPerFrame } from '@/lib/states';
import { type ArrayElement, cn } from '@/lib/utils';
import React from 'react';
import { COUNTDOWN_DURATION, MERGE_THRESHOLD_DEFAULT, MERGE_THRESHOLD_INCREMENTAL } from '../../utils/constants';
import { getAreaHeight, timeToY } from '../../utils/helpers';
import type { MergedGimmick } from '../../utils/types';
import { GimmickLine } from './GimmickLine';

type GridOverlayProps = {
  raidDuration: number;
  minorInterval: number;
  majorInterval: number;
  resizePanelSize: number;
};

const GridOverlay = ({ className, ...props }: { className?: string } & GridOverlayProps) => {
  const { raidDuration, resizePanelSize, minorInterval, majorInterval } = props;
  const pixelPerFrame = usePixelPerFrame();

  const getTimeRepresentation = (t: number) => {
    const seconds = Math.floor(Math.abs(t) / 60);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${t < 0 ? '-' : ''}${minutes}'${remainingSeconds.toString().padStart(2, '0')}"`;
  };

  const MinorLine = ({ t }: { t: number }) => (
    <>
      <div
        className="absolute border-0 border-t-1 border-zinc-100 dark:border-zinc-800 right-0 pointer-events-none"
        style={{ top: `${timeToY(t, pixelPerFrame)}px`, width: `${resizePanelSize}vw` }}
      />
      <div
        className="flex absolute pointer-events-none h-8 items-center justify-end text-xs text-zinc-100 dark:text-zinc-800 pr-1 tabular-nums -z-10"
        style={{ top: `calc(${timeToY(t, pixelPerFrame)}px - 1rem)`, right: `${resizePanelSize}vw` }}
      >
        {getTimeRepresentation(t)}
      </div>
    </>
  );

  const MajorLine = ({ t }: { t: number }) => (
    <>
      <div
        className="absolute border-0 border-t-2 border-foreground right-0 pointer-events-none z-10"
        style={{ top: `${timeToY(t, pixelPerFrame)}px`, width: `${resizePanelSize}vw` }}
      />
      <div
        className="flex absolute pointer-events-none h-8 items-center justify-end text-xs font-extrabold text-foreground pr-1 tabular-nums -z-10"
        style={{ top: `calc(${timeToY(t, pixelPerFrame)}px - 1rem)`, right: `${resizePanelSize}vw` }}
      >
        {getTimeRepresentation(t)}
      </div>
    </>
  );

  const majorTimes = new Set<number>();
  for (let t = 0; t < raidDuration; t += majorInterval) {
    majorTimes.add(t);
  }
  for (let t = 0; t > -COUNTDOWN_DURATION; t -= majorInterval) {
    majorTimes.add(t);
  }

  const minorTimes = new Set<number>();
  for (let t = 0; t < raidDuration; t += minorInterval) {
    minorTimes.add(t);
  }
  for (let t = 0; t > -COUNTDOWN_DURATION; t -= minorInterval) {
    minorTimes.add(t);
  }

  return (
    <>
      {Array.from(majorTimes).map((t) => (
        <MajorLine key={`grid-majorline-${t}`} t={t} />
      ))}
      {Array.from(minorTimes.difference(majorTimes)).map((t) => (
        <MinorLine key={`grid-minorline-${t}`} t={t} />
      ))}
    </>
  );
};

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
  const areaHeight = getAreaHeight(pixelPerFrame, raidDuration);

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
    <div ref={ref} className={cn(className, 'absolute top-0 left-0 w-screen')} style={{ height: areaHeight }}>
      {mergeGimmicks(gimmicks).map((value) => (
        <GimmickLine {...value} resizePanelSize={resizePanelSize} key={`gimmick-${value.id}`} />
      ))}
      <GridOverlay
        raidDuration={raidDuration}
        resizePanelSize={resizePanelSize}
        majorInterval={60 * 60}
        minorInterval={5 * 60}
      />
    </div>
  );
});

GimmickOverlay.displayName = 'GimmickOverlay';

export { GimmickOverlay };
