'use client';

import { useStaticDataStore } from '@/components/providers/StaticDataStoreProvider';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useAutoScrollState, usePixelPerFrame, useZoomState } from '@/lib/states';
import { type DragControls, useAnimationFrame } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

import { useToast } from '@/components/ui/use-toast';
import type { Tables } from '@/lib/database.types';
import type { ActionDataType } from '@/lib/queries/server';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { getAreaHeight } from '../utils/helpers';
import { EditColumn, EntrySelectionContext, HeadColumn } from './column';
import { GimmickOverlay } from './overlay';

export const StratMain = () => {
  const { toast } = useToast();
  const t = useTranslations('StratPage.StratMain');
  const [zoom, _] = useZoomState();
  const [resizePanelSize, setResizePanelSize] = useState(20);
  const pixelPerFrame = usePixelPerFrame();

  const actionData = useStaticDataStore((state) => state.actionData);
  const elevated = useStratSyncStore((state) => state.elevated);
  const strategyData = useStratSyncStore((state) => state.strategyData);
  const undoEntryMutation = useStratSyncStore((state) => state.undoEntryMutation);
  const redoEntryMutation = useStratSyncStore((state) => state.redoEntryMutation);

  const [activeEntries, setActiveEntries] = useState<Map<string, DragControls>>(new Map());

  const overlayRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useAutoScrollState();

  const raidDuration = strategyData.raids?.duration ?? 0;
  const raidLevel = strategyData.raids?.level ?? 0;
  const areaHeight = getAreaHeight(pixelPerFrame, raidDuration);

  const availableActions = useMemo(() => {
    return (actionData ?? []).filter(
      ({
        available_level,
        superseding_level,
        updated_version,
        updated_subversion,
        deleted_version,
        deleted_subversion,
      }) => {
        const currentVersion = strategyData.version;
        const currentSubversion = strategyData.subversion * 10 + 9.9;

        if (available_level > raidLevel) return false;
        if (superseding_level && superseding_level <= raidLevel) return false;
        if (updated_version > currentVersion) return false;
        if (updated_version === currentVersion && updated_subversion > currentSubversion) return false;
        if (deleted_version && deleted_subversion) {
          if (deleted_version < currentVersion) return false;
          if (deleted_version === currentVersion && deleted_subversion <= currentSubversion) return false;
        }

        return true;
      },
    );
  }, [actionData, strategyData.version, strategyData.subversion, raidLevel]);

  const jobActionsMetaRecord = useMemo(() => {
    const record: Record<string, { id: string; job: string; semantic_key: string }[]> = {};
    for (const { id, job, semantic_key } of availableActions) {
      if (!record[job]) record[job] = [];
      record[job].push({ id, job, semantic_key });
    }
    return record;
  }, [availableActions]);

  const jobActionsRecord = useMemo(() => {
    const record: Record<string, ActionDataType> = {};
    for (const action of availableActions) {
      if (!record[action.job]) record[action.job] = [];
      record[action.job].push(action);
    }
    return record;
  }, [availableActions]);

  const playerEntriesRecord = useMemo(() => {
    const record: Record<string, Tables<'strategy_player_entries'>[]> = {};

    for (const playerStrategy of strategyData.strategy_players) {
      record[playerStrategy.id] = playerStrategy.strategy_player_entries.toSorted(
        (lhs, rhs) => lhs.use_at - rhs.use_at,
      );
    }

    return record;
  }, [strategyData.strategy_players]);

  const scrollSyncGroup = useMemo(() => ['x', 'y'], []);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop *= zoom.changeRatio;
    }

    if (mainRef.current) {
      mainRef.current.scrollTop *= zoom.changeRatio;
    }
  }, [zoom.changeRatio]);

  useAnimationFrame((time) => {
    const { active, context } = autoScroll;

    if (overlayRef.current && active) {
      const initialContext = {
        startedTime: time,
        startedFrame: overlayRef.current.scrollTop / pixelPerFrame,
      };

      const { startedTime, startedFrame } = context ?? initialContext;

      if (!context) {
        setAutoScroll({ active, context: initialContext });
      }

      const timeDiff = time - (startedTime ?? time);
      const calculatedScroll = ((timeDiff / 1000) * 60 + startedFrame) * pixelPerFrame;

      if (calculatedScroll > areaHeight - overlayRef.current.clientHeight) {
        setAutoScroll({ active: false, context: null });
        return;
      }

      overlayRef.current.scrollTop = calculatedScroll;

      if (mainRef.current) {
        mainRef.current.scrollTop = calculatedScroll;
      }
    }
  });

  useEffect(() => {
    const undoHandler = (e: KeyboardEvent) => {
      const isMac = navigator.userAgent.toLowerCase().includes('mac');
      const isCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!elevated) return;

      if (isCtrl) {
        if (e.key === 'z') {
          e.preventDefault();

          if (!e.shiftKey) {
            if (!undoEntryMutation()) {
              toast({
                description: t('NoMoreUndo'),
                variant: 'destructive',
              });
            }
          } else {
            if (!redoEntryMutation()) {
              toast({
                description: t('NoMoreRedo'),
                variant: 'destructive',
              });
            }
          }
        }
      }
    };

    window.addEventListener('keydown', undoHandler);

    return () => {
      window.removeEventListener('keydown', undoHandler);
    };
  }, [undoEntryMutation, redoEntryMutation, toast, elevated, t]);

  useEffect(() => {
    const autoScrollHandler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();

        setAutoScroll((prev) => ({
          active: !prev.active,
          context: null,
        }));
      }
    };

    window.addEventListener('keydown', autoScrollHandler);

    return () => {
      window.removeEventListener('keydown', autoScrollHandler);
    };
  }, [setAutoScroll]);

  return (
    <ScrollSync horizontal vertical={!autoScroll.active}>
      <EntrySelectionContext.Provider value={{ activeEntries, setActiveEntries }}>
        <ResizablePanelGroup
          direction="horizontal"
          className="relative flex w-screen flex-grow overflow-hidden select-none"
        >
          <ResizablePanel defaultSize={20} minSize={4} className="border-r -z-50">
            <div className="min-h-20 h-20 border-b" />
          </ResizablePanel>
          <ResizableHandle className="w-0" withHandle />
          <ResizablePanel
            defaultSize={80}
            maxSize={96}
            className="z-10 flex flex-col overflow-auto border-r"
            onResize={(size) => {
              setResizePanelSize(size);
            }}
          >
            <ScrollSyncPane group="x">
              <div className="min-h-20 h-20 overflow-x-scroll overflow-y-clip overscroll-none scrollbar-hide border-b flex flex-row">
                {strategyData.strategy_players.map(({ id, job, order }) => (
                  <HeadColumn
                    playerId={id}
                    job={job}
                    order={order}
                    actionsMeta={job ? jobActionsMetaRecord[job] : []}
                    key={`headcolumn-${id}`}
                  />
                ))}
              </div>
            </ScrollSyncPane>
            <ScrollSyncPane group={scrollSyncGroup} innerRef={mainRef}>
              <div
                className={cn(
                  'overscroll-none overflow-x-scroll',
                  autoScroll.active ? 'overflow-y-hidden' : 'overflow-y-scroll',
                )}
              >
                <div className="flex flex-grow relative bg-background" style={{ height: areaHeight }}>
                  {strategyData.strategy_players.map(({ id, job }) => (
                    <EditColumn
                      playerId={id}
                      raidDuration={raidDuration}
                      entries={playerEntriesRecord[id]}
                      actions={job ? jobActionsRecord[job] : []}
                      key={`editcolumn-${id}`}
                    />
                  ))}
                </div>
              </div>
            </ScrollSyncPane>
          </ResizablePanel>
          <ScrollSyncPane group="y" innerRef={overlayRef}>
            <div
              className={cn(
                'overscroll-none absolute top-20 left-0 w-screen h-[calc(100%-5rem)] scrollbar-hide',
                autoScroll.active ? 'overflow-y-hidden' : 'overflow-y-scroll',
              )}
            >
              <GimmickOverlay
                resizePanelSize={resizePanelSize}
                raidDuration={strategyData.raids?.duration ?? 0}
                gimmicks={strategyData.raids?.gimmicks ?? []}
              />
            </div>
          </ScrollSyncPane>
        </ResizablePanelGroup>
      </EntrySelectionContext.Provider>
    </ScrollSync>
  );
};
