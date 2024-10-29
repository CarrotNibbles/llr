'use server';

import { SignOutButton } from '@/components/auth/SignOutButton';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileTextIcon, HeartIcon, PersonIcon } from '@radix-ui/react-icons';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type React from 'react';

type ProfileDropdownProps = Readonly<ButtonProps & {}>;

const ProfileDropdown: React.FC<ProfileDropdownProps> = async ({ className, ...props }) => {
  const t = await getTranslations("ViewPage.ProfileDropdown")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className} {...props}>
          <span className="sr-only">Profile</span>
          <PersonIcon className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-4 flex flex-col items-end gap-y-1" align="end" sideOffset={8}>
        <DropdownMenuItem className="w-full p-0">
          <Link href="/" passHref className="w-full text-sm font-bold text-center">
            <Button variant="ghost" className="flex w-full px-4 py-1">
              <FileTextIcon />
              <div className="flex-grow min-w-8" />
              <div>{t("MyStrats")}</div>
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="w-full p-0">
          <Link href="/" passHref className="w-full text-sm font-bold text-center">
            <Button variant="ghost" className="flex w-full px-4 py-1">
              <HeartIcon />
              <div className="flex-grow min-w-8" />
              <div>{t("LikedStrats")}</div>
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="w-full" />
        <DropdownMenuItem className="p-0">
          <SignOutButton variant="ghost" className="px-4 py-1" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
ProfileDropdown.displayName = 'ProfileDropdown';

export { ProfileDropdown };
