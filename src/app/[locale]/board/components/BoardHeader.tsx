'use server';

import { SignInButton } from '@/components/auth/SignInButton';
import { Icons } from '@/components/icons';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import { StarFilledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type React from 'react';
import { ProfilePopover } from './ProfilePopover';

type BoardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {};

export const BoardHeader: React.FC<BoardHeaderProps> = async ({ className, ...props }, ref) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-none min-w-full border-b flex space-x-4 py-2 px-4 h-15 items-center justify-center',
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-screen-xl flex items-center">
        <Link href="/" className="flex items-end gap-x-3">
          <StarFilledIcon className="mr h-7 w-7" />
          <div className="text-xl font-extrabold">Live, Laugh, Raid</div>
        </Link>
        <div className="text-xs font-extralight self-end">or something idkwhatitwasok</div>
        <div className="flex-grow" />
        {user === null ? <SignInButton /> : <ProfilePopover />}
      </div>
    </div>
  );
};
