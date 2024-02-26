'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { EditAreaColumn } from './components/editAreaColumn';
import { StratHeader } from './StratHeader';

export default function StratPage() {
  return (
    <ScrollSync>
      <>
        <StratHeader />
        <ResizablePanelGroup
          direction="horizontal"
          className="flex flex-col w-screen h-screen max-h-screen overflow-hidden"
        >
          <div className="flex flex-grow overflow-auto">
            <ResizablePanel
              defaultSize={20}
              minSize={10}
              className="flex flex-col overflow-auto border-r"
            >
              <div className="min-h-10 h-10 border-b"></div>
              <ScrollSyncPane group="y">
                <div className="overflow-y-scroll overflow-x-clip overscroll-none flex-grow scrollbar-hide">
                  ㅇ
                </div>
              </ScrollSyncPane>
            </ResizablePanel>
            <ResizableHandle className="w-0" />
            <ResizablePanel className="flex flex-grow flex-col overflow-auto border-r">
              <ScrollSyncPane group="x">
                <div className="min-h-10 h-10 overflow-x-scroll overflow-y-clip overscroll-none scrollbar-hide border-b">
                  ㅠ
                </div>
              </ScrollSyncPane>
              <ScrollSyncPane group={['x', 'y']}>
                <div className="flex flex-grow bg-zinc-500 overflow-scroll overscroll-none">
                  <EditAreaColumn job={1} />
                </div>
              </ScrollSyncPane>
            </ResizablePanel>
          </div>
        </ResizablePanelGroup>
      </>
    </ScrollSync>
  );
}
