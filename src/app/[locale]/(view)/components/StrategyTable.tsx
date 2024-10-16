'use server';

import { JobIcon } from '@/components/JobIcon';
import { TextSkeleton } from '@/components/TextSkeleton';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { buildStrategiesDataQuery } from '@/lib/queries/server';
import { DEFAULT_LIMIT, cn, getOrderedRole, rangeInclusive } from '@/lib/utils';
import Link from 'next/link';
import type React from 'react';
import { Suspense } from 'react';
import { ModifiedTime } from './ModifiedTime';

type StrategiesTableData = Awaited<ReturnType<typeof buildStrategiesDataQuery>>;
type StrategyTableProps = Readonly<
  React.HTMLAttributes<HTMLTableElement> & {
    dataPromise: Promise<StrategiesTableData>;
  }
>;

export const StrategyTable: React.FC<StrategyTableProps> = ({ dataPromise, className, ...props }) => {
  return (
    <Table className={cn(className, 'border-b')} {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>Strats</TableHead>
          <TableHead className="w-36 hidden md:table-cell">Author</TableHead>
          <TableHead className="w-16 md:w-20">
            <div className="flex justify-center">Version</div>
          </TableHead>
          <TableHead className="w-16 md:w-20">
            <div className="flex justify-center">Likes</div>
          </TableHead>
          <TableHead className="w-32 hidden md:table-cell">
            <div className="flex justify-center">Modified</div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <Suspense fallback={<StrategyTableBodySkeleton />}>
        <StrategyTableBody dataPromise={dataPromise} />
      </Suspense>
    </Table>
  );
};

type StrategyTableBodyProps = Readonly<
  React.HTMLAttributes<HTMLTableSectionElement> & {
    dataPromise?: Promise<StrategiesTableData>;
  }
>;

const STRATEGY_TABLE_DEFAULT_DATA = {
  data: [],
  error: null,
};
const StrategyTableBody: React.FC<StrategyTableBodyProps> = async ({ dataPromise, className, ...props }) => {
  const { data: strategiesData, error } = (await dataPromise) ?? STRATEGY_TABLE_DEFAULT_DATA;
  if (strategiesData === null || error) throw error;

  return (
    <TableBody className={className} {...props}>
      {strategiesData.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5}>
            <Alert className="text-base py-8">No Strategy Found</Alert>
          </TableCell>
        </TableRow>
      ) : (
        strategiesData.map((strategyData) => (
          <TableRow key={strategyData.id}>
            <TableCell className="p-0 h-0">
              <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex items-center">
                <div className="flex flex-col pl-4 py-4 pr-2">
                  <h2 className="text-base md:text-lg font-bold">{strategyData.name}</h2>
                  <div className="text-xs md:text-sm text-muted-foreground">{strategyData.raids?.name}</div>
                  {strategyData.strategy_players.length !== 0 && (
                    <div>
                      <div className="inline-grid grid-cols-4 sm:grid-cols-8 gap-1 mt-2">
                        {strategyData.strategy_players.map((player) => (
                          <JobIcon
                            job={player.job}
                            role={getOrderedRole(player.job, player.order)}
                            key={player.id}
                            className="aspect-square w-6 h-6"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </TableCell>
            <TableCell className="p-0 w-0 h-0 hidden md:table-cell">
              <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex items-center">
                <div className="px-2 py-4">Mario Mario</div>
              </Link>
            </TableCell>
            <TableCell className="p-0 w-0 h-0">
              <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex justify-center items-center">
                <div className="px-2 py-4">{`${strategyData.version}.${strategyData.subversion}`}</div>
              </Link>
            </TableCell>
            <TableCell className="p-0 w-0 h-0">
              <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex justify-center items-center">
                <div className="px-2 py-4">
                  {strategyData.like_counts === null
                    ? 0
                    : strategyData.like_counts.anon_likes + strategyData.like_counts.user_likes}
                </div>
              </Link>
            </TableCell>
            <TableCell className="p-0 w-0 h-0  hidden md:table-cell">
              <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex justify-center items-center">
                <div className="px-2 py-4 flex justify-center items-center">
                  <ModifiedTime createdAt={strategyData.created_at} modifiedAt={strategyData.modified_at} />
                </div>
              </Link>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  );
};

type StrategyTableBodySkeletonProps = Readonly<React.HTMLAttributes<HTMLTableSectionElement> & {}>;

const StrategyTableBodySkeleton: React.FC<StrategyTableBodySkeletonProps> = ({ className, ...props }) => (
  <TableBody className={className} {...props}>
    {rangeInclusive(1, DEFAULT_LIMIT).map((index) => (
      <TableRow key={index}>
        <TableCell className="p-0 h-0">
          <div className="w-full h-full flex items-center">
            <div className="w-full flex flex-col pl-4 py-4 pr-2">
              <TextSkeleton textSize="base" mdTextSize="lg" className="w-1/2" />
              <TextSkeleton textSize="xs" mdTextSize="sm" className="w-1/3" />
              <div>
                <div className="inline-grid grid-cols-4 sm:grid-cols-8 gap-1 mt-2">
                  {rangeInclusive(1, 8).map((index) => (
                    <Skeleton key={index} className="aspect-square w-6 h-6" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell className="p-0 w-0 h-0 hidden md:table-cell">
          <div className="w-full h-full flex items-center">
            {/* <TextSkeleton textSize="sm" className="w-1/2" /> */}
          </div>
        </TableCell>
        <TableCell className="p-0 w-0 h-0">
          <div className="w-full h-full flex justify-center items-center">
            {/* <TextSkeleton textSize="sm" className="w-1/2" /> */}
          </div>
        </TableCell>
        <TableCell className="p-0 w-0 h-0">
          <div className="w-full h-full flex justify-center items-center">
            {/* <TextSkeleton textSize="sm" className="w-1/2" /> */}
          </div>
        </TableCell>
        <TableCell className="p-0 w-0 h-0  hidden md:table-cell">
          <div className="w-full h-full flex justify-center items-center">
            {/* <TextSkeleton textSize="sm" className="w-1/2" /> */}
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);
