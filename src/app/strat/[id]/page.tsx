'use server';

import { StratHeader } from './StratHeader';
import { CoreArea } from './components/coreArea';

export default async function StratPage() {
  return (
    <div className="flex flex-col max-h-screen h-screen">
      <StratHeader />
      <CoreArea />
    </div>
  );
}
