import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Tables, type Enums } from './database.types';
import { type RaidDataType } from './queries';
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

/* eslint-disable */
export const gimmickTextColor = {
  AutoAttack: 'text-slate-400',
  Raidwide: 'text-blue-600',
  Tankbuster: 'text-red-600',
  Hybrid: 'text-purple-600',
  Avoidable: 'text-green-600',
  Enrage: 'text-slate-900',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const gimmickBorderColor = {
  AutoAttack: 'border-slate-400',
  Raidwide: 'border-blue-600',
  Tankbuster: 'border-red-600',
  Hybrid: 'border-purple-600',
  Avoidable: 'border-green-600',
  Enrage: 'border-slate-900',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const gimmickBackgroundColor = {
  AutoAttack: 'bg-slate-400',
  Raidwide: 'bg-blue-600',
  Tankbuster: 'bg-red-600',
  Hybrid: 'bg-purple-600',
  Avoidable: 'bg-green-600',
  Enrage: 'bg-slate-900',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const gimmickTypeName = {
  AutoAttack: '자동 공격',
  Raidwide: '광역 공격',
  Tankbuster: '탱커버스터',
  Hybrid: '기타',
  Avoidable: '회피 가능',
  Enrage: '전멸기',
} satisfies Record<Enums<'gimmick_type'>, string>;
/* eslint-enable */

export const timeStep = 30;
export const mergePixelThresholdDefault = 28;
export const mergePixelThresholdIncremental = 20;

export type MergedGimmick = {
  id: string;
  name: string;
  damages: Array<Tables<'damages'>>;
  type: Enums<'gimmick_type'>;
};

export type SuperMergedGimmick = MergedGimmick & {
  mergeCount: number;
};

export const weightedCompareFunction =
  <ValueType>(
    compareFn1: (item1: ValueType, item2: ValueType) => number,
    compareFn2: (item1: ValueType, item2: ValueType) => number,
  ) =>
  (item1: ValueType, item2: ValueType): number =>
    compareFn1(item1, item2) === 0 ? compareFn2(item1, item2) : compareFn1(item1, item2);

export const maxDisplayCount = 3;
