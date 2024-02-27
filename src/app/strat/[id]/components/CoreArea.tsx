'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useZoomState } from '@/lib/states';
import { useState } from 'react';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { DamageEvaluation, type DamageEvaluationProps } from './DamageEvaluation';
import { EditColumn } from './EditColumn';
import { HeadColumn } from './HeadColumn';
import { usePixelPerFrame } from '@/lib/utils';
import { raidDurationTemp } from './coreAreaConstants';
import { type RaidDataType } from '@/lib/queries';
import { type Enums } from '@/lib/database.types';

const jobs: Array<Enums<'job'>> = ['WAR', 'PLD', 'SAM', 'MNK', 'BRD', 'RDM', 'AST', 'SGE'];

export type CoreAreaProps = {
  data: RaidDataType;
};

export const CoreArea = (props: CoreAreaProps) => {
  const [resizePanelSize, setResizePanelSize] = useState(20);
  const [zoom, _] = useZoomState();
  const pixelPerFrame = usePixelPerFrame();

  console.log(props);

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
                  skills={[
                    { id: '1' },
                    { id: '2' },
                    { id: '3' },
                    { id: '4' },
                    { id: '5' },
                    { id: '6' },
                  ]}
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
                  skills={[
                    { id: '1' },
                    { id: '2' },
                    { id: '3' },
                    { id: '4' },
                    { id: '5' },
                    { id: '6' },
                  ]}
                  key={index}
                />
              ))}
            </div>
          </ScrollSyncPane>
        </ResizablePanel>
        <ScrollSyncPane group="y">
          <div className="absolute top-10 left-0 w-screen h-full pointer-events-none overflow-y-scroll scrollbar-hide">
            <div
              className="absolute top-0 left-0 w-screen"
              style={{ height: `${raidDurationTemp * pixelPerFrame}px` }}
            >
              {props.data.map((value, index) => {
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
