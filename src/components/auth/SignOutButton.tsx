'use client';

import { signOut } from '@/lib/auth/action';
import type React from 'react';
import { useState } from 'react';
import { MiscIcons } from '../icons/MiscIcons';
import { Button, type ButtonProps } from '../ui/button';
import { useTranslations } from 'next-intl';

type SignOutButtonProps = ButtonProps & {};

export const SignOutButton: React.FC<SignOutButtonProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("Auth")

  async function onDiscordSubmit() {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  }

  return (
    <Button className={className} type="button" disabled={isLoading} onClick={onDiscordSubmit} {...props}>
      {isLoading && (
        <>
          <MiscIcons.spinner className="mr-2 h-4 w-4 animate-spin" />{' '}
        </>
      )}
      {t("SignOut")}
    </Button>
  );
};
