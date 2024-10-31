'use server';

import { ModeToggle } from '@/components/ModeToggle';
import { SignInButton } from '@/components/auth/SignInButton';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import { StarFilledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type React from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import { SearchButton } from './SearchButton';

type ViewHeaderProps = Readonly<React.HTMLAttributes<HTMLDivElement> & {}>;

const ViewHeader: React.FC<ViewHeaderProps> = async ({ className, ...props }, ref) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      ref={ref}
      className={cn('rounded-none min-w-full border-b flex py-2 h-16 items-center justify-center', className)}
      {...props}
    >
      <div className="w-full max-w-screen-xl px-6 flex items-center">
        <Link href="/" className="flex items-end gap-x-3">
          <StarFilledIcon className="mr h-7 w-7" />
          <div className="text-xl font-extrabold">
            <span className="hidden md:flex">Live, Laugh, Raid</span>
            <span className="md:hidden">LLR</span>
          </div>
        </Link>
        <div className="flex-grow" />
        <div className="flex">
          <SearchButton className="mr-3" />
          <ModeToggle className="mr-5" />
          {user === null ? <SignInButton /> : <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};
ViewHeader.displayName = 'ViewHeader';

export { ViewHeader };
