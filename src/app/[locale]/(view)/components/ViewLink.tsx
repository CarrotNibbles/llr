'use client';

import { type SearchSearchParamsParsed, buildURL } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type React from 'react';

type ViewLinkProps = Readonly<Omit<React.ComponentProps<typeof Link>, 'href'> & Partial<SearchSearchParamsParsed>>;

const ViewLink: React.FC<ViewLinkProps> = ({ q, page, limit, sort, className, ...props }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return <Link className={className} href={buildURL(pathname, searchParams, { page, limit, sort })} {...props} />;
};
ViewLink.displayName = 'BoardLink';

export { ViewLink };
