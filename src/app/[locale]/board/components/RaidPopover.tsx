'use server';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import type { RaidsDataType } from '@/lib/queries/server';
import { cn } from '@/lib/utils';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { PopoverContent } from '@radix-ui/react-popover';
import type React from 'react';

type RaidFoldoutProps = Readonly<
  React.HTMLAttributes<HTMLButtonElement> & {
    name: string;
    raidsData: RaidsDataType;
  }
>;

const RaidFoldout: React.FC<RaidFoldoutProps> = async ({ name, raidsData, className, ...props }, ref) => {
  return (
    <AccordionItem value={name}>
      <AccordionTrigger className={cn(className, 'p-2')} {...props}>
        {name}
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <ul>
          {raidsData.map((raidData) => (
            <li key={raidData.id} className="p-2 text-end">
              {raidData.name}
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

type RaidPopoverProps = Readonly<
  ButtonProps & {
    name: string; // TODO: Change to enum
    raidsData: RaidsDataType;
  }
>;

export const RaidPopover: React.FC<RaidPopoverProps> = async ({ name, raidsData, className, ...props }, ref) => {
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
