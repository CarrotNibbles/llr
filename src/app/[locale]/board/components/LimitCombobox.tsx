'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import type React from 'react';
import { useState } from 'react';
import { BoardLink } from './BoardLink';

type LimitComboboxProps = Readonly<
  ButtonProps & {
    currentLimit: number;
  }
>;

const LIMIT_OPTIONS = [5, 10, 15, 20];

export const LimitCombobox: React.FC<LimitComboboxProps> = ({ currentLimit, className, ...props }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className={cn('rounded-none flex gap-x-2 items-center pr-2', className)} {...props} variant="outline">
          {currentLimit} strats in page{' '}
          {open ? <CaretUpIcon className="w-6 h-6 mt-0.5" /> : <CaretDownIcon className="w-6 h-6" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto rounded-none px-2 py-2 z-10">
        <Command>
          <CommandList>
            <CommandEmpty>Choose the number of strats to show in a page</CommandEmpty>
            <CommandGroup>
              {LIMIT_OPTIONS.map((limit) => (
                <CommandItem
                  className="rounded-none px-4 py-2 my-1"
                  key={limit}
                  value={limit.toString()}
                  defaultValue={currentLimit}
                  onSelect={() => setOpen(false)}
                >
                  <BoardLink
                    page={1}
                    limit={limit}
                    className="w-full flex gap-x-2 items-center justify-end"
                  >
                    {limit} strats per page
                  </BoardLink>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
