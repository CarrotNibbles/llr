'use client';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export const AuthenticatedLikeButton = () => {
  const { toast } = useToast();

  const userId = useStratSyncStore((state) => state.userId);
  const like_counts = useStratSyncStore((state) => state.strategyData.like_counts);
  const user_likes = useStratSyncStore((state) => state.strategyData.user_likes);
  const id = useStratSyncStore((state) => state.strategyData.id);

  const t = useTranslations('StratPage.StratHeader.LikeButton');

  const likes = like_counts?.total_likes ?? 0;
  const Icon = (user_likes?.length ?? 0) > 0 ? HeartFilledIcon : HeartIcon;

  const handleLikeButtonClick = async () => {
    if (!userId) return;

    const supabase = createClient();

    if ((user_likes?.length ?? 0) > 0) {
      const response = await supabase.from('user_likes').delete().eq('liked_by', userId).eq('strategy', id);

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

export const AnonymousLikeButton = () => {
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
