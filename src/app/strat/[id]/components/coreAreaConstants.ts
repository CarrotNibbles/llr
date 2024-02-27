import { useZoomState } from '@/lib/states';
import { getZoom } from '@/lib/utils';

export const columnWidth = 6;
export const columnWidthLarge = 10;

export type JobTemp = string;
export type SkillTemp = {
  id: string;
};

export const timeStep = 0.5;
export const usePixelPerFrame = () => {
  const [zoomState, _] = useZoomState();
  const pixelPerFrameDefault = 0.1;

  return pixelPerFrameDefault * getZoom(zoomState);
};

export const raidDurationTemp = 600 * 60;
