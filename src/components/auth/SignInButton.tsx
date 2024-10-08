'use client';

import { discordSignIn } from '@/lib/auth/action';
import type React from 'react';
import { useState } from 'react';
import { Icons } from '../icons';
import { Button, type ButtonProps } from '../ui/button';

type SignInButtonProps = ButtonProps & {};

export const SignInButton: React.FC<SignInButtonProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onDiscordSubmit() {
    setIsLoading(true);
    await discordSignIn();
    setIsLoading(false);
  }

  return (
    <Button className={className} type="button" disabled={isLoading} onClick={onDiscordSubmit} {...props}>
      {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.discord className="mr-2 h-4 w-4" />}{' '}
      Sign In
    </Button>
  );
};
