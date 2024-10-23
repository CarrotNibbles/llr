import { JobIcon } from '@/components/JobIcon';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import type { Enums } from '@/lib/database.types';
import type { ActionDataType } from '@/lib/queries/server';
import { JOB_LAYOUT, getOrderedRole } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import { useState } from 'react';
import { columnWidth } from '../../utils/constants';

const HeadSubColumn = ({
  job,
  name,
  iconFilename,
}: {
  job: Enums<'job'> | null;
  name: string;
  iconFilename: string | null;
}) => {
  const src = job && iconFilename ? `/icons/action/${job}/${iconFilename}.png` : null;

  return (
    <div className={`flex flex-shrink-0 ${columnWidth} overflow-hidden justify-center items-end relative`}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="aspect-square relative w-full cursor-pointer">
            {src && (
              <Image
                src={src}
                alt={name}
                layout="fill"
                objectFit="contain"
                className="pointer-events-none select-none"
                draggable={false}
                unselectable="on"
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="pointer-events-none">{name}</TooltipContent>
      </Tooltip>
    </div>
  );
};

export const HeadColumn = ({
  playerId,
  job,
  order,
  actions,
}: {
  playerId: string;
  job: Enums<'job'> | null;
  order: number;
  actions: ActionDataType;
}) => {
  const { toast } = useToast();
  const { elevated, updatePlayerJob } = useStratSyncStore((state) => state);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const t = useTranslations('StratPage.HeadColumn');
  const tActions = useTranslations('Common.Actions');

  return (
    <div className="flex flex-col p-1 border-r-[1px] justify-center items-center space-y-1">
      <div className="flex flex-grow relative">
        <div className={`aspect-square relative ${columnWidth} flex items-center`}>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <AlertDialog>
              <PopoverTrigger className={elevated ? 'cursor-pointer' : 'cursor-not-allowed'} disabled={!elevated}>
                <span className="sr-only">Change job {job}</span>
                <JobIcon job={job} role={getOrderedRole(job, order)} className={`${columnWidth}`} />
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="space-y-3">
                  <div className="text-xs font-bold">{t('JobChange.JobChange')}</div>
                  <div className="flex space-x-2">
                    {JOB_LAYOUT.map((row, i) => (
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
                              <JobIcon job={newJob} role={getOrderedRole(newJob, order)} className="w-6 h-6" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('JobChange.ConfirmTitle')}</AlertDialogTitle>
                                <AlertDialogDescription>{t('JobChange.Warning')}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('JobChange.Cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    updatePlayerJob(playerId, newJob ?? undefined, false);
                                    setPopoverOpen(false);
                                    toast({
                                      description: t('JobChange.Complete'),
                                    });
                                  }}
                                >
                                  {t('JobChange.Confirm')}
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
            name={tActions(action.semantic_key)}
            iconFilename={action.semantic_key}
          />
        ))}

        {actions.length === 0 && (
          <>
            <div className={`flex flex-shrink-0 ${columnWidth} overflow-hidden justify-center items-end relative`}>
              <div className="aspect-square relative w-full" />
            </div>
            <div className={`flex flex-shrink-0 ${columnWidth} overflow-hidden justify-center items-end relative`}>
              <div className="aspect-square relative w-full" />
            </div>
            <div className={`flex flex-shrink-0 ${columnWidth} overflow-hidden justify-center items-end relative`}>
              <div className="aspect-square relative w-full" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
