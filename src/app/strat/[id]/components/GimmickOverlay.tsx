'use client';

import { type RaidDataType } from '@/lib/queries';
import { GimmickLine } from './GimmickLine';
import React from 'react';
import { mergePixelThreshold, usePixelPerFrame, weightedCompareFunction } from '@/lib/utils';

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

  const mergeGimmicks = (gimmicks: RaidDataType) => {
    const gimmicksSorted = gimmicks.toSorted((gimmick1, gimmick2) =>
      gimmick1.name.localeCompare(gimmick2.name) === 0
        ? gimmick1.prepare_at - gimmick2.prepare_at
        : gimmick1.name.localeCompare(gimmick2.name),
    );
  };

  return (
    <div
      className="absolute top-0 left-0 w-screen"
      style={{ height: `${(raidDuration + 420) * pixelPerFrame}px` }}
    >
      {gimmicks.map((value, index) => {
        return <GimmickLine {...value} resizePanelSize={resizePanelSize} key={index} />;
      })}
    </div>
  );
});

GimmickOverlay.displayName = 'GimmickOverlay';

export { GimmickOverlay };
