import { SignOutButton } from '@/components/auth/SignOutButton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';
import { FaceIcon, FileTextIcon, HeartIcon, Pencil2Icon, PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type React from 'react';

type ProfilePopoverProps = React.HTMLAttributes<HTMLDivElement> & {};

export const ProfilePopover: React.FC<ProfilePopoverProps> = async ({ className, ...props }) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Profile</span>
          <PersonIcon className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="end" sideOffset={8}>
        <div className="flex flex-col items-end gap-y-1">
            <Link href="/" passHref className="w-full text-sm font-bold text-center">
              <Button variant="ghost" className="flex w-full px-2 py-1">
                <FileTextIcon />
                <div className="flex-grow min-w-8" />
                <div>My Strats</div>
              </Button>
            </Link>
            <Link href="/" passHref className="w-full text-sm font-bold text-center">
              <Button variant="ghost" className="flex w-full px-2 py-1">
                <HeartIcon />
                <div className="flex-grow min-w-8" />
                <div>Liked Strats</div>
              </Button>
            </Link>
          <Separator />
          <SignOutButton variant="ghost" className="px-2 py-1" />
        </div>
      </PopoverContent>
    </Popover>
  );
};
