import { JobIcon } from '@/components/JobIcon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StrategiesDataType } from '@/lib/queries/server';
import { type ArrayElement, cn, getOrderedRole } from '@/lib/utils';
import Link from 'next/link';
import type React from 'react';
import { ModifiedTime } from './ModifiedTime';

type StrategyRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  strategyData: ArrayElement<StrategiesDataType>;
};

export const StrategyRow: React.FC<StrategyRowProps> = async ({ strategyData, className, ...props }) => (
  <TableRow className={className} {...props}>
    <TableCell className="p-0 h-0">
      <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex items-center">
        <div className="flex flex-col p-4">
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
    <TableCell className="p-0 w-0 h-0">
      <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex items-center">
        <div className="p-4">Mario Mario</div>
      </Link>
    </TableCell>
    <TableCell className="p-0 w-0 h-0">
      <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex justify-center items-center">
        <div className="p-4">{`${strategyData.version}.${strategyData.subversion}`}</div>
      </Link>
    </TableCell>
    <TableCell className="p-0 w-0 h-0">
      <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex justify-center items-center">
        <div className="p-4">
          {strategyData.like_counts === null
            ? 0
            : strategyData.like_counts.anon_likes + strategyData.like_counts.user_likes}
        </div>
      </Link>
    </TableCell>
    <TableCell className="p-0 w-0 h-0">
      <Link href={`/strat/${strategyData.id}`} className="w-full h-full flex justify-center items-center">
        <div className="flex-grow p-4">
          <ModifiedTime createdAt={strategyData.created_at} modifiedAt={strategyData.modified_at} />
        </div>
      </Link>
    </TableCell>
  </TableRow>
);

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
          <TableHead className="w-36">Author</TableHead>
          <TableHead className="w-20">
            <div className="flex justify-center">Version</div>
          </TableHead>
          <TableHead className="w-20">
            <div className="flex justify-center">Likes</div>
          </TableHead>
          <TableHead className="w-28">
            <div className="flex justify-center">Modified</div>
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
