'use client';

import type { NullablePartial } from '@/lib/utils/types';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type React from 'react';
import { LIMIT_PARAM, PAGE_PARAM, PATCH_PARAM, Q_PARAM, RAID_PARAM, SORT_PARAM } from '../utils/constants';
import { buildURL } from '../utils/helpers';
import type { SearchSearchParamsParsed } from '../utils/types';

type ViewLinkProps = Readonly<
  Omit<React.ComponentProps<typeof Link>, 'href'> & NullablePartial<SearchSearchParamsParsed>
>;

const ViewLink: React.FC<ViewLinkProps> = ({ raid, patch, page, limit, sort, q, className, children, ...props }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Link
      className={className}
      href={buildURL(pathname, {
        raid: raid === null ? undefined : (raid ?? searchParams.get(RAID_PARAM)),
        patch: patch === null ? undefined : (patch ?? searchParams.get(PATCH_PARAM)),
        page: page === null ? undefined : (page ?? searchParams.get(PAGE_PARAM)),
        limit: limit === null ? undefined : (limit ?? searchParams.get(LIMIT_PARAM)),
        sort: sort === null ? undefined : (sort ?? searchParams.get(SORT_PARAM)),
        q: q === null ? undefined : (q ?? searchParams.get(Q_PARAM)),
      })}
      {...props}
    >
      {children}
    </Link>
  );
};
ViewLink.displayName = 'ViewLink';

export { ViewLink };
