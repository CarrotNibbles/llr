import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Enums, Tables } from './database.types';
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
const filteredMin = (...values: Array<number | undefined>) => Math.min(...values.filter(notNullOrUndefined));
const filteredMax = (...values: Array<number | undefined>) => Math.max(...values.filter(notNullOrUndefined));
export const clamp = (num: number, min?: number, max?: number) => filteredMax(filteredMin(num, max), min);

export const GIMMICK_TEXT_STYLE = {
  AutoAttack: 'text-zinc-500',
  Raidwide: 'text-blue-600 dark:text-blue-400',
  Tankbuster: 'text-rose-600 dark:text-rose-400',
  Hybrid: 'text-violet-600 dark:text-violet-400',
  Avoidable: 'text-green-600 dark:text-green-400',
  Enrage: 'text-zinc-900 dark:text-zinc-100',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const GIMMICK_BORDER_STYLE = {
  AutoAttack: 'border-zinc-500',
  Raidwide: 'border-blue-600 dark:border-blue-400',
  Tankbuster: 'border-rose-600 dark:border-rose-400',
  Hybrid: 'border-violet-600 dark:border-violet-400',
  Avoidable: 'border-green-600 dark:border-green-400',
  Enrage: 'border-zinc-900 dark:border-zinc-100',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const GIMMICK_BACKGROUND_STYLE = {
  AutoAttack: 'bg-zinc-500',
  Raidwide: 'bg-blue-600 dark:bg-blue-400',
  Tankbuster: 'bg-rose-600 dark:bg-rose-400',
  Hybrid: 'bg-violet-600 dark:bg-violet-400',
  Avoidable: 'bg-green-600 dark:bg-green-400',
  Enrage: 'bg-zinc-900 dark:bg-zinc-100',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const GIMMICK_TYPE_NAME = {
  AutoAttack: '자동 공격',
  Raidwide: '광역 공격',
  Tankbuster: '탱커버스터',
  Hybrid: '기타',
  Avoidable: '회피 가능',
  Enrage: '전멸기',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const TIME_STEP = 30;
export const MERGE_THRESHOLD_DEFAULT = 28;
export const MERGE_THRESHOLD_INCREMENTAL = 20;

export type MergedGimmick = {
  id: string;
  name: string;
  damages: Array<
    Tables<'damages'> & {
      strategy_damage_options: Array<Tables<'strategy_damage_options'>>;
    }
  >;
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

export const MAX_DISPLAY_COUNT = 3;

export type Role = 'Tank' | 'Healer' | 'DPS' | 'Others';

export const getRawRole = (job: Enums<'job'>): Role => {
  switch (job) {
    case 'PLD':
    case 'WAR':
    case 'DRK':
    case 'GNB':
      return 'Tank';
    case 'WHM':
    case 'SCH':
    case 'AST':
    case 'SGE':
      return 'Healer';
    default:
      return 'DPS';
  }
};

export const getRole = (job: Enums<'job'> | null, order: number): Role => {
  if (job === null || job === 'LB') {
    if (1 <= order && order <= 2) return 'Tank';
    if (3 <= order && order <= 4) return 'Healer';
    if (5 <= order && order <= 8) return 'DPS';
    return 'Others';
  }

  return getRawRole(job);
};
