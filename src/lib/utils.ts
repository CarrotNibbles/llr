import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useZoomState } from './states';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const getZoom = (zoomState: number) => {
  return [0.3, 0.5, 2 / 3, 0.8, 0.9, 1, 1.1, 1.2, 4 / 3, 1.5, 1.7, 2, 2.4, 3, 4, 5][zoomState];
};

export type ArrayElement<T> = T extends Array<infer R> ? R : never;

export const usePixelPerFrame = () => {
  const [zoom, _] = useZoomState();
  const pixelPerFrameDefault = 0.2;

  return pixelPerFrameDefault * zoom;
};

const notNullOrUndefined = <ValueType>(value: ValueType | undefined): value is ValueType =>
  value !== null && value !== undefined;
const myMin = (...values: Array<number | undefined>) =>
  Math.min(...values.filter(notNullOrUndefined));
const myMax = (...values: Array<number | undefined>) =>
  Math.max(...values.filter(notNullOrUndefined));
export const clamp = (num: number, min?: number, max?: number) => myMax(myMin(num, max), min);
