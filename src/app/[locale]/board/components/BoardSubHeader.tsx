'use server';

import { Icons } from '@/components/icons';
import type { RaidsDataType } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type React from 'react';
import { CreateButton } from './CreateButton';
import { RaidPopover } from './RaidPopover';

type BoardSubHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  raidsData: RaidsDataType;
};

export const BoardSubHeader: React.FC<BoardSubHeaderProps> = async ({ raidsData, className, ...props }, ref) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div ref={ref} className={cn('rounded-none flex h-12 min-w-full items-center', className)} {...props}>
      <ul className="flex gap-x-2">
        <li>
          <RaidPopover name="SAVAGE" raidsData={raidsData} />
        </li>
        <li>
          <RaidPopover name="ULTIMATE" raidsData={raidsData} />
        </li>
      </ul>
      <div className="flex-grow" />
      <CreateButton className="h-8" raidsData={raidsData} />
    </div>
  );
};
