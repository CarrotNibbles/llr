'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useState } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { DamageEvaluation, type DamageEvaluationProps } from './DamageEvaluation';
import { EditColumn } from './EditColumn';
import { Separator } from '@radix-ui/react-separator';
import { HeadColumn } from './HeadColumn';

const jobs: string[] = Array(5).fill('WAR') as string[];

const propList: Array<Omit<DamageEvaluationProps, 'resizePanelSize'>> = Array.from(
  { length: 9 },
  (v, i) => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    cast_at: 100 + i * 200,
    id: 'uuid(ansdkofsjao)',
    name: '판데모니움 시바라',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    prepare_at: 120 + i * 200,
    raid: 'uuid(123123123)',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    resolve_at: 200 + i * 200,
    damages: [
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        combined_damage: 100000,
        gimmick: 'uuid(ansdkofsjao)',
        id: 'uuid(zbkcvkxcbvlkl)',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_shared: 3,
        target: 'Raidwide',
        type: 'Physical',
      },
    ],
  }),
);

export const CoreArea = () => {
  const [resizePanelSize, setResizePanelSize] = useState(20);
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
          onResize={(size) => {
            setResizePanelSize(size);
          }}
        >
          <ScrollSyncPane group="x">
            <div className="min-h-10 h-10 overflow-x-scroll overflow-y-clip overscroll-none scrollbar-hide border-b flex flex-row">
              {jobs.map((value, index) => (
                <HeadColumn
                  job={value}
                  skills={[{ id: '1' }, { id: '2' }, { id: '3' }]}
                  key={index}
                />
              ))}
            </div>
          </ScrollSyncPane>
          <ScrollSyncPane group={['x', 'y']}>
            <div className="flex flex-grow relative overflow-scroll overscroll-none">
              {jobs.map((value, index) => (
                <EditColumn
                  job={value}
                  skills={[{ id: '1' }, { id: '2' }, { id: '3' }]}
                  key={index}
                />
              ))}
            </div>
          </ScrollSyncPane>
        </ResizablePanel>
        <ScrollSyncPane group="y">
          <div className="absolute top-10 left-0 w-screen h-full pointer-events-none overflow-y-scroll scrollbar-hide">
            <div className="absolute top-0 left-0 w-screen h-[2960px]">
              {propList.map((value, index) => {
                return (
                  <DamageEvaluation {...value} resizePanelSize={resizePanelSize} key={index} />
                );
              })}
            </div>
          </div>
        </ScrollSyncPane>
      </ResizablePanelGroup>
    </ScrollSync>
  );
};
