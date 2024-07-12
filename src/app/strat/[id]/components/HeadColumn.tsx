import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Enums } from '@/lib/database.types';
import type { ActionDataType } from '@/lib/queries/server';
import { type Role, cn, getRole } from '@/lib/utils';
import Image from 'next/legacy/image';
import { ReactSVG } from 'react-svg';
import { columnWidth, columnWidthLarge } from './coreAreaConstants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const iconFilenameToURL = (job: Enums<'job'> | null, iconFilename: string | null) => {
  if (!job || !iconFilename) return null;
  return `https://jbgcbfblivbtdnhbkfab.supabase.co/storage/v1/object/public/icons/${job}/${iconFilename}.png`;
};

const HeadSubColumn = ({
  job,
  name,
  iconFilename,
}: {
  job: Enums<'job'> | null;
  name: string;
  iconFilename: string | null;
}) => {
  const src = iconFilenameToURL(job, iconFilename);

  return (
    <div
      className={`flex flex-shrink-0 ${columnWidth} ${columnWidthLarge} overflow-hidden justify-center items-end relative`}
    >
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="aspect-square relative w-full cursor-pointer">
            {src && <Image src={src} alt={name} layout="fill" objectFit="contain" />}
          </div>
        </TooltipTrigger>
        <TooltipContent className="pointer-events-none">{name}</TooltipContent>
      </Tooltip>
    </div>
  );
};

const ROLE_ICON_STYLE = {
  Tank: 'fill-blue-600 dark:fill-blue-400 border-blue-600 dark:border-blue-400',
  Healer: 'fill-green-600 dark:fill-green-400 border-green-600 dark:border-green-400',
  DPS: 'fill-red-600 dark:fill-red-400 border-red-600 dark:border-red-400',
  Others: 'fill-zinc-600 dark:fill-zinc-400 border-zinc-600 dark:border-zinc-400',
} satisfies Record<Role, string>;

export const JobIcon = ({ className, job, role }: { className?: string; job: Enums<'job'> | null; role: Role }) => {
  const src = `/icons/${job ?? 'BLANK'}.svg`;

  return (
    <>
      {job !== 'LB' && (
        <ReactSVG
          src={src}
          className={cn(className, `${ROLE_ICON_STYLE[role]} rounded-md saturate-50 border-[1.5px]`)}
        />
      )}
    </>
  );
};

export const HeadColumn = ({
  playerId,
  job,
  order,
  actions,
}: { playerId: string; job: Enums<'job'> | null; order: number; actions: ActionDataType }) => {
  const { toast } = useToast();
  const { elevated, updatePlayerJob } = useStratSyncStore((state) => state);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const jobLayout = [
    ['PLD', 'WAR', 'DRK', 'GNB'],
    ['WHM', 'SCH', 'AST', 'SGE'],
    ['MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR'],
    ['BRD', 'MCH', 'DNC'],
    ['BLM', 'SMN', 'RDM', 'PCT'],
    [null],
  ] satisfies (Enums<'job'> | null)[][];

  return (
    <div className="flex flex-col p-1 border-r-[1px] justify-center items-center space-y-1">
      <div className="flex flex-grow relative">
        <div className={`aspect-square relative ${columnWidth} ${columnWidthLarge} flex items-center`}>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <AlertDialog>
              <PopoverTrigger className={elevated ? 'cursor-pointer' : 'cursor-not-allowed'} disabled={!elevated}>
                <span className="sr-only">Change job {job}</span>
                <JobIcon job={job} role={getRole(job, order)} className={`${columnWidth} ${columnWidthLarge}`} />
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="space-y-3">
                  <div className="text-xs font-bold">직업 변경</div>
                  <div className="flex space-x-2">
                    {jobLayout.map((row, i) => (
                      <div
                        key={`job-col-${playerId}-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          i
                        }`}
                        className="flex flex-col space-y-2"
                      >
                        {row.map((newJob) => (
                          <AlertDialog key={`job-icon-${newJob}`}>
                            <AlertDialogTrigger
                              disabled={job === newJob}
                              className={job === newJob ? 'cursor-not-allowed' : undefined}
                            >
                              <span className="sr-only">Change job to {job}</span>
                              <JobIcon job={newJob} role={getRole(newJob, order)} className="w-6 h-6" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>직업 변경 확인</AlertDialogTitle>
                                <AlertDialogDescription>
                                  직업을 변경할 경우 현재 직업의 전략이 초기화됩니다. 다시 직업을 변경하더라도 이전
                                  직업의 전략은 복구되지 않습니다. 계속하시겠습니까?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    updatePlayerJob(playerId, newJob ?? undefined, false);
                                    setPopoverOpen(false);
                                    toast({ description: '직업 변경이 완료되었습니다.' });
                                  }}
                                >
                                  직업 변경
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </AlertDialog>
          </Popover>
        </div>
      </div>
      <div className="flex space-x-1">
        {actions.map((action) => (
          <HeadSubColumn
            key={`subcolumn-header-${playerId}-${action.id}`}
            job={job}
            name={action.name}
            iconFilename={action.icon_filename}
          />
        ))}
      </div>
    </div>
  );
};
