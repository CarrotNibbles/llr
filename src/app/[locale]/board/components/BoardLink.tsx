'use client';

import { LIMIT_PARAM, PAGE_PARAM, buildURL } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type React from 'react';

type BoardLinkProps = Readonly<
  Omit<React.ComponentProps<typeof Link>, 'href'> & {
    page?: number;
    limit?: number;
  }
>;

const BoardLink: React.FC<BoardLinkProps> = ({ page, limit, className, ...props }) => {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get(PAGE_PARAM);
  const limitParam = searchParams.get(LIMIT_PARAM);

  return (
    <Link
      className={className}
      href={buildURL('/board', searchParams, { page: page ?? pageParam, limit: limit ?? limitParam })}
      {...props}
    />
  );
};
BoardLink.displayName = 'BoardLink';

export { BoardLink };
