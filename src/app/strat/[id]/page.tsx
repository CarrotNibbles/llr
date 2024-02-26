'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { EditAreaColumn } from './components/editAreaColumn';
import { StratHeader } from './StratHeader';
import { DamageEvaluation } from './components/DamageEvaluation';

export default function StratPage() {
  return (
    <ScrollSync>
      <div className="flex flex-col max-h-screen h-screen">
        <StratHeader />
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
              <div className="min-h-10 h-10 overflow-x-scroll overflow-y-clip overscroll-none scrollbar-hide border-b">
                <div className="min-w-[1400px]"></div>
              </div>
            </ScrollSyncPane>
            <ScrollSyncPane group={['x', 'y']}>
              <div className="relative flex-grow overflow-scroll overscroll-none">
                <div className="min-h-[2000px] min-w-[1400px]"></div>
              </div>
            </ScrollSyncPane>
          </ResizablePanel>
          <ScrollSyncPane group="y">
            <div className="absolute top-10 left-0 w-screen h-full pointer-events-none overflow-y-scroll">
              <div className="absolute top-0 left-0 w-screen min-h-[2000px]">
                <DamageEvaluation />
                <div className="absolute border-b border-2 border-red-500 h-0 w-screen top-[1200px]"></div>
                <div className="absolute border-b border-2 border-blue-500 h-0 w-screen top-[1700px]"></div>
              </div>
            </div>
          </ScrollSyncPane>
        </ResizablePanelGroup>
      </div>
    </ScrollSync>
  );
}
