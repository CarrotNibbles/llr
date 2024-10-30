'use client';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockClosedIcon, LockOpen2Icon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const ElevationDialog = () => {
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
            <span className="sr-only select-none">Strategy unlocked</span>
            <LockOpen2Icon />
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <span className="sr-only select-none">Unlock this strategy</span>
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
