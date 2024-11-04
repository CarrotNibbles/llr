'use client';

import { useStaticDataStore } from '@/components/providers/StaticDataStoreProvider';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { usePixelPerFrame, useZoomState } from '@/lib/states';
import type { DragControls } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

import type { ActionDataType } from '@/lib/queries/server';
import { getAreaHeight } from '../utils/helpers';
import { EditColumn, EntrySelectionContext, HeadColumn } from './column';
import { GimmickOverlay } from './overlay';

export const StratMain = () => {
  const [zoom, _] = useZoomState();
  const [resizePanelSize, setResizePanelSize] = useState(20);
  const pixelPerFrame = usePixelPerFrame();

  const actionData = useStaticDataStore((state) => state.actionData);
  const strategyData = useStratSyncStore((state) => state.strategyData);

  const ref = useRef<HTMLDivElement>(null);

  const [activeEntries, setActiveEntries] = useState<Map<string, DragControls>>(new Map());
  const [draggingCount, setDraggingCount] = useState(0);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop *= zoom.changeRatio;
    }
  }, [zoom.changeRatio]);

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

  const scrollSyncGroup = useMemo(() => ['x', 'y'], []);

  return (
    <ScrollSync>
      <EntrySelectionContext.Provider value={{ activeEntries, setActiveEntries, draggingCount, setDraggingCount }}>
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
            <ScrollSyncPane group={scrollSyncGroup}>
              <div className="overflow-scroll overscroll-none">
                <div className="flex flex-grow relative bg-background" style={{ height: areaHeight }}>
                  {strategyData.strategy_players.map((playerStrategy) => (
                    <EditColumn
                      raidDuration={raidDuration}
                      playerStrategy={playerStrategy}
                      actions={playerStrategy.job ? jobActionsRecord[playerStrategy.job] : []}
                      key={`editcolumn-${playerStrategy.id}`}
                    />
                  ))}
                </div>
              </div>
            </ScrollSyncPane>
          </ResizablePanel>
          <ScrollSyncPane group="y" innerRef={ref}>
            <div className="absolute top-20 left-0 w-screen h-[calc(100%-5rem)] overflow-y-scroll scrollbar-hide">
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
