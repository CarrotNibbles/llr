'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { RaidsDataType } from '@/lib/queries/server';
import { DEFAULT_LIMIT, DEFAULT_SORT, buildBoardURL, cn } from '@/lib/utils';
import { CaretDownIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { ViewLink } from '../../components/ViewLink';

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

type RaidSearchPopoverProps = Readonly<
  ButtonProps & {
    raidsData: RaidsDataType;
  }
>;

const RaidSearchPopover = React.forwardRef<HTMLButtonElement, RaidSearchPopoverProps>(
  ({ raidsData, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const t = useTranslations('ViewPage.RaidSearchPopover');
    const tRaids = useTranslations('Common.Raids');
    const searchParams = useSearchParams();

    const raidSelected = searchParams.get('raid');

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              className,
              'inline-flex text-left justify-between hover:bg-background hover:ring-ring hover:ring-1 transition-all',
              !raidSelected && 'text-muted-foreground',
            )}
            {...props}
          >
            <div className="overflow-hidden">{raidSelected ? tRaids(raidSelected) : t('RaidAll')}</div>
            <CaretSortIcon className="ml-1 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
          <Command>
            <CommandInput placeholder={t('RaidSearchPlaceholder')} className="h-9" />
            <CommandEmpty>{t('RaidEmpty')}</CommandEmpty>
            <CommandGroup>
              <CommandItem>
                <ViewLink
                  raid={null}
                  page={1}
                  className="w-full inline-flex items-center"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {t('RaidAll')}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      raidSelected === '' || raidSelected === null ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </ViewLink>
              </CommandItem>
              {raidsData.map((raid) => (
                <CommandItem value={raid.semantic_key} key={raid.id}>
                  <ViewLink
                    raid={raid.semantic_key}
                    page={1}
                    className="w-full inline-flex items-center"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {tRaids(raid.semantic_key)}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        raid.semantic_key === raidSelected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </ViewLink>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

RaidPopover.displayName = 'RaidPopover';
RaidFoldout.displayName = 'RaidPopover';
RaidSearchPopover.displayName = 'RaidSearchPopover';

export { RaidPopover, RaidSearchPopover, RaidFoldout };
