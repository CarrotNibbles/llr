import { JobIcon } from '@/components/icons/JobIcon';
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
import type { Enums } from '@/lib/database.types';
import { JOB_LAYOUT, getOrderedRole } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/legacy/image';
import React, { useState } from 'react';
import { useContextSelector } from 'use-context-selector';
import { columnWidth } from '../../utils/constants';
import { EntrySelectionContext } from './EntrySelectionContext';

const HeadSubColumn = React.memo(
  ({
    playerId,
    job,
    actionMeta,
  }: {
    playerId: string;
    job: Enums<'job'> | null;
    actionMeta: { id: string; semantic_key: string };
  }) => {
    const tActions = useTranslations('Common.Actions');
    const setActiveEntries = useContextSelector(EntrySelectionContext, (context) => context.setActiveEntries);
    const elevated = useStratSyncStore((state) => state.elevated);
    const getStore = useStratSyncStore((state) => state.getStore);

    const src = job && actionMeta.semantic_key ? `/icons/action/${job}/${actionMeta.semantic_key}.png` : null;

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
                      alt={tActions(actionMeta.semantic_key)}
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
            <TooltipContent className="pointer-events-none">{tActions(actionMeta.semantic_key)}</TooltipContent>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => {
                  const playerStrategy = getStore().strategyData.strategy_players.find(
                    (player) => player.id === playerId,
                  );
                  const mutateEntries = getStore().mutateEntries;

                  if (!playerStrategy) {
                    return;
                  }

                  const deletes = playerStrategy.strategy_player_entries.filter(
                    (entry) => entry.action === actionMeta.id,
                  );

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
  },
);

export const HeadColumn = React.memo(
  ({
    playerId,
    job,
    order,
    actionsMeta,
  }: {
    playerId: string;
    job: Enums<'job'> | null;
    order: number;
    actionsMeta: { id: string; semantic_key: string }[];
  }) => {
    const { toast } = useToast();
    const elevated = useStratSyncStore((state) => state.elevated);
    const updatePlayerJob = useStratSyncStore((state) => state.updatePlayerJob);

    const [popoverOpen, setPopoverOpen] = useState(false);
    const t = useTranslations('StratPage.HeadColumn');

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
                                    <AlertDialogAction onClick={applyChange}>
                                      {t('JobChange.Confirm')}
                                    </AlertDialogAction>
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
          {actionsMeta.map((actionMeta) => (
            <HeadSubColumn
              key={`subcolumn-header-${playerId}-${actionMeta.id}`}
              job={job}
              playerId={playerId}
              actionMeta={actionMeta}
            />
          ))}

          {actionsMeta.length === 0 && (
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
  },
);
