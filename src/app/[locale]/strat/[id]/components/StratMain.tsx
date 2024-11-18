'use client';

import { useStaticDataStore } from '@/components/providers/StaticDataStoreProvider';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { autoScrollAtom, noteAtom, pixelPerFrameAtom, zoomAtom } from '@/lib/atoms';
import type { Tables } from '@/lib/database.types';
import type { ActionDataType } from '@/lib/queries/server';
import { cn } from '@/lib/utils';
import { useAnimationFrame } from 'framer-motion';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollSync, ScrollSyncPane, type ScrollSyncPaneProps, type ScrollSyncProps } from 'react-scroll-sync';
import { COLUMN_WIDTH_PX, RIGHT_PADDING_CLS, RIGHT_PADDING_PX } from '../utils/constants';
import { verticalTransformsFactory } from '../utils/helpers';
import { EditColumn, HeadColumn } from './column';
import { NoteOverlay } from './note/NoteOverlay';
import { GimmickOverlay } from './overlay';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const ScrollSyncFixed: (props: ScrollSyncProps) => React.ReactNode = ScrollSync as any;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const ScrollSyncPaneFixed: (props: ScrollSyncPaneProps) => React.ReactNode = ScrollSyncPane as any;

export const StratMain = () => {
  const [resizePanelSize, setResizePanelSize] = useState(20);
  const zoom = useAtomValue(zoomAtom);
  const pixelPerFrame = useAtomValue(pixelPerFrameAtom);

  const actionData = useStaticDataStore((state) => state.actionData);
  const strategyData = useStratSyncStore((state) => state.strategyData);

  const overlayRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useAtom(autoScrollAtom);
  const setNoteState = useSetAtom(noteAtom);

  const raidDuration = strategyData.raids?.duration ?? 0;
  const raidLevel = strategyData.raids?.level ?? 0;
  const { areaHeight } = verticalTransformsFactory(raidDuration, pixelPerFrame);

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

  useEffect(() => {
    const editColumnWidths: number[] = [];
    for (const { job } of strategyData.strategy_players) {
      const nActions = job ? jobActionsMetaRecord[job]?.length : 0;
      editColumnWidths.push((nActions === 0 ? 3 : nActions) * COLUMN_WIDTH_PX + 5);
    }

    setNoteState((prev) => ({ ...prev, editColumnWidths }));
  }, [strategyData.strategy_players, jobActionsMetaRecord, setNoteState]);

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

  return (
    <ScrollSyncFixed horizontal vertical={!autoScroll.active} proportional={false}>
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
          <ScrollSyncPaneFixed group="x">
            <div
              className={cn(
                'min-h-20 h-20 overflow-x-scroll overflow-y-clip overscroll-none scrollbar-hide border-b flex flex-row',
                RIGHT_PADDING_CLS,
              )}
            >
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
          </ScrollSyncPaneFixed>
          <ScrollSyncPaneFixed group={scrollSyncGroup} innerRef={mainRef}>
            <div
              className={cn(
                'relative overscroll-none overflow-x-scroll',
                RIGHT_PADDING_CLS,
                autoScroll.active ? 'overflow-y-hidden' : 'overflow-y-scroll',
              )}
            >
              <div className="flex flex-grow relative bg-background" style={{ height: areaHeight }} ref={editRef}>
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
              <NoteOverlay
                className="absolute z-20 top-0 left-0 w-full"
                style={{
                  height: areaHeight,
                  width: (editRef.current?.scrollWidth ?? 0) + RIGHT_PADDING_PX,
                  maxWidth: (editRef.current?.scrollWidth ?? 0) + RIGHT_PADDING_PX,
                }}
                raidDuration={raidDuration}
                notes={strategyData.notes}
              />
            </div>
          </ScrollSyncPaneFixed>
        </ResizablePanel>
        <ScrollSyncPaneFixed group="y" innerRef={overlayRef}>
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
        </ScrollSyncPaneFixed>
      </ResizablePanelGroup>
    </ScrollSyncFixed>
  );
};
