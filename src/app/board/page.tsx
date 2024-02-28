'use server';

import { type Database } from '@/lib/database.types';
import { SideBar } from './Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { StrategiesArea } from './components/StrategiesArea';

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
            <div className="text-3xl font-bold">천옥 영식 4층</div>
          </div>
          <StrategiesArea raid={'17e466d6-01eb-45cb-88be-0c2f430aa024'} />
        </div>
      </div>
    </div>
  );
};

export default Page;
