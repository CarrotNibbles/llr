import { atom } from 'recoil';
import { useCheckedRecoilState } from '.';
import type { Enums } from '../database.types';

type FilterState = Map<Enums<'gimmick_type'>, boolean>;

const defaultFilter: FilterState = new Map([
  ['AutoAttack', false],
  ['Avoidable', true],
  ['Raidwide', true],
  ['Tankbuster', true],
  ['Hybrid', true],
  ['Enrage', true],
]);

const filterState = atom<FilterState>({
  key: 'filterState',
  default: defaultFilter,
});

export const useFilterState = () => useCheckedRecoilState<FilterState>(filterState, defaultFilter);
