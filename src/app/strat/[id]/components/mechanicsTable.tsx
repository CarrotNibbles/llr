'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { MyScrollArea } from '@/components/myScrollArea';
import React, { type RefObject, useRef, useState } from 'react';
import { PlayerColumn } from './playerColumn';

export const MechanicsTable = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const playerColumnRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const jobs = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <MyScrollArea
      className="min-w-screen flex-grow"
      viewportRef={viewportRef}
      onScrollCapture={() => {
        if (viewportRef.current !== null) {
          for (const playerColumnRef of playerColumnRefs) {
            if (playerColumnRef.current !== null)
              playerColumnRef.current.style.top = `${viewportRef.current.scrollTop}px`;
          }
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
        <ResizablePanel className="flex" defaultSize={80} minSize={60}>
          <ScrollArea className="w-[95%] whitespace-nowrap rounded-md border">
            <ul className="flex px-2">
              {jobs.map((job, index) => {
                return (
                  <PlayerColumn key={index} job={job} isOpen={true} ref={playerColumnRefs[index]} />
                );
              })}
            </ul>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </MyScrollArea>
  );
};
