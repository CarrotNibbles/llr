'use server';

import { ThemeToggle } from '@/components/ThemeToggle';
import { SignInButton } from '@/components/auth/SignInButton';
import { BrandIdentity } from '@/components/icons/BrandIdentity';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type React from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import { SearchButton } from './SearchButton';

type ViewHeaderProps = Readonly<React.HTMLAttributes<HTMLDivElement> & {}>;

const ViewHeader = async ({ className, ...props }: { className?: string } & ViewHeaderProps) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      className={cn('rounded-none min-w-full border-b flex py-2 h-16 items-center justify-center', className)}
      {...props}
    >
      <div className="w-full max-w-screen-xl px-6 flex items-center">
        <Link href="/" className="flex items-end gap-x-3">
          <BrandIdentity variant="text" className="fill-primary h-11" />
        </Link>
        <div className="flex-grow" />
        <div className="flex">
          <SearchButton className="mr-3" />
          <ThemeToggle className="mr-5" />
          {user === null ? <SignInButton /> : <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};
ViewHeader.displayName = 'ViewHeader';

export { ViewHeader };
