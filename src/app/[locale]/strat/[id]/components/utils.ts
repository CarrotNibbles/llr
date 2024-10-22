import type { Enums, Tables } from '@/lib/database.types';

export type MergedGimmick = {
  id: string;
  translationKey: string;
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
