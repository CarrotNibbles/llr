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
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import type { ActionDataType, StrategyDataType } from '@/lib/queries/server';
import { type ArrayElement, JOB_LAYOUT, getOrderedRole } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import { useContext, useState } from 'react';
import { columnWidth } from '../../utils/constants';
import { EntrySelectionContext } from './EntrySelectionContext';

const HeadSubColumn = ({
  playerStrategy,
  action,
}: {
  playerStrategy: ArrayElement<StrategyDataType['strategy_players']>;
  action: ArrayElement<ActionDataType>;
}) => {
  const tActions = useTranslations('Common.Actions');
  const { setActiveEntries } = useContext(EntrySelectionContext);
  const { elevated, mutateEntries } = useStratSyncStore((state) => state);

  const { job } = playerStrategy;
  const src = job && action.semantic_key ? `/icons/action/${job}/${action.semantic_key}.png` : null;

  return (
    <div className={`flex flex-shrink-0 ${columnWidth} overflow-hidden justify-center items-end relative`}>
      <Tooltip delayDuration={0}>
        <ContextMenu>
          <TooltipTrigger asChild>
            <ContextMenuTrigger asChild disabled={!elevated}>
              <div className="aspect-square relative w-full cursor-pointer">
                {src && (
                  <Image
                    src={src}
                    alt={tActions(action.semantic_key)}
                    layout="fill"
                    objectFit="contain"
                    className="pointer-events-none select-none"
                    draggable={false}
                    unselectable="on"
                  />
                )}
              </div>
            </ContextMenuTrigger>
          </TooltipTrigger>
          <TooltipContent className="pointer-events-none">{tActions(action.semantic_key)}</TooltipContent>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => {
                const deletes = playerStrategy.strategy_player_entries.filter((entry) => entry.action === action.id);

                setActiveEntries((prev) => {
                  const newActiveEntries = new Map(prev);
                  for (const entry of deletes) {
                    newActiveEntries.delete(entry.id);
                  }
                  return newActiveEntries;
                });

                mutateEntries(
                  [],
                  deletes.map((entry) => entry.id),
                  false,
                );
              }}
            >
              열 전체 삭제
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Tooltip>
    </div>
  );
};

export const HeadColumn = ({
  playerStrategy,
  actions,
}: {
  playerStrategy: ArrayElement<StrategyDataType['strategy_players']>;
  actions: ActionDataType;
}) => {
  const { toast } = useToast();
  const { elevated, updatePlayerJob } = useStratSyncStore((state) => state);
  const { job, order, id: playerId } = playerStrategy;

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
                <span className="sr-only select-none">Change job {job}</span>
                <JobIcon job={job} role={getOrderedRole(job, order)} className={`${columnWidth}`} />
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="space-y-3">
                  <div className="text-xs font-bold">{t(job ? 'JobChange.JobChange' : 'JobChange.JobAssign')}</div>
                  <div className="flex space-x-2">
                    {JOB_LAYOUT.map((row, i) => (
                      <div
                        key={`job-col-${playerId}-${
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          i
                        }`}
                        className="flex flex-col space-y-2"
                      >
                        {row.map((newJob) => {
                          const applyChange = () => {
                            updatePlayerJob(playerId, newJob ?? undefined, false);
                            setPopoverOpen(false);
                            toast({
                              description: t('JobChange.Complete'),
                            });
                          };

                          return job ? (
                            <AlertDialog key={`job-icon-change-${newJob}`}>
                              <AlertDialogTrigger
                                disabled={job === newJob}
                                className={job === newJob ? 'cursor-not-allowed' : undefined}
                              >
                                <span className="sr-only select-none">Change job to {job}</span>
                                <JobIcon job={newJob} role={getOrderedRole(newJob, order)} className="w-6 h-6" />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t('JobChange.ConfirmTitle')}</AlertDialogTitle>
                                  <AlertDialogDescription>{t('JobChange.Warning')}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t('JobChange.Cancel')}</AlertDialogCancel>
                                  <AlertDialogAction onClick={applyChange}>{t('JobChange.Confirm')}</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <button
                              type="button"
                              key={`job-icon-assign-${newJob}`}
                              disabled={job === newJob}
                              className={job === newJob ? 'cursor-not-allowed' : undefined}
                              onClick={applyChange}
                            >
                              <span className="sr-only select-none">Change job to {job}</span>
                              <JobIcon job={newJob} role={getOrderedRole(newJob, order)} className="w-6 h-6" />
                            </button>
                          );
                        })}
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
            playerStrategy={playerStrategy}
            action={action}
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
