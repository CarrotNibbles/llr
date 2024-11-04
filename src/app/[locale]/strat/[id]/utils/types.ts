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

export type ActionMeta = {
  id: string;
  semanticKey: string;
  job: Enums<'job'> | null;
  cooldown: number;
  charges: number;
};
