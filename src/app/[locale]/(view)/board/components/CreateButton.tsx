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
import { sha256 } from 'hash-wasm';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CreateButtonProps = Readonly<
  ButtonProps & {
    raidsData: RaidsDataType;
  }
>;

const CreateButton = React.forwardRef<HTMLButtonElement, CreateButtonProps>(
  ({ raidsData, className, ...props }, ref) => {
    const t = useTranslations('ViewPage.CreateButton');
    const isDesktop = useMediaQuery('(min-width: 640px)');

    return isDesktop ? (
      <Dialog>
        <DialogTrigger asChild>
          <Button className={className} {...props} ref={ref}>
            <Pencil1Icon />
            <div className="ml-2 mr-1 sm:block hidden">{t('ButtonTitle')}</div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('DialogTitle')}</DialogTitle>
          </DialogHeader>
          <CreateForm raidsData={raidsData} />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    ) : (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className={className} {...props} ref={ref}>
            <Pencil1Icon />
            <div className="ml-2 mr-1 sm:block hidden">{t('ButtonTitle')}</div>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>{t('DialogTitle')}</DrawerHeader>
          <CreateForm raidsData={raidsData} className="px-8" />
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    );
  },
);
CreateButton.displayName = 'CreateButton';

type CreateFormProps = Readonly<
  React.HTMLAttributes<HTMLFormElement> & {
    raidsData: RaidsDataType;
  }
>;

const CreateForm = React.forwardRef<HTMLFormElement, CreateFormProps>(({ raidsData, className, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [failMessage, setFailMessage] = useState<string | undefined>(undefined);
  const [raidPopoverOpen, setRaidPopoverOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('ViewPage.CreateButton');
  const tRaids = useTranslations('Common.Raids');

  const supabase = createClient();

  const formSchema = z.object({
    name: z
      .string({ required_error: t('NameRequired') })
      .min(2, t('NameTooShort'))
      .max(50, t('NameTooLong')),
    raid: z.string({ required_error: t('RaidRequired') }),
    scope: z.enum(['public', 'private'], {
      required_error: t('ScopeRequired'),
    }),
    password: z
      .string({ required_error: t('PasswordRequired') })
      .min(8, t('PasswordLengthMismatch'))
      .max(8, t('PasswordLengthMismatch')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      scope: 'public',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const userResponse = await supabase.auth.getUser();

    if (!userResponse.data.user) {
      setFailMessage(t('NotSignedIn'));
      return;
    }

    const stratPrototype: Omit<Tables<'strategies'>, 'id'> = {
      name: values.name,
      raid: values.raid,
      author: userResponse.data.user.id,
      is_editable: true,
      is_public: values.scope === 'public',
      version: 7,
      subversion: 0, // TODO: Add something like current_version
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      password: await sha256(values.password),
    };
    const stratResponse = await buildClientInsertStrategyQuery(supabase, stratPrototype).select('id');

    const stratId = stratResponse.data?.shift()?.id;

    if (!stratId) {
      console.error(stratResponse.error);
      setFailMessage(t('UnknownError'));
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
              <FormLabel className="inline-block">{t('NameLabel')}</FormLabel>
              <FormControl>
                <Input className="inline-block" id="name" placeholder={t('NamePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="raid"
          render={({ field }) => {
            const raidSelected = raidsData.some((raid) => raid.semantic_key === field.value);
            return (
              <FormItem>
                <FormLabel className="inline-block">{t('RaidLabel')}</FormLabel>
                <Popover
                  open={raidPopoverOpen}
                  onOpenChange={(open) => {
                    if (!open && !raidSelected) form.resetField('raid');
                    setRaidPopoverOpen(open);
                  }}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full inline-grid text-left justify-between',
                          !raidSelected && 'text-muted-foreground',
                        )}
                        style={{ gridTemplateColumns: '1fr 1rem' }}
                      >
                        <div className="overflow-hidden">
                          {raidSelected ? tRaids(field.value) : t('RaidPlaceholder')}
                        </div>
                        <CaretSortIcon className="ml-1 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="p-0 pointer-events-auto"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                  >
                    <Command {...field}>
                      <CommandInput placeholder={t('RaidSearchPlaceholder')} className="h-9" />
                      <CommandEmpty>{t('RaidEmpty')}</CommandEmpty>
                      <CommandGroup>
                        {raidsData.map((raid) => (
                          <CommandItem
                            value={raid.id}
                            key={raid.id}
                            onSelect={() => {
                              form.setValue('raid', raid.semantic_key);
                              setRaidPopoverOpen(false);
                            }}
                          >
                            {tRaids(raid.semantic_key)}
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
            );
          }}
        />
        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ScopeLabel')}</FormLabel>
              <FormControl>
                <RadioGroup
                  className="grid items-start w-fit gap-x-2"
                  style={{ gridTemplateColumns: 'auto auto' }}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <RadioGroupItem value="public" id="public" />
                  <div className="flex flex-col">
                    <Label>{t('ScopePublicLabel')}</Label>
                    <FormDescription className="mt-1">{t('ScopePublicDescription')}</FormDescription>
                  </div>
                  <RadioGroupItem value="private" id="private" />
                  <div className="flex flex-col">
                    <Label>{t('ScopePrivateLabel')}</Label>
                    <FormDescription className="mt-1">{t('ScopePrivateDescription')}</FormDescription>
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
              <FormLabel>{t('PasswordLabel')}</FormLabel>
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
              <FormDescription>{t('PasswordDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {failMessage && <div className="text-red-500 text-sm">{failMessage}</div>}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {t('CreateConfirm')}
          </Button>
        </div>
      </form>
    </Form>
  );
});

CreateForm.displayName = 'CreateForm';

export { CreateButton };
