'use client';

import { ModeToggle } from '@/components/ModeToggle';
import { Icons } from '@/components/icons';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/use-toast';
import { useEstimations } from '@/lib/calc/hooks';
import type { Enums } from '@/lib/database.types';
import { buildClientUpdateStrategyQuery } from '@/lib/queries/client';
import { useFilterState } from '@/lib/states';
import { createClient } from '@/lib/supabase/client';
import { ALL_PATCHES, GIMMICK_BACKGROUND_STYLE, cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import {
  ExclamationTriangleIcon,
  GearIcon,
  HeartFilledIcon,
  HeartIcon,
  LockClosedIcon,
  LockOpen2Icon,
  Share1Icon,
  ZoomInIcon,
} from '@radix-ui/react-icons';
import { bcrypt, sha1, sha256 } from 'hash-wasm';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ZoomSlider } from './ZoomSlider';

const FilterMenu = () => {
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

const StratInfo = () => {
  const { name, raids, version, subversion, strategy_players } = useStratSyncStore((state) => state.strategyData);
  const estimations = useEstimations();
  const t = useTranslations('StratPage.StratHeader.StratInfo');
  const tRaids = useTranslations('Common.Raids');
  const tPatches = useTranslations('Common.FFXIVPatches');

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

const StratSettings = () => {
  const {
    id,
    name,
    is_public: isPublic,
    is_editable: isEditable,
    version,
    subversion,
  } = useStratSyncStore((state) => state.strategyData);
  const { clearOtherSessions } = useStratSyncStore((state) => state);
  const { toast } = useToast();
  const t = useTranslations('StratPage.StratHeader.StratSettings');
  const tPatches = useTranslations('Common.FFXIVPatches');
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1),
    isPublic: z.boolean(),
    isEditable: z.boolean(),
    patch: z.string().regex(/^[234567]\.[012345]$/),
    password: z
      .string()
      .regex(/^\d{8}$/)
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
      setOpen(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Settings</span>
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
                      {ALL_PATCHES.map(({ version, subversion }) => (
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
              <Button variant="link" className="text-muted-foreground text-xs my-auto font-regular p-0">
                {t('DeleteStrategy')}
              </Button>
              <Button type="submit">{t('Save')}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AuthenticatedLikeButton = () => {
  const { toast } = useToast();
  const {
    userId,
    strategyData: { like_counts, user_likes, id },
  } = useStratSyncStore((state) => state);

  const t = useTranslations('StratPage.StratHeader.LikeButton');

  const likes = like_counts?.total_likes ?? 0;
  const Icon = (user_likes?.length ?? 0) > 0 ? HeartFilledIcon : HeartIcon;

  const handleLikeButtonClick = async () => {
    if (!userId) return;

    const supabase = createClient();

    if ((user_likes?.length ?? 0) > 0) {
      const response = await supabase.from('user_likes').delete().eq('liked_by', userId);

      if (response.error) {
        toast({ variant: 'destructive', description: t('Error') });
        return;
      }

      toast({ description: t('Unliked') });
    } else {
      const response = await supabase.from('user_likes').insert({ liked_by: userId, strategy: id });

      if (response.error) {
        toast({ variant: 'destructive', description: t('Error') });
        return;
      }

      toast({ description: t('Liked') });
    }
  };

  return (
    <Button onClick={handleLikeButtonClick}>
      <Icon className="mr-2" />
      {likes}
    </Button>
  );
};

const AnonymousLikeButton = () => {
  const {
    strategy,
    strategyData: { like_counts, user_likes },
  } = useStratSyncStore((state) => state);
  const { toast } = useToast();

  const supabase = createClient();

  const turnstileRef = useRef<TurnstileInstance>(null);
  const [likeRequested, setLikeRequested] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [turnstileStatus, setTurnstileStatus] = useState<'success' | 'error' | 'expired' | 'required' | 'loading'>(
    'loading',
  );

  const [open, setOpen] = useState(false);

  const t = useTranslations('StratPage.StratHeader.LikeButton');

  const likes = like_counts?.total_likes ?? 0;

  useEffect(() => {
    if (likeRequested && turnstileStatus === 'success' && token) {
      (async () => {
        try {
          const response = await supabase.functions.invoke('anonymous-like', {
            body: {
              strategy,
              token,
            },
          });

          if (response.error) {
            toast({ variant: 'destructive', description: t('Error') });
          } else {
            const message = response.data as string;

            if (message === 'SUCCESS') {
              toast({ description: t('Liked') });
            } else if (message === 'ERROR_CAPTCHA_FAILED') {
              toast({ variant: 'destructive', description: t('CaptchaFailed') });
            } else if (message === 'ERROR_STRATEGY_NOT_FOUND') {
              toast({ variant: 'destructive', description: t('StrategyNotFound') });
            } else if (message === 'ERROR_ALREADY_LIKED') {
              toast({ variant: 'destructive', description: t('AlreadyLiked') });
            }
          }
        } catch (e) {
          toast({ variant: 'destructive', description: t('Error') });
        } finally {
          setLikeRequested(false);
        }
      })();
    }
  }, [likeRequested, turnstileStatus, strategy, supabase, t, toast, token]);

  useEffect(() => {
    if (open && turnstileStatus !== 'required' && turnstileStatus !== 'loading') {
      setOpen(false);
    }
  }, [open, turnstileStatus]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setLikeRequested(true);
            setOpen(true);
          }}
        >
          <HeartIcon className="mr-2" />
          {likes}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('CaptchaHeading')}</DialogTitle>
        </DialogHeader>

        <div className="mx-auto my-4">
          <p
            className="text-center text-sm text-muted-foreground"
            style={turnstileStatus !== 'loading' ? { display: 'none' } : {}}
          >
            {t('CaptchaLoading')}
          </p>
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY ?? ''}
            onWidgetLoad={() => setTurnstileStatus('required')}
            onError={() => setTurnstileStatus('error')}
            onExpire={() => setTurnstileStatus('expired')}
            onSuccess={(token) => {
              setTurnstileStatus('success');
              setToken(token);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StratHeader = React.forwardRef<HTMLDivElement, { className?: string } & React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const { toast } = useToast();

    const {
      userId,
      elevatable,
      isAuthor,
      strategyData: { raids },
    } = useStratSyncStore((state) => state);
    const t = useTranslations('StratPage.StratHeader');
    const tRaids = useTranslations('Common.Raids');

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
          {elevatable && <ElevationDialog />}
          {isAuthor && <StratSettings />}
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
          <FilterMenu />
          <ModeToggle />
        </div>
        {userId ? <AuthenticatedLikeButton /> : <AnonymousLikeButton />}
      </div>
    );
  },
);

StratHeader.displayName = 'StratHeader';

export { StratHeader };
