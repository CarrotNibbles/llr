import { atom } from 'jotai';
import type { Enums } from '../database.types';

export const filterAtom = atom({
  AutoAttack: false,
  Avoidable: true,
  Raidwide: true,
  Tankbuster: true,
  Hybrid: true,
  Enrage: true,
} as Record<Enums<'gimmick_type'>, boolean>);
