'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { RaidsDataType } from '@/lib/queries/server';
import { DEFAULT_LIMIT, DEFAULT_SORT, buildBoardURL, cn } from '@/lib/utils';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useState } from 'react';

type RaidPopoverProps = Readonly<
  ButtonProps & {
    name: string; // TODO: Change to enum
    raidsData: RaidsDataType;
  }
>;

const RaidPopover = React.forwardRef<HTMLButtonElement, RaidPopoverProps>(
  ({ name, raidsData, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const tRaids = useTranslations('Common.Raids');
    // const raidsDataByDungeon: { dungeon: string; raidsData: RaidsDataType }[] = [{ dungeon: 'Anabesios', raidsData }];

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(className, 'font-bold')} ref={ref} {...props}>
            {name}
            <CaretDownIcon className="ml-1 w-6 h-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="border p-2 w-80">
          {/* <Accordion type="single" collapsible defaultValue={raidsDataByDungeon[0].dungeon}>
          {raidsDataByDungeon.map(({ dungeon, raidsData }) => (
            <RaidFoldout key={dungeon} name={dungeon} raidsData={raidsData} />
          ))}
        </Accordion> */}
          <ul>
            {raidsData.map((raidData) => (
              <li key={raidData.id} className="text-end mt-1">
                <Link
                  href={buildBoardURL({
                    page: 1,
                    limit: DEFAULT_LIMIT,
                    raid: raidData.semantic_key,
                    sort: DEFAULT_SORT,
                  })}
                  onClick={() => setOpen(false)}
                  className="w-full h-full flex p-2 hover:underline text-sm"
                >
                  {tRaids(raidData.semantic_key)}
                </Link>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    );
  },
);
RaidPopover.displayName = 'RaidPopover';

type RaidFoldoutProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    name: string;
    raidsData: RaidsDataType;
  }
>;

const RaidFoldout = React.forwardRef<HTMLDivElement, RaidFoldoutProps>(
  ({ name, raidsData, className, ...props }, ref) => {
    const tRaids = useTranslations('Common.Raids');

    return (
      <AccordionItem value={name} ref={ref} {...props}>
        <AccordionTrigger className={cn(className, 'p-2')}>{name}</AccordionTrigger>
        <AccordionContent className="p-0">
          <ul>
            {raidsData.map((raidData) => (
              <li key={raidData.id} className="text-end mt-1">
                <Link
                  href={buildBoardURL({
                    page: 1,
                    limit: DEFAULT_LIMIT,
                    raid: raidData.semantic_key,
                    sort: DEFAULT_SORT,
                  })}
                  className="w-full h-full flex p-2 hover:underline"
                >
                  {tRaids(raidData.semantic_key)}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    );
  },
);
RaidFoldout.displayName = 'RaidPopover';

export { RaidPopover };
