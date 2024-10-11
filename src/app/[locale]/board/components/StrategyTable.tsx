import { JobIcon } from '@/components/JobIcon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StrategiesDataType } from '@/lib/queries/server';
import { type ArrayElement, getOrderedRole } from '@/lib/utils';
import Link from 'next/link';
import type React from 'react';

type StrategyRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  strategyData: ArrayElement<StrategiesDataType>;
};

export const StrategyRow: React.FC<StrategyRowProps> = async ({ strategyData, className, ...props }) => {
  const likeCount =
    strategyData.like_counts === null ? 0 : strategyData.like_counts.anon_likes + strategyData.like_counts.user_likes;

  return (
    <TableRow className={className} {...props}>
      <TableCell className="px-2 py-1">
        <Link href={`/strat/${strategyData.id}`} className="w-full h-full block p-2">
          <div className="flex flex-grow flex-col">
            <h2 className="text-lg font-bold">{strategyData.name}</h2>
            <div className='text-sm text-neutral-400'>{strategyData.raids?.name}</div>
            <div className="flex gap-x-1 mt-2">
              {strategyData.strategy_players.map((player) => (
                <JobIcon
                  job={player.job}
                  role={getOrderedRole(player.job, player.order)}
                  key={player.id}
                  className="w-6 h-6"
                />
              ))}
            </div>
          </div>
        </Link>
      </TableCell>
      <TableCell className="p-0">
        <Link href={`/strat/${strategyData.id}`} className="w-full h-full block p-2">
          {strategyData.created_at}
        </Link>
      </TableCell>
      <TableCell className="p-0">
        <Link href={`/strat/${strategyData.id}`} className="w-full h-full block p-2">
          {strategyData.modified_at}
        </Link>
      </TableCell>
      <TableCell className="p-0">
        <Link href={`/strat/${strategyData.id}`} className="w-full h-full block p-2">
          {likeCount}
        </Link>
      </TableCell>
    </TableRow>
  );
};

type StrategyTableProps = React.HTMLAttributes<HTMLTableElement> & {
  strategiesData: StrategiesDataType;
};

export const StrategyTable: React.FC<StrategyTableProps> = async ({
  strategiesData: strategyDatas,
  className,
  ...props
}) => {
  return (
    <Table className={className} {...props}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-2/3">Strats</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Likes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {strategyDatas.map((strategyData) => (
          <StrategyRow key={strategyData.id} strategyData={strategyData} />
        ))}
      </TableBody>
    </Table>
  );
};
