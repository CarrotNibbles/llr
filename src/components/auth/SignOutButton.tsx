'use client';

import { signOut } from '@/lib/auth/action';
import type React from 'react';
import { useState } from 'react';
import { Icons } from '../icons';
import { Button, type ButtonProps } from '../ui/button';

type SignOutButtonProps = ButtonProps & {};

export const SignOutButton: React.FC<SignOutButtonProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onDiscordSubmit() {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  }

  return (
    <Button className={className} type="button" disabled={isLoading} onClick={onDiscordSubmit} {...props}>
      {isLoading && (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{' '}
        </>
      )}
      Sign Out
    </Button>
  );
};
