'use client';

import { type SearchSearchParamsParsed, buildURL } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type React from 'react';

type BoardLinkProps = Readonly<Omit<React.ComponentProps<typeof Link>, 'href'> & SearchSearchParamsParsed>;

const BoardLink: React.FC<BoardLinkProps> = ({ q, page, limit, className, ...props }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return <Link className={className} href={buildURL(pathname, searchParams, { page, limit })} {...props} />;
};
BoardLink.displayName = 'BoardLink';

export { BoardLink };
