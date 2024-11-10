'use client';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { buildClientDeleteStrategyQuery, buildClientUpdateStrategyQuery } from '@/lib/queries/client';
import { createClient } from '@/lib/supabase/client';
import { ALL_PATCHES, patchRegex } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExclamationTriangleIcon, GearIcon } from '@radix-ui/react-icons';
import { bcrypt, sha1, sha256 } from 'hash-wasm';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const StratSettingsDialog = () => {
  const id = useStratSyncStore((state) => state.strategyData.id);
  const name = useStratSyncStore((state) => state.strategyData.name);
  const isPublic = useStratSyncStore((state) => state.strategyData.is_public);
  const isEditable = useStratSyncStore((state) => state.strategyData.is_editable);
  const version = useStratSyncStore((state) => state.strategyData.version);
  const subversion = useStratSyncStore((state) => state.strategyData.subversion);
  const clearOtherSessions = useStratSyncStore((state) => state.clearOtherSessions);
  const { toast } = useToast();
  const t = useTranslations('StratPage.StratHeader.StratSettings');
  const tPatches = useTranslations('Common.FFXIVPatches');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1, t('NameError')),
    isPublic: z.boolean(),
    isEditable: z.boolean(),
    patch: z.string().regex(patchRegex),
    password: z
      .string()
      .regex(/^\d{8}$/, t('PasswordError'))
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      isPublic,
      isEditable,
      patch: `${version}.${subversion}`,
    },
  });

  const onSubmit = form.handleSubmit(async (values: z.infer<typeof formSchema>) => {
    const supabase = createClient();

    const response = await buildClientUpdateStrategyQuery(supabase, {
      id,
      name: values.name,
      is_public: values.isPublic,
      is_editable: values.isEditable,
      version: Number.parseInt(values.patch.split('.')[0]),
      subversion: Number.parseInt(values.patch.split('.')[1]),
      password:
        (values.isEditable || undefined) &&
        values.password &&
        (await bcrypt({
          password: await sha256(values.password ?? ''),
          salt: (await sha1(id.toString())).slice(0, 16),
          costFactor: 10,
        })),
    });

    const isRestrictiveChange =
      (isPublic && !values.isPublic) || (isEditable && !values.isEditable) || (values.isEditable && values.password);
    if (isRestrictiveChange) {
      clearOtherSessions();
    }

    if (response.error) {
      toast({
        description: t('Error'),
        variant: 'destructive',
      });
    } else {
      toast({
        description: t('Saved'),
      });
      form.resetField('password');
      setOpen(false);
    }
  });

  const deleteStrategy = () => {
    const supabase = createClient();

    (async () => {
      const response = await buildClientDeleteStrategyQuery(supabase, id);

      if (response.error) {
        toast({
          description: t('EDeleterror'),
          variant: 'destructive',
        });
      } else {
        toast({
          description: t('Deleted'),
        });

        router.push('/');
      }
    })();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only select-none">Settings</span>
          <GearIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Title')}</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={onSubmit}>
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Name')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Patch')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('PatchPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALL_PATCHES.toReversed().map(({ version, subversion }) => (
                        <SelectItem key={`select-patch-${version}.${subversion}`} value={`${version}.${subversion}`}>
                          {`${version}.${subversion}`} - {tPatches(`${version}.${subversion}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>{t('PatchDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Alert>
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>{t('AlertTitle')}</AlertTitle>
              <AlertDescription>{t('AlertDescription')}</AlertDescription>
            </Alert>
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <FormLabel>{t('isPublic')}</FormLabel>
                      <FormDescription>{t('isPublicDescription')}</FormDescription>
                      <FormMessage />
                    </div>

                    <FormControl>
                      <Switch className="my-0" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isEditable"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <FormLabel>{t('isEditable')}</FormLabel>
                      <FormDescription>{t('isEditableDescription')}</FormDescription>
                      <FormMessage />
                    </div>

                    <FormControl>
                      <Switch className="my-0" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={!form.getValues('isEditable')?.valueOf()}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Password')}</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
          <DialogFooter>
            <div className="flex flex-row justify-between w-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" className="text-muted-foreground text-xs my-auto font-regular p-0">
                    {t('DeleteStrategy')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('DeleteConfirmationTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('DeleteConfirmationDescription')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteStrategy}>
                      {t('Delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit">{t('Save')}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
