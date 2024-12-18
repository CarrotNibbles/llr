'use server';

import { type RaidsDataType, buildRaidsDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils/helpers';
import type React from 'react';
import { Suspense } from 'react';
import { CreateButton } from './CreateButton';
import { RaidSearchPopover } from './RaidPopover';

type BoardSubheaderProps = Readonly<React.HTMLAttributes<HTMLDivElement>>;

const BoardSubheader = async ({ className, ...props }: { className?: string } & BoardSubheaderProps) => {
  const supabase = await createClient();

  const fecthData = async () => {
    const { data: raidsData, error: raidsDataQueryError } = await buildRaidsDataQuery(supabase);

    if (raidsDataQueryError || raidsData === null) throw raidsDataQueryError;
    return { raidsData };
  };

  return (
    <Suspense fallback={<BoardSubheaderContent className={className} {...props} />}>
      <BoardSubheaderContent dataPromise={fecthData()} className={className} {...props} />
    </Suspense>
  );
};
BoardSubheader.displayName = 'BoardSubheader';

type BoardSubheaderContentData = Readonly<{ raidsData: RaidsDataType }>;
type BoardSubheaderContentProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    dataPromise?: Promise<BoardSubheaderContentData>;
  }
>;

const BOARD_SUBHEADER_CONTENT_DEFAULT_DATA: BoardSubheaderContentData = { raidsData: [] };
const BoardSubheaderContent: React.FC<BoardSubheaderContentProps> = async ({ dataPromise, className, ...props }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { raidsData } = (await dataPromise) ?? BOARD_SUBHEADER_CONTENT_DEFAULT_DATA;

  return (
    <nav className="py-3">
      <div className={cn('rounded-none flex w-full items-center space-x-1', className)} {...props}>
        {/* <ul className="hidden sm:flex gap-x-2 self-start">
          <li>

          </li>
          {NAV_RAID_CATEGORIES.map((raidCategory) => (
            <li key={raidCategory}>
              <RaidPopover
                name={raidCategory}
                raidsData={raidsData.filter((raidData) => raidData.category === raidCategory)}
              />
            </li>
          ))}
        </ul> */}
        <RaidSearchPopover className="sm:w-80 w-full" raidsData={raidsData} />
        <div className="flex-grow" />
        {user && <CreateButton raidsData={raidsData} />}
      </div>
    </nav>
  );
};
BoardSubheaderContent.displayName = 'BoardSubheaderContent';

export { BoardSubheader };
