'use server';

import { SignInButton } from '@/components/auth/SignInButton';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Icons } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type React from 'react';

type BoardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {};

export const BoardHeader: React.FC<BoardHeaderProps> = async ({ className, ...props }, ref) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      ref={ref}
      className={cn('rounded-none min-w-full border-b flex space-x-4 py-2 px-4 items-center justify-center', className)}
      {...props}
    >
      <div className="w-full max-w-screen-xl flex items-center">
        <Icons.ffxiv className="mr h-8 w-8" />
        <div className="flex-grow" />
        {user === null ? <SignInButton /> : <SignOutButton />}
      </div>
    </div>
  );
};
