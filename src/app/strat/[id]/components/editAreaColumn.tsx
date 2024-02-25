import { Separator } from '@/components/ui/separator';
import { LockOpen1Icon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { EditAreaSubColumn } from './editAreaSubColumn';

export const EditAreaColumn = ({ job, isOpen }: { job: number; isOpen: boolean }) => (
  <li className="inline-block">
    <ul className="h-[1600px] grid grid-rows-1 grid-cols-4">
      <EditAreaSubColumn key={0} job={job} />
      <EditAreaSubColumn key={1} job={job} />
      <EditAreaSubColumn key={2} job={job} />
    </ul>
  </li>
);
