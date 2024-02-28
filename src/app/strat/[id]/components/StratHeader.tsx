'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { type Enums } from '@/lib/database.types';
import { type StrategyDataType } from '@/lib/queries';
import { useFilterState } from '@/lib/states';
import { cn, gimmickBackgroundColor, gimmickTypeName } from '@/lib/utils';
import {
  CopyIcon,
  HeartIcon,
  MixerHorizontalIcon,
  Share1Icon,
  ZoomInIcon,
} from '@radix-ui/react-icons';
import React from 'react';
import { ZoomSlider } from './ZoomSlider';

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
  return (
    <div
      ref={ref}
      className={cn('rounded-none border-b flex space-x-4 py-2 px-4 items-center', className)}
      {...props}
    >
      <div className="font-bold">{name}</div>
      <div className="text-muted-foreground">{raids?.name}</div>
      <div className="flex-grow"></div>
      <ZoomInIcon className="w-5 h-5" />
      <ZoomSlider className="ml-0" />
      <div className="flex">
        <Button variant="ghost" size="icon">
          <Share1Icon />
        </Button>
        <Button variant="ghost" size="icon">
          <CopyIcon />
        </Button>
        <FilterMenu />
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
