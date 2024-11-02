'use server';

import { TextSkeleton } from '@/components/TextSkeleton';
import { JobIcon } from '@/components/icons/JobIcon';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { buildStrategiesDataQuery } from '@/lib/queries/server';
import { DEFAULT_LIMIT, cn, getOrderedRole, rangeInclusive } from '@/lib/utils';
import { HeartFilledIcon } from '@radix-ui/react-icons';
import { getTranslations } from 'next-intl/server';
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

const StrategyTable = async ({ dataPromise, className, ...props }: { className?: string } & StrategyTableProps) => {
  const t = await getTranslations('ViewPage.StrategyTable');

  return (
    <div className={cn(className, 'border-[1px] border-border rounded-md shadow-sm')}>
      <Table {...props}>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="pl-2">{t('Strategy')}</div>
            </TableHead>
            <TableHead className="w-36 hidden md:table-cell">
              <div className="flex justify-center">{t('Author')}</div>
            </TableHead>
            <TableHead className="w-16 md:w-20">
              <div className="flex justify-center">{t('Patch')}</div>
            </TableHead>
            <TableHead className="w-16 md:w-20">
              <div className="flex justify-center">{t('Likes')}</div>
            </TableHead>
            <TableHead className="w-32 hidden md:table-cell">
              <div className="flex justify-center">{t('Created')}</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <Suspense fallback={<StrategyTableBodySkeleton />}>
          <StrategyTableBody dataPromise={dataPromise} />
        </Suspense>
      </Table>
    </div>
  );
};
StrategyTable.displayName = 'StrategyTable';

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

  const t = await getTranslations('ViewPage.StrategyTable');
  const tRaids = await getTranslations('Common.Raids');

  return (
    <TableBody className={className} {...props}>
      {strategiesData.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5}>
            <Alert className="text-base py-8">{t('NoStrategyFound')}</Alert>
          </TableCell>
        </TableRow>
      ) : (
        strategiesData.map((strategyData) => (
          <TableRow key={strategyData.id}>
            <TableCell className="p-0 h-0">
              <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex items-center">
                <div className="flex flex-col pl-4 pr-2 py-4">
                  <h2 className="text-base md:text-lg font-bold">{strategyData.name}</h2>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {tRaids(strategyData.raid_semantic_key)}
                  </div>
                  {strategyData.strategy_players !== null && strategyData.strategy_players.length !== 0 && (
                    <div>
                      <div className="inline-grid grid-cols-4 sm:grid-cols-8 gap-1 mt-3">
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
              <Link
                href={`/strat/${strategyData.id}`}
                className={cn(
                  'w-full h-full flex items-center justify-center',
                  strategyData.author_display_name && 'text-muted-foreground',
                )}
              >
                <div className="px-2 py-4">{strategyData.author_display_name ?? 'Deleted User'}</div>
                {/* TODO: Add i18n */}
              </Link>
            </TableCell>
            <TableCell className="p-0 w-0 h-0">
              <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex justify-center items-center">
                <div className="px-2 py-4">{`${strategyData.version}.${strategyData.subversion}`}</div>
              </Link>
            </TableCell>
            <TableCell className="p-0 w-0 h-0">
              <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex justify-center items-center">
                <div className="px-2 py-4 flex items-center">
                  <HeartFilledIcon className="w-4 h-4 mr-1" />
                  {strategyData.total_likes === null ? 0 : strategyData.total_likes}
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
StrategyTableBody.displayName = 'StrategyTableBody';

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
StrategyTableBodySkeleton.displayName = 'StrategyTableBodySkeleton';

export { StrategyTable };
