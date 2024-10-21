'use client';

import { useStaticDataStore } from '@/components/providers/StaticDataStoreProvider';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useZoomState } from '@/lib/states';
import { usePixelPerFrame } from '@/lib/utils';
import { type DragControls, useDragControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { EditColumn } from './EditColumn';
import { EntrySelectionContext } from './EntrySelectionContext';
import { GimmickOverlay } from './GimmickOverlay';
import { HeadColumn } from './HeadColumn';

export const CoreArea = () => {
  const [zoom, _] = useZoomState();
  const [resizePanelSize, setResizePanelSize] = useState(20);
  const pixelPerFrame = usePixelPerFrame();

  const actionData = useStaticDataStore((state) => state.actionData);
  const strategyData = useStratSyncStore((state) => state.strategyData);

  const ref = useRef<HTMLDivElement>(null);

  const [activeEntries, setActiveEntries] = useState<Map<string, DragControls>>(new Map());

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop *= zoom.changeRatio;
    }
  }, [zoom.changeRatio]);

  const raidDuration = strategyData.raids?.duration ?? 0;
  const raidLevel = strategyData.raids?.level ?? 0;

  const availableActions = (actionData ?? []).filter(
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

  return (
    <ScrollSync>
      <EntrySelectionContext.Provider value={{ activeEntries, setActiveEntries }}>
        <ResizablePanelGroup direction="horizontal" className="relative flex w-screen flex-grow overflow-hidden">
          <ResizablePanel defaultSize={20} minSize={4} className="border-r -z-50">
            <div className="min-h-20 h-20 border-b" />
          </ResizablePanel>
          <ResizableHandle className="w-0" withHandle />
          <ResizablePanel
            defaultSize={80}
            maxSize={96}
            className="z-10 flex flex-col overflow-auto border-r bg-background"
            onResize={(size) => {
              setResizePanelSize(size);
            }}
          >
            <ScrollSyncPane group="x">
              <div className="min-h-20 h-20 overflow-x-scroll overflow-y-clip overscroll-none scrollbar-hide border-b flex flex-row">
                {strategyData.strategy_players.map((playerStrategy) => (
                  <HeadColumn
                    playerId={playerStrategy.id}
                    job={playerStrategy.job}
                    order={playerStrategy.order}
                    actions={availableActions.filter(({ job }) => job === playerStrategy.job)}
                    key={`headcolumn-${playerStrategy.id}`}
                  />
                ))}
              </div>
            </ScrollSyncPane>
            <ScrollSyncPane group={['x', 'y']}>
              <div className="overflow-scroll overscroll-none">
                <div className="flex flex-grow relative" style={{ height: `${raidDuration * pixelPerFrame + 60}px` }}>
                  {strategyData.strategy_players.map((playerStrategy) => (
                    <EditColumn
                      raidDuration={raidDuration}
                      playerStrategy={playerStrategy}
                      actions={availableActions.filter(({ job }) => job === playerStrategy.job)}
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
