import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Enums } from '../database.types';
import type { DiversedRole, Role } from './types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const notNullOrUndefined = <ValueType>(value: ValueType | undefined): value is ValueType =>
  value !== null && value !== undefined;
const filteredMin = (...values: Array<number | undefined>) => Math.min(...values.filter(notNullOrUndefined));
const filteredMax = (...values: Array<number | undefined>) => Math.max(...values.filter(notNullOrUndefined));
export const clamp = (num: number, min?: number, max?: number) => filteredMax(filteredMin(num, max), min);

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
