'use server';

import { ModeToggle } from '@/components/ModeToggle';
import { SignInButton } from '@/components/auth/SignInButton';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type React from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import { SearchButton } from './SearchButton';
import { BrandIdentity } from '@/components/icons/BrandIdentity';

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
          <BrandIdentity variant='text' className='fill-primary h-11' />
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
