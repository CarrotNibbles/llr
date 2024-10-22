import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Enums } from './database.types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type NonEmptyArray<T> = [T, ...T[]];
export type ArrayElement<T> = T extends Array<infer R> ? R : never;

const notNullOrUndefined = <ValueType>(value: ValueType | undefined): value is ValueType =>
  value !== null && value !== undefined;
const filteredMin = (...values: Array<number | undefined>) => Math.min(...values.filter(notNullOrUndefined));
const filteredMax = (...values: Array<number | undefined>) => Math.max(...values.filter(notNullOrUndefined));
export const clamp = (num: number, min?: number, max?: number) => filteredMax(filteredMin(num, max), min);

export const ALL_PATCHES = [
  { version: 2, subversion: 0 },
  { version: 2, subversion: 1 },
  { version: 2, subversion: 2 },
  { version: 2, subversion: 3 },
  { version: 2, subversion: 4 },
  { version: 2, subversion: 5 },
  { version: 3, subversion: 0 },
  { version: 3, subversion: 1 },
  { version: 3, subversion: 2 },
  { version: 3, subversion: 3 },
  { version: 3, subversion: 4 },
  { version: 3, subversion: 5 },
  { version: 4, subversion: 0 },
  { version: 4, subversion: 1 },
  { version: 4, subversion: 2 },
  { version: 4, subversion: 3 },
  { version: 4, subversion: 4 },
  { version: 4, subversion: 5 },
  { version: 5, subversion: 0 },
  { version: 5, subversion: 1 },
  { version: 5, subversion: 2 },
  { version: 5, subversion: 3 },
  { version: 5, subversion: 4 },
  { version: 5, subversion: 5 },
  { version: 6, subversion: 0 },
  { version: 6, subversion: 1 },
  { version: 6, subversion: 2 },
  { version: 6, subversion: 3 },
  { version: 6, subversion: 4 },
  { version: 6, subversion: 5 },
  { version: 7, subversion: 0 },
];

export type Role = 'Tank' | 'Healer' | 'DPS' | 'Others';
export type DiversedRole = 'Tank' | 'Healer' | 'Ranged' | 'Melee' | 'Caster';

export const getRole = (job: Enums<'job'>): Role => {
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
    case 'LB':
      return 'Others';
    default:
      return 'DPS';
  }
};

export const getDiversedRole = (job: Exclude<Enums<'job'>, 'LB'>): DiversedRole => {
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
    case 'BRD':
    case 'MCH':
    case 'DNC':
      return 'Ranged';
    case 'BLM':
    case 'RDM':
    case 'SMN':
    case 'PCT':
    case 'BLU':
      return 'Caster';
    default:
      return 'Melee';
  }
};

export const getOrderedRole = (job: Enums<'job'> | null, order: number): Role => {
  if (job === null || job === 'LB') {
    if (1 <= order && order <= 2) return 'Tank';
    if (3 <= order && order <= 4) return 'Healer';
    if (5 <= order && order <= 8) return 'DPS';
    return 'Others';
  }

  return getRole(job);
};
