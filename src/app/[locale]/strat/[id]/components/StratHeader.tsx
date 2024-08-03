'use client';

import { EditableText } from '@/components/EditableText';
import { ModeToggle } from '@/components/ModeToggle';
import { Icons } from '@/components/icons';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/use-toast';
import { useEstimations } from '@/lib/calc/hooks';
import type { Enums } from '@/lib/database.types';
import { useFilterState } from '@/lib/states';
import { GIMMICK_BACKGROUND_STYLE, cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeartIcon, LockClosedIcon, LockOpen2Icon, Share1Icon, ZoomInIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  const t = useTranslations('StratPage.StratHeader.GimmickType');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Adjust display filter</span>
          <Icons.filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
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
              <div className={cn('rounded-sm mr-2 w-[8px] h-[8px]', GIMMICK_BACKGROUND_STYLE[gimmickType])} />
              <div className="text-xs">{t(gimmickType)}</div>
            </Toggle>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ElevationDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { elevated, elevate } = useStratSyncStore((state) => state);
  const t = useTranslations('StratPage.StratHeader.EditPermission');

  const formSchema = z.object({
    pin: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { pin: '' },
  });

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key) && !open && !elevated) {
        setOpen(true);
      }
    };

    window.addEventListener('keydown', keyDownHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [open, elevated]);

  const onSubmit = form.handleSubmit(async (values: z.infer<typeof formSchema>) => {
    const res = await elevate(values.pin);

    if (res) {
      toast({ description: t('Success') });

      setOpen(false);
    } else {
      toast({
        variant: 'destructive',
        description: t('Failure'),
      });

      form.setError('pin', { message: t('Failure') });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {elevated ? (
          <Button size="icon">
            <span className="sr-only">Strategy unlocked</span>
            <LockOpen2Icon />
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <span className="sr-only">Unlock this strategy</span>
            <LockClosedIcon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Acquire')}</DialogTitle>
        </DialogHeader>
        {elevated ? (
          <p className="text-sm text-muted-foreground">{t('Complete')}</p>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Password')}</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={8} onComplete={onSubmit} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                          <InputOTPSlot index={6} />
                          <InputOTPSlot index={7} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>{t('Description')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">{t('Submit')}</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const StratInfo = () => {
  const { name, raids, version, subversion, strategy_players } = useStratSyncStore((state) => state.strategyData);
  const estimations = useEstimations();
  const t = useTranslations('StratPage.StratHeader.StratInfo');
  const tRaids = useTranslations('StratPage.Raids');
  const tPatches = useTranslations('StratPage.FFXIVPatches');

  const playerCount = strategy_players.filter((player) => player.job != null && player.job !== 'LB').length;

  const infos = [
    {
      style: 'col-span-2',
      title: t('StrategyTitle'),
      value: name,
    },
    {
      style: 'col-span-2',
      title: t('Duty'),
      value: tRaids(raids?.semantic_key),
    },
    {
      style: 'col-span-2',
      title: t('FFXIVPatch'),
      value: `${version}.${subversion} - ${tPatches(`${version}.${subversion}`)}`,
    },
    {
      title: t('LevelSync'),
      value: raids?.level,
    },
    {
      title: t('ItemLevelSync'),
      value: raids?.item_level,
    },
    {
      title: t('PlayerCount'),
      value: playerCount,
    },
    {
      title: t('PartyBonus'),
      value: `${Math.round(estimations.partyBonus * 100 - 100)}%`,
    },
    {
      title: t('HPTank'),
      value: estimations.hpTank,
    },
    {
      title: t('HPHealer'),
      value: estimations.hpHealer,
    },
    {
      title: t('HealingTank'),
      value: `${Math.round(estimations.potencyCoefficientTank * 400)}`,
    },
    {
      title: t('HealingHealer'),
      value: `${Math.round(estimations.potencyCoefficientHealer * 400)}`,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <h3 className="font-bold cursor-pointer">{name}</h3>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('DialogTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-y-2 gap-x-8" style={{ gridTemplateColumns: 'auto auto' }}>
            {infos.map((info) => (
              <div key={info.title} className={cn('flex space-x-2 justify-between', info.style)}>
                <div className="text-muted-foreground">{info.title}</div>
                <div className="font-semibold">{info.value}</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground text-justify">{t('Disclaimer')}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StratHeader = React.forwardRef<HTMLDivElement, { className?: string } & React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const { toast } = useToast();
    // const [lastTitle, setLastTitle] = useState(name);

    const { raids, likes } = useStratSyncStore((state) => state.strategyData);
    const t = useTranslations('StratPage.StratHeader');
    const tRaids = useTranslations('StratPage.Raids');

    return (
      <div
        ref={ref}
        className={cn('rounded-none border-b flex space-x-4 py-2 px-4 items-center', className)}
        {...props}
      >
        <StratInfo />
        <div className="text-muted-foreground">{tRaids(raids?.semantic_key)}</div>
        <div className="flex-grow" />
        <ZoomInIcon className="w-5 h-5" />
        <ZoomSlider className="ml-0" />
        <div className="flex">
          <ElevationDialog />
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              try {
                await window.navigator.clipboard.writeText(window.location.href);
                toast({ description: t('Share.Success') });
              } catch {
                toast({
                  variant: 'destructive',
                  title: t('Share.FailureTitle'),
                  description: t('Share.FailureDescription'),
                });
              }
            }}
          >
            <span className="sr-only">Share this strategy</span>
            <Share1Icon />
          </Button>
          {/* <Button variant="ghost" size="icon">
            <CopyIcon />
          </Button> */}
          <FilterMenu />
          <ModeToggle />
        </div>
        <Button className="">
          <HeartIcon className="mr-2" />
          {likes}
        </Button>
      </div>
    );
  },
);

StratHeader.displayName = 'StratHeader';

export { StratHeader };
