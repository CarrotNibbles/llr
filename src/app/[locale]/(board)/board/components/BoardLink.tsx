'use client';

import { type BoardSearchParamsParsed, LIMIT_PARAM, PAGE_PARAM, buildBoardURL } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type React from 'react';

type BoardLinkProps = Readonly<Omit<React.ComponentProps<typeof Link>, 'href'> & BoardSearchParamsParsed>;

const BoardLink: React.FC<BoardLinkProps> = ({ page, limit, className, ...props }) => {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get(PAGE_PARAM);
  const limitParam = searchParams.get(LIMIT_PARAM);

  return <Link className={className} href={buildBoardURL(searchParams, { page, limit })} {...props} />;
};
BoardLink.displayName = 'BoardLink';

export { BoardLink };
