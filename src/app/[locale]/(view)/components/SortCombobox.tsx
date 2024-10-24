'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DEFAULT_LIMIT, type SortOption, cn, ALL_SORT_OPTIONS } from '@/lib/utils';
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import type React from 'react';
import { useState } from 'react';
import { ViewLink } from './ViewLink';

type SortComboboxProps = Readonly<
  ButtonProps & {
    currentSort: SortOption;
  }
>;

const sortOptionMap: Record<SortOption, string> = {
  like: 'Most Likes',
  recent: 'Most Recent',
};

const SortCombobox: React.FC<SortComboboxProps> = ({ currentSort, className, ...props }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'rounded-none flex gap-x-2 items-center text-xs sm:text-sm pl-3 pr-2 sm:pl-4 sm:pr-2',
            className,
          )}
          {...props}
          variant="outline"
        >
          {sortOptionMap[currentSort]}
          {open ? <CaretUpIcon className="w-6 h-6 mt-0.5" /> : <CaretDownIcon className="w-6 h-6" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto rounded-none px-2 py-2 z-10">
        <Command>
          <CommandList>
            <CommandEmpty>Choose the number of strats to show in a page</CommandEmpty>
            <CommandGroup>
              {ALL_SORT_OPTIONS.map((sort) => (
                <CommandItem
                  className="rounded-none p-0 my-1"
                  key={sort}
                  value={sort}
                  defaultValue={currentSort}
                  onSelect={() => setOpen(false)}
                >
                  <ViewLink
                    page={1}
                    limit={DEFAULT_LIMIT}
                    sort={sort}
                    className="w-full flex gap-x-2 items-center text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    {sortOptionMap[sort]}
                  </ViewLink>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
SortCombobox.displayName = "SortCombobox"

export { SortCombobox };
