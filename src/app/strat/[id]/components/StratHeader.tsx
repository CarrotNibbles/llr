'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CopyIcon,
  HeartIcon,
  MixerHorizontalIcon,
  Share1Icon,
  ZoomInIcon,
} from '@radix-ui/react-icons';
import { cn, gimmickBackgroundColor, gimmickTypeName } from '@/lib/utils';
import { ZoomSlider } from './ZoomSlider';
import { Icons } from '@/components/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type Enums } from '@/lib/database.types';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

export const FilterMenu = () => {
  const [filterState, setFilterState] = useState<Array<[Enums<'gimmick_type'>, boolean]>>([
    ['AutoAttack', false],
    ['Avoidable', true],
    ['Raidwide', true],
    ['Tankbuster', true],
    ['Hybrid', true],
    ['Enrage', true],
  ]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icons.filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3">
        <div className="flex justify-between">
          <div className="text-xs w-full mb-[2px] ml-1">표시할 공격</div>
          <MixerHorizontalIcon />
        </div>
        <Separator className="mb-[2px]" />
        <div className="grid grid-rows-3 grid-cols-2">
          {filterState.map(([gimmickType, gimmickActive]) => (
            <Toggle
              className="flex justify-start text-start h-7 px-3 m-[2px]"
              aria-label="h"
              key={gimmickType}
              pressed={gimmickActive}
              onPressedChange={(pressed) => {
                setFilterState(
                  filterState.map(([gimmickType_, gimmickActive_]) =>
                    gimmickType_ === gimmickType
                      ? [gimmickType, pressed]
                      : [gimmickType_, gimmickActive_],
                  ),
                );
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
  { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('rounded-none border-b flex space-x-4 py-2 px-4 items-center', className)}
      {...props}
    >
      <div className="font-bold">내가 시발 부릅니다: 살려주세요</div>
      <div className="text-muted-foreground">마의 전당 판데모니움: 천옥편 4(영웅)</div>
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
        13598
      </Button>
    </div>
  );
});

StratHeader.displayName = 'StratHeader';

export { StratHeader };
