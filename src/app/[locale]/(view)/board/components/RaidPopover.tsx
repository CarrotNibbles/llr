'use server';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { RaidsDataType } from '@/lib/queries/server';
import { DEFAULT_LIMIT, DEFAULT_SORT, buildBoardURL, cn } from '@/lib/utils';
import { CaretDownIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type React from 'react';

type RaidPopoverProps = Readonly<
  ButtonProps & {
    name: string; // TODO: Change to enum
    raidsData: RaidsDataType;
  }
>;

const RaidPopover: React.FC<RaidPopoverProps> = ({ name, raidsData, className, ...props }, ref) => {
  const raidsDataByDungeon: { dungeon: string; raidsData: RaidsDataType }[] = [{ dungeon: 'Anabesios', raidsData }];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(className, 'text-md font-bold rounded-none gap-x-1 items-center')}
          ref={ref}
          {...props}
        >
          {name}
          <CaretDownIcon className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="border p-2 w-80">
        <Accordion type="single" collapsible defaultValue={raidsDataByDungeon[0].dungeon}>
          {raidsDataByDungeon.map(({ dungeon, raidsData }) => (
            <RaidFoldout key={dungeon} name={dungeon} raidsData={raidsData} />
          ))}
        </Accordion>
      </PopoverContent>
    </Popover>
  );
};
RaidPopover.displayName = 'RaidPopover';

type RaidFoldoutProps = Readonly<
  React.HTMLAttributes<HTMLButtonElement> & {
    name: string;
    raidsData: RaidsDataType;
  }
>;

const RaidFoldout: React.FC<RaidFoldoutProps> = ({ name, raidsData, className, ...props }, ref) => {
  return (
    <AccordionItem value={name}>
      <AccordionTrigger className={cn(className, 'p-2')} {...props}>
        {name}
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <ul>
          {raidsData.map((raidData) => (
            <li key={raidData.id} className="text-end mt-1">
              <Link
                href={buildBoardURL({ page: 1, limit: DEFAULT_LIMIT, raid: raidData.semantic_key, sort: DEFAULT_SORT })}
                className="w-full h-full flex p-2 hover:underline"
              >
                {raidData.name}
              </Link>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};
RaidFoldout.displayName = 'RaidPopover';

export { RaidPopover };
