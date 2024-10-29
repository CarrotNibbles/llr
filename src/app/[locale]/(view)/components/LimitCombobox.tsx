'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useState } from 'react';
import { ViewLink } from './ViewLink';

type LimitComboboxProps = Readonly<
  ButtonProps & {
    currentLimit: number;
  }
>;

const LIMIT_OPTIONS = [5, 10, 15, 20];
const LimitCombobox: React.FC<LimitComboboxProps> = ({ currentLimit, className, ...props }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('ViewPage.LimitCombobox');

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
          {t('Current', { currentLimit })}{' '}
          {open ? <CaretUpIcon className="w-6 h-6 mt-0.5" /> : <CaretDownIcon className="w-6 h-6" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto rounded-none px-2 py-2 z-10">
        <Command>
          <CommandList>
            <CommandEmpty>{t('Empty')}</CommandEmpty>
            <CommandGroup>
              {LIMIT_OPTIONS.map((limit) => (
                <CommandItem
                  className="rounded-none p-0 my-1"
                  key={limit}
                  value={limit.toString()}
                  defaultValue={currentLimit}
                  onSelect={() => setOpen(false)}
                >
                  <ViewLink
                    page={1}
                    limit={limit}
                    className="w-full flex gap-x-2 items-center justify-end text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    {t('Item', { limit })}
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
LimitCombobox.displayName = 'LimitCombobox';

export { LimitCombobox };
