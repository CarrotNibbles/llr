import { Separator } from '@/components/ui/separator';
import { LockOpen1Icon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

export const JobsBarColumn = ({ job, isOpen }: { job: any; isOpen: boolean }) => (
  <li className="inline-block">
    <div className="grid grid-rows-2">
      <div className="grid text-center items-center">나이트{/* 할일 */}</div>
      <ul className="grid grid-rows-1 grid-cols-4">
        <li className="grid justify-center items-center lg:w-10 md:w-5">
          <SunIcon /> {/* 할일 */}
        </li>
        <li className="grid justify-center items-center lg:w-10 md:w-5">
          <MoonIcon /> {/* 할일 */}
        </li>
        <li className="grid justify-center items-center lg:w-10 md:w-5">
          <LockOpen1Icon /> {/* 할일 */}
        </li>
      </ul>
      <Separator orientation="vertical" />
    </div>
  </li>
);
