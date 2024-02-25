import { Separator } from '@/components/ui/separator';
import { SunIcon } from '@radix-ui/react-icons';

export const EditAreaSubColumn = (job: any) => (
  <div className="flex">
    <li className="grid justify-center items-center lg:w-10 md:w-5">
      <SunIcon /> {/* 할일 */}
    </li>
    <Separator orientation="vertical" />
  </div>
);
