'use server';

import { type RaidsDataType, buildRaidsDataQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { NAV_RAID_CATEGORIES, cn } from '@/lib/utils';
import type React from 'react';
import { Suspense } from 'react';
import { CreateButton } from './CreateButton';
import { RaidPopover } from './RaidPopover';

type BoardSubheaderProps = Readonly<React.HTMLAttributes<HTMLDivElement>>;

export const BoardSubheader: React.FC<BoardSubheaderProps> = ({ className, ...props }) => {
  const supabase = createClient();

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

type BoardSubheaderContentData = Readonly<{ raidsData: RaidsDataType }>;
type BoardSubheaderContentProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    dataPromise?: Promise<BoardSubheaderContentData>;
  }
>;

const BOARD_SUBHEADER_CONTENT_DEFAULT_DATA: BoardSubheaderContentData = { raidsData: [] };
const BoardSubheaderContent: React.FC<BoardSubheaderContentProps> = async ({ dataPromise, className, ...props }) => {
  const supabase = createClient();
  const { data: { user }} = await supabase.auth.getUser();
  const { raidsData } = (await dataPromise) ?? BOARD_SUBHEADER_CONTENT_DEFAULT_DATA;

  return (
    <nav>
      <div className={cn('rounded-none flex min-w-full items-center', className)} {...props}>
        <ul className="hidden sm:flex gap-x-2">
          {NAV_RAID_CATEGORIES.map((raidCategory) => (
            <li key={raidCategory}>
              <RaidPopover
                name={raidCategory.toUpperCase()}
                raidsData={raidsData.filter((raidData) => raidData.category === raidCategory)}
              />
            </li>
          ))}
        </ul>
        <div className="flex-grow" />
        {user && <CreateButton className="h-8" raidsData={raidsData} />}
      </div>
    </nav>
  );
};
