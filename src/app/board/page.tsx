'use server';

import { type Database } from '@/lib/database.types';
import { SideBar } from './Sidebar';
import { StrategyCard as Card } from './StrategyCard';
import { MobileHeader } from './components/MobileHeader';

type StrategyCardProps = Database['public']['Tables']['strategies']['Row'] & {
  jobs: Array<Database['public']['Enums']['job']>;
};

const exampleData: StrategyCardProps = {
  author: '09STOP',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at: '2023-01-01',
  id: 'uuid(csodifjsoaihgiosjdf)',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  is_public: true,
  likes: 32767,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  modified_at: '2023-01-04',
  name: '09정지의 섭힐갈기 쇼쇼쇼',
  raid: 'raid',
  jobs: ['WAR', 'SCH', 'NIN'],
};

const Page = () => {
  return (
    <div>
      <MobileHeader />
      <div className="flex flex-row">
        <div className="hidden md:block md:w-60 lg:w-96">
          <SideBar />
        </div>
        <div className="flex-auto m-5 mt-0">
          <div className="hidden md:block mt-10 mb-5">
            <text className="text-3xl font-bold">천옥 영식 4층</text>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-7">
            <Card {...exampleData} />
            <Card {...exampleData} />
            <Card {...exampleData} />
            <Card {...exampleData} />
            <Card {...exampleData} />
            <Card {...exampleData} />
            <Card {...exampleData} />
            <Card {...exampleData} />
            <Card {...exampleData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
