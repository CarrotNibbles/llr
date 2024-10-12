'use server';

import { type RaidsDataType, buildRaidsDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type React from 'react';
import { Suspense } from 'react';
import { CreateButton } from './CreateButton';
import { RaidPopover } from './RaidPopover';

type BoardSubheaderProps = Readonly<React.HTMLAttributes<HTMLDivElement>>;

export const BoardSubheader: React.FC<BoardSubheaderProps> = ({ className, ...props }) => (
  <Suspense fallback={<BoardSubheaderContent raidsData={[]} className={className} {...props} />}>
    <BoardSubheaderContentWithDataFetching className={className} {...props} />
  </Suspense>
);

const BoardSubheaderContentWithDataFetching: React.FC<BoardSubheaderProps> = async ({ className, ...props }) => {
  const supabase = createClient();

  const { data: raidsData, error: raidsDataQueryError } = await buildRaidsDataQuery(supabase);

  if (raidsDataQueryError || raidsData === null) throw raidsDataQueryError;

  return <BoardSubheaderContent raidsData={raidsData} className={className} {...props} />;
};

type BoardSubheaderContentProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    raidsData: RaidsDataType;
  }
>;

const BoardSubheaderContent: React.FC<BoardSubheaderContentProps> = ({ raidsData, className, ...props }) => {
  return (
    <div className={cn('rounded-none flex min-w-full items-center', className)} {...props}>
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
