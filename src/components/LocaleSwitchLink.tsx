'use client';

import { useRouter } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

type LocaleSwitchLinkProps = Readonly<
  React.HTMLAttributes<HTMLSpanElement> & {
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
  const newPathname = ['', ...rest].join('/');
  const searchParamsAsString = new URLSearchParams(searchParams).toString();

  return (
    <span
      {...props}
      onClick={(arg) => {
        if (onClick) onClick(arg);

        router.replace(`${newPathname}?${searchParamsAsString}`, { locale: locale });
      }}
      className={cn(className, 'cursor-pointer')}
    >
      {children}
    </span>
  );
}
