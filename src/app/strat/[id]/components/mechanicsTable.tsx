'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { MyScrollArea } from '@/components/myScrollArea';
import { JobsBar } from './jobsBar';
import { useRef, useState } from 'react';

export const MechanicsTable = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const jobsBarRef = useRef<HTMLDivElement>(null);

  return (
    <MyScrollArea
      className="min-w-screen flex-grow"
      viewportRef={viewportRef}
      onScrollCapture={(_) => {
        if (jobsBarRef.current !== null && viewportRef.current !== null) {
          jobsBarRef.current.style.top = `${viewportRef.current.scrollTop}px`;
        }
      }}
    >
      <ResizablePanelGroup direction="horizontal" className="w-full h-full border">
        <ResizablePanel defaultSize={20} minSize={10}>
          <div className="flex h-[1200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80} minSize={60}>
          <ScrollArea>
            <JobsBar jobs={[]} ref={jobsBarRef} />
            <div className="flex h-[1200px] w-[1600px] items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </MyScrollArea>
  );
};
