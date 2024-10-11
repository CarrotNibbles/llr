import { JobIcon } from '@/components/JobIcon';
import { LocalizedDate } from '@/components/LocalizedDate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StrategiesDataType } from '@/lib/queries/server';
import { type ArrayElement, cn, getOrderedRole } from '@/lib/utils';
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
      <TableCell className="p-2">
        <Link href={`/strat/${strategyData.id}`} className="w-full h-full block p-2">
          <div className="flex flex-grow flex-col">
            <h2 className="text-lg font-bold">{strategyData.name}</h2>
            <div className="text-sm text-muted-foreground">{strategyData.raids?.name}</div>
            {strategyData.strategy_players.length !== 0 && (
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
            )}
          </div>
        </Link>
      </TableCell>
      <TableCell className="p-0">
        <Link href={`/strat/${strategyData.id}`} className="w-full h-full block p-2">
          <div className="flex justify-center">
            <LocalizedDate dateISOString={strategyData.created_at} />
          </div>
        </Link>
      </TableCell>
      <TableCell className="p-0">
        <Link href={`/strat/${strategyData.id}`} className="w-full h-full block p-2">
          <div className="flex justify-center">
            <LocalizedDate dateISOString={strategyData.modified_at} />
          </div>
        </Link>
      </TableCell>
      <TableCell className="p-0">
        <Link href={`/strat/${strategyData.id}`} className="w-full h-full block p-2">
          <div className="flex justify-center">{likeCount}</div>
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
    <Table className={cn(className, 'border-b')} {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>Strats</TableHead>
          <TableHead className="w-32 max-w-[5%]">
            <div className="flex justify-center">Created At</div>
          </TableHead>
          <TableHead className="w-32">
            <div className="flex justify-center">Modified At</div>
          </TableHead>
          <TableHead className="w-16">
            <div className="flex justify-center">Likes</div>
          </TableHead>
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
