'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Tables } from '@/lib/database.types';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { buildClientInsertStrategyQuery } from '@/lib/queries/client';
import type { RaidsDataType } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CreateFormProps = Readonly<
  React.HTMLAttributes<HTMLFormElement> & {
    raidsData: RaidsDataType;
  }
>;

const CreateForm = React.forwardRef<HTMLFormElement, CreateFormProps>(({ raidsData, className, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [failMessage, setFailMessage] = useState<string | undefined>(undefined);
  const router = useRouter();
  const t = useTranslations();

  const supabase = createClient();

  const formSchema = z.object({
    name: z
      .string({ required_error: '이름을 입력하세요.' })
      .min(2, '제목은 2글자 이상이어야 합니다.')
      .max(50, '제목은 50글자 이하여야 합니다.'),
    raid: z.string({ required_error: '레이드를 선택하세요.' }),
    public: z.enum(['public', 'private'], {
      required_error: '공개 여부를 선택하세요',
    }),
    password: z
      .string({ required_error: '비밀번호를 설정하세요' })
      .min(8, '비밀번호는 길이 8이어야 합니다.')
      .max(8, '비밀번호는 길이 8이어야 합니다'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      public: 'public',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const userResponse = await supabase.auth.getUser();

    if (!userResponse.data.user) {
      setFailMessage('글을 작성하려면 로그인하세요.');
      return;
    }

    const stratPrototype: Omit<Tables<'strategies'>, 'id'> = {
      name: values.name,
      raid: values.raid,
      author: userResponse.data.user.id,
      is_editable: true,
      is_public: values.public === 'public',
      version: 7,
      subversion: 0,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      password: values.password,
    };
    const stratResponse = await buildClientInsertStrategyQuery(supabase, stratPrototype).select('id');

    const stratId = stratResponse.data?.shift()?.id;

    if (!stratId) {
      console.error(stratResponse.error);
      setFailMessage('공략 생성에 실패했습니다. 잠시 후 재시도해 주세요.');
      setIsLoading(false);
      return;
    }

    setFailMessage(undefined);
    router.push(`/strat/${stratId}`);
  };

  return (
    <Form {...form}>
      <form className={cn('py-4 space-y-2', className)} onSubmit={form.handleSubmit(onSubmit)} ref={ref} {...props}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block">공략명</FormLabel>
              <FormControl>
                <Input className="inline-block" id="name" placeholder="공략명을 입력하세요..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="raid"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block">레이드</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full inline-grid text-left justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                      style={{ gridTemplateColumns: '1fr 1rem' }}
                    >
                      <div className="overflow-hidden">
                        {field.value ? raidsData.find((raid) => raid.id === field.value)?.name : '레이드를 선택하세요'}
                      </div>
                      <CaretSortIcon className="ml-1 h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                  <Command>
                    <CommandInput placeholder="레이드 검색..." className="h-9" />
                    <CommandEmpty>레이드가 없습니다.</CommandEmpty>
                    <CommandGroup>
                      {raidsData.map((raid) => (
                        <CommandItem
                          value={raid.name}
                          key={raid.id}
                          onSelect={() => {
                            form.setValue('raid', raid.id);
                          }}
                        >
                          {raid.name}
                          <CheckIcon
                            className={cn('ml-auto h-4 w-4', raid.id === field.value ? 'opacity-100' : 'opacity-0')}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="public"
          render={({ field }) => (
            <FormItem>
              <FormLabel>공개 범위</FormLabel>
              <FormControl>
                <RadioGroup
                  className="grid items-center w-fit gap-x-2"
                  style={{ gridTemplateColumns: 'auto auto' }}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <RadioGroupItem value="public" id="public" />
                  <div className="flex flex-col">
                    <Label>전체공개</Label>
                    <FormDescription className="mt-1">누구든지 공략을 열람할 수 있습니다.</FormDescription>
                  </div>
                  <RadioGroupItem value="private" id="private" />
                  <div className="flex flex-col">
                    <Label>비공개</Label>
                    <FormDescription className="mt-1">
                      작성자 및 수정 권한이 부여된 사람만 공략을 열람할 수 있습니다.
                    </FormDescription>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'비밀번호'}</FormLabel>
              <FormControl>
                <InputOTP maxLength={8} {...field}>
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
              <FormDescription>{'공략 수정 시 사용할 비밀번호 (작성자는 필요 없음)'}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {failMessage && <div className="text-red-500 text-sm">{failMessage}</div>}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            생성
          </Button>
        </div>
      </form>
    </Form>
  );
});

type CreateButtonProps = Readonly<
  ButtonProps & {
    raidsData: RaidsDataType;
  }
>;

const CreateButton = React.forwardRef<HTMLButtonElement, CreateButtonProps>(
  ({ raidsData, className, ...props }, ref) => {
    const isDesktop = useMediaQuery('(min-width: 640px)');

    return isDesktop ? (
      <Dialog>
        <DialogTrigger asChild>
          <Button className={className} {...props} ref={ref}>
            <Pencil1Icon className="mr-1" />
            <div className="mx-1">공략 작성</div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공략 생성</DialogTitle>
          </DialogHeader>
          <CreateForm raidsData={raidsData} />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    ) : (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className={className} {...props} ref={ref}>
            <Pencil1Icon className="mr-1" />
            <div className="mx-1">공략 작성</div>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>공략 생성</DrawerHeader>
          <CreateForm raidsData={raidsData} className='px-8' />
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    );
  },
);

CreateButton.displayName = 'CreateButton';

export { CreateButton };
