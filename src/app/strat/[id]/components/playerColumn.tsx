import { type ForwardedRef, forwardRef } from 'react';
import { EditArea } from './editArea';
import { HeaderArea } from './headerArea';

const PlayerColumnInner = (
  { job, isOpen }: { job: number; isOpen: boolean },
  headerRef: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <li className="inline-block mx-2 px-1">
      <div>
        <HeaderArea job={job} ref={headerRef} />
        <EditArea job={job} />
      </div>
    </li>
  );
};

export const PlayerColumn = forwardRef(PlayerColumnInner);
