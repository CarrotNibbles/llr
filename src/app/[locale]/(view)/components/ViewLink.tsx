'use client';

import {
  LIMIT_PARAM,
  PAGE_PARAM,
  PATCH_PARAM,
  Q_PARAM,
  RAID_PARAM,
  SORT_PARAM,
  type SearchSearchParamsParsed,
  buildURL,
} from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type React from 'react';

type ViewLinkProps = Readonly<Omit<React.ComponentProps<typeof Link>, 'href'> & Partial<SearchSearchParamsParsed>>;

const ViewLink: React.FC<ViewLinkProps> = ({ raid, patch, page, limit, sort, q, className, ...props }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Link
      className={className}
      href={buildURL(pathname, {
        raid: raid ?? searchParams.get(RAID_PARAM),
        patch: patch ?? searchParams.get(PATCH_PARAM),
        page: page ?? searchParams.get(PAGE_PARAM),
        limit: limit ?? searchParams.get(LIMIT_PARAM),
        sort: sort ?? searchParams.get(SORT_PARAM),
        q: q ?? searchParams.get(Q_PARAM),
      })}
      {...props}
    />
  );
};
ViewLink.displayName = 'ViewLink';

export { ViewLink };
