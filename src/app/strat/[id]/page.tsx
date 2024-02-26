'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

export default function StratPage() {
  return (
    <ScrollSync>
      <>
        <div className="min-h-10 bg-zinc-900"></div>
        <ResizablePanelGroup
          direction="horizontal"
          className="flex flex-col w-screen h-screen max-h-screen overflow-hidden"
        >
          <div className="flex flex-grow overflow-auto">
            <ResizablePanel defaultSize={20} minSize={10} className="flex flex-col overflow-auto">
              <div className="min-h-10 h-10 bg-red-500"></div>
              <ScrollSyncPane group="y">
                <div className="bg-zinc-700 overflow-y-scroll overflow-x-clip overscroll-none flex-grow scrollbar-hide"></div>
              </ScrollSyncPane>
            </ResizablePanel>
            <ResizableHandle className="w-0" />
            <ResizablePanel className="flex flex-grow flex-col overflow-auto">
              <ScrollSyncPane group="x">
                <div className="min-h-10 h-10 bg-zinc-700 overflow-x-scroll overflow-y-clip overscroll-none scrollbar-hide"></div>
              </ScrollSyncPane>
              <ScrollSyncPane group={['x', 'y']}>
                <div className="flex-grow bg-zinc-500 overflow-scroll overscroll-none"></div>
              </ScrollSyncPane>
            </ResizablePanel>
          </div>
        </ResizablePanelGroup>
      </>
    </ScrollSync>
  );
}
