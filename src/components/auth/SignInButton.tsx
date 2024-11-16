'use client';

import { discordSignIn } from '@/lib/auth/action';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { useState } from 'react';
import { CustomIcons } from '../icons/CustomIcons';
import { Button, type ButtonProps } from '../ui/button';

type SignInButtonProps = ButtonProps & {};

export const SignInButton: React.FC<SignInButtonProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations('Auth');

  async function onDiscordSubmit() {
    setIsLoading(true);
    await discordSignIn();
    setIsLoading(false);
  }

  return (
    <Button className={className} type="button" disabled={isLoading} onClick={onDiscordSubmit} {...props}>
      {isLoading ? (
        <CustomIcons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CustomIcons.discord className="mr-2 h-4 w-4" />
      )}{' '}
      {t('SignIn')}
    </Button>
  );
};
