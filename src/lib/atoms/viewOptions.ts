import { atom } from 'jotai';
import type { Enums } from '../database.types';

export const viewOptionsAtom = atom({
  gimmickTypeFilter: {
    AutoAttack: false,
    Avoidable: true,
    Raidwide: true,
    Tankbuster: true,
    Hybrid: true,
    Enrage: true,
  },
  showVerboseTimeline: false,
} as {
  gimmickTypeFilter: Record<Enums<'gimmick_type'>, boolean>;
  showVerboseTimeline: boolean;
});
