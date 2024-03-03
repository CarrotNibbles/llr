import { atom } from 'recoil';
import { type Enums } from '../database.types';
import { useCheckedRecoilState } from '.';

type FilterType = Map<Enums<'gimmick_type'>, boolean>;

const defaultFilter: FilterType = new Map([
  ['AutoAttack', false],
  ['Avoidable', true],
  ['Raidwide', true],
  ['Tankbuster', true],
  ['Hybrid', true],
  ['Enrage', true],
]);

const filterState = atom<FilterType>({
  key: 'filterState',
  default: defaultFilter,
});

export const useFilterState = () => useCheckedRecoilState<FilterType>(filterState, defaultFilter);
