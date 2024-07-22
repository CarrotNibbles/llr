'use server';

import type { Database, Tables } from '@/lib/database.types';
import { buildStrategyCardDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { StrategyCard } from './StrategyCard';

type StrategiesAreaProps = {
  raid: string;
};

type StrategyCardProps = Database['public']['Tables']['strategies']['Row'] & {
  strategy_players: Array<Tables<'strategy_players'>>;
};

const exampleData: StrategyCardProps = {
  author: '09STOP',
  created_at: '2023-01-01',
  id: 'uuid(csodifjsoaihgiosjdf)',
  is_public: true,
  likes: 32767,
  modified_at: '2023-01-04',
  name: '09정지의 섭힐갈기 쇼쇼쇼',
  raid: 'raid',
  strategy_players: [
    {
      id: 'uuid(09STOP)',
      strategy: 'uuid(csodifjsoaihgiosjdf)',
      job: 'SCH',
    },
    {
      id: 'uuid(09STOP)',
      strategy: 'uuid(csodifjsoaihgiosjdf)',
      job: 'WAR',
    },
    {
      id: 'uuid(09STOP)',
      strategy: 'uuid(csodifjsoaihgiosjdf)',
      job: 'NIN',
    },
  ],
};

export const StrategiesArea = async (props: StrategiesAreaProps) => {
  const supabase = createClient();
  const { data: strategies, error } = await buildStrategyCardDataQuery(supabase, props.raid);

  if (error) throw error;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-7">
      <StrategyCard {...exampleData} />
      {strategies?.map((strategy, index) => (
        <StrategyCard key={index} {...strategy} />
      ))}
    </div>
  );
};
