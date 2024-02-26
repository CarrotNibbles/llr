'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { EditAreaColumn } from './editAreaColumn';
import { DamageEvaluation } from './DamageEvaluation';

export const CoreArea = () => {
  return (
    <ScrollSync>
      <ResizablePanelGroup
        direction="horizontal"
        className="relative flex w-screen flex-grow overflow-hidden"
      >
        <ResizablePanel defaultSize={20} minSize={4} className="border-r">
          <div className="min-h-10 h-10 border-b"></div>
        </ResizablePanel>
        <ResizableHandle className="w-0" withHandle />
        <ResizablePanel
          defaultSize={80}
          maxSize={96}
          className="flex flex-col overflow-auto border-r bg-white"
        >
          <ScrollSyncPane group="x">
            <div className="min-h-10 h-10 overflow-x-scroll overflow-y-clip overscroll-none scrollbar-hide border-b"></div>
          </ScrollSyncPane>
          <ScrollSyncPane group={['x', 'y']}>
            <ul className="relative flex-grow overflow-scroll overscroll-none">
              <EditAreaColumn job={1} />
            </ul>
          </ScrollSyncPane>
        </ResizablePanel>
        <ScrollSyncPane group="y">
          <div className="absolute top-10 left-0 w-screen h-full pointer-events-none overflow-y-scroll">
            <div className="absolute top-0 left-0 w-screen h-[2960px]">
              <DamageEvaluation />
            </div>
          </div>
        </ScrollSyncPane>
      </ResizablePanelGroup>
    </ScrollSync>
  );
};
