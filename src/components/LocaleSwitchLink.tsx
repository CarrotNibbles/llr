'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type LocaleSwitchLinkProps = Readonly<
  Omit<React.ComponentProps<typeof Link>, 'href'> & {
    locale: string;
  }
>;

export function LocaleSwitchLink({
  className,
  locale,
  children,
  onClick,
  ...props
}: { className?: string } & LocaleSwitchLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rest = pathname.split('/').slice(2);
  const newPathname = ['', locale, ...rest].join('/');
  const searchParamsAsString = new URLSearchParams(searchParams).toString();

  return (
    <Link
      {...props}
      href={`${newPathname}?${searchParamsAsString}`}
      onClick={(arg) => {
        if (onClick) onClick(arg);

        router.refresh();
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
