'use client';

import { EditableText } from '@/components/EditableText';
import { ModeToggle } from '@/components/ModeToggle';
import { Icons } from '@/components/icons';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/use-toast';
import type { Enums } from '@/lib/database.types';
import { useFilterState } from '@/lib/states';
import { cn, GIMMICK_BACKGROUND_STYLE, GIMMICK_TYPE_NAME } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeartIcon, LockClosedIcon, LockOpen2Icon, Share1Icon, ZoomInIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ZoomSlider } from './ZoomSlider';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

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
          <span className="sr-only">Adjust display filter</span>
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
              <div className={cn('rounded-sm mr-2 w-[8px] h-[8px]', GIMMICK_BACKGROUND_STYLE[gimmickType])} />
              <div className="text-xs">{GIMMICK_TYPE_NAME[gimmickType]}</div>
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
      toast({ description: '수정 권한을 획득하였습니다.' });

      setOpen(false);
    } else {
      toast({
        variant: 'destructive',
        description: '비밀번호를 확인해주세요.',
      });

      form.setError('pin', { message: '비밀번호를 확인해주세요.' });
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
          <DialogTitle>수정 권한 획득</DialogTitle>
        </DialogHeader>
        {elevated ? (
          <p className="text-sm text-muted-foreground">수정 권한 획득이 완료되었습니다.</p>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
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
                    <FormDescription>이 전략의 수정 권한을 얻기 위한 비밀번호를 입력해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">제출</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

const StratHeader = React.forwardRef<HTMLDivElement, { className?: string } & React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const { toast } = useToast();
    // const [lastTitle, setLastTitle] = useState(name);

    const { name, raids, likes } = useStratSyncStore((state) => state.strategyData);

    return (
      <div
        ref={ref}
        className={cn('rounded-none border-b flex space-x-4 py-2 px-4 items-center', className)}
        {...props}
      >
        <EditableText initialText={name} className="font-bold" />
        <div className="text-muted-foreground">{raids?.name}</div>
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
                toast({ description: '클립보드에 링크가 복사되었습니다!' });
              } catch {
                toast({
                  variant: 'destructive',
                  title: '오류가 발생했습니다.',
                  description: '클립보드에 복사하는 중 오류가 발생하였습니다.',
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
