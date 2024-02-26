'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PlayerColumn } from './playerColumn';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';

export const StratTable = () => {
  const jobs = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <ScrollSync>
      <ResizablePanelGroup direction="horizontal" className="w-full h-full border">
        <ResizablePanel defaultSize={20} minSize={10}>
          <ScrollSyncPane group="strat-table">
            <ScrollArea>
              <div className="flex h-[1200px] items-center justify-center p-6">
                <span className="font-semibold">One</span>
              </div>
            </ScrollArea>
          </ScrollSyncPane>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="flex" defaultSize={80} minSize={60}>
          <ScrollSyncPane group="strat-table">
            <ScrollArea>
              <ul className="flex px-2">
                {jobs.map((job, index) => (
                  <PlayerColumn key={index} job={job} isOpen={true} />
                ))}
              </ul>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </ScrollSyncPane>
          <Separator orientation="vertical" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ScrollSync>
  );
};
