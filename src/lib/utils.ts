import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useZoomState } from './states';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const getZoom = (zoomState: number) => {
  if (zoomState >= 40) {
    return 1 + 0.05 * (zoomState - 40);
  }

  return 1 / (1 + 0.05 * (40 - zoomState));
};

export type ArrayElement<T> = T extends Array<infer R> ? R : never;

export const usePixelPerFrame = () => {
  const [zoom, _] = useZoomState();
  const pixelPerFrameDefault = 0.1;

  return pixelPerFrameDefault * zoom;
};
