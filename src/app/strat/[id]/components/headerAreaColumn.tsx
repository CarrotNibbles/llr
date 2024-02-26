import { TableCell, TableHead } from '@/components/ui/table';
import { SunIcon } from '@radix-ui/react-icons';

export const HeaderAreaColumn = () => (
  <li className="grid justify-center items-center lg:h-6 lg:w-10 md:w-5 md:h-3">
    <SunIcon /> {/* 할일 */}
  </li>
);
