'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { type Enums } from '@/lib/database.types';
import { type StrategyDataType } from '@/lib/queries/server';
import { useFilterState } from '@/lib/states';
import { cn, gimmickBackgroundColor, gimmickTypeName } from '@/lib/utils';
import { CopyIcon, HeartIcon, Share1Icon, ZoomInIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import { ZoomSlider } from './ZoomSlider';
import { EditableText } from '@/components/EditableText';
import { ModeToggle } from '@/components/ModeToggle';
import { useToast } from '@/components/ui/use-toast';

export const FilterMenu = () => {
  const GimmickTypes: Array<Enums<'gimmick_type'>> = [
    'AutoAttack',
    'Avoidable',
    'Raidwide',
    'Tankbuster',
    'Hybrid',
    'Enrage',
  ];
  const [filterState, setFilterState] = useFilterState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icons.filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3">
        {/* <div className="flex justify-between">
          <div className="text-xs w-full mb-[2px] ml-1">표시할 공격</div>
          <MixerHorizontalIcon />
        </div>
        <Separator className="mb-[2px]" /> */}
        <div className="grid grid-rows-3 grid-cols-2">
          {GimmickTypes.map((gimmickType) => (
            <Toggle
              className="flex justify-start text-start h-7 px-3 m-[2px]"
              aria-label="h"
              key={gimmickType}
              pressed={filterState.get(gimmickType)}
              onPressedChange={(pressed) => {
                setFilterState(new Map(filterState).set(gimmickType, pressed));
              }}
            >
              <div
                className={cn(
                  'rounded-sm mr-2 w-[8px] h-[8px]',
                  gimmickBackgroundColor[gimmickType],
                )}
              />
              <div className="text-xs">{gimmickTypeName[gimmickType]}</div>
            </Toggle>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const StratHeader = React.forwardRef<
  HTMLDivElement,
  { strategyData: StrategyDataType; className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ strategyData: { name, raids, likes }, className, ...props }, ref) => {
  const { toast } = useToast();
  const [lastTitle, setLastTitle] = useState(name);

  return (
    <div
      ref={ref}
      className={cn('rounded-none border-b flex space-x-4 py-2 px-4 items-center', className)}
      {...props}
    >
      <EditableText initialText={name} className="font-bold" />
      <div className="text-muted-foreground">{raids?.name}</div>
      <div className="flex-grow"></div>
      <ZoomInIcon className="w-5 h-5" />
      <ZoomSlider className="ml-0" />
      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          onClick={async () => {
            try {
              await window.navigator.clipboard.writeText(window.location.href);
              toast({ description: '클립보드에 링크가 복사되었습니다!' });
            } catch {
              toast({
                variant: 'destructive',
                title: '오류가 발생했습니다.',
                description: '클립보드에 복사하는 중 오류가 발생하였습니다.',
              });
            }
          }}
        >
          <Share1Icon />
        </Button>
        <Button variant="ghost" size="icon">
          <CopyIcon />
        </Button>
        <FilterMenu />
        <ModeToggle />
      </div>
      <Button className="">
        <HeartIcon className="mr-2" />
        {likes}
      </Button>
    </div>
  );
});

StratHeader.displayName = 'StratHeader';

export { StratHeader };
