'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { buildURL, cn, PAGINATION_OFFSET, PAGINATION_TOTAL_PAGE, rangeInclusive } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import React from 'react';

type BoardPaginationProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    currentPage: number;
    maxPage: number;
  }
>;

export const BoardPagination = React.forwardRef<HTMLDivElement, BoardPaginationProps>(
  ({ currentPage, maxPage, className, ...props }, ref) => {
    const searchParams = useSearchParams();
    const buildUrlWithPage = (page: number) => buildURL('/board', searchParams, { page });

    const pageStart = Math.max(
      currentPage + PAGINATION_OFFSET <= maxPage
        ? currentPage - PAGINATION_OFFSET
        : maxPage - PAGINATION_TOTAL_PAGE + 1,
      1,
    );
    const pageEnd = Math.min(
      currentPage - PAGINATION_OFFSET >= 1 ? currentPage + PAGINATION_OFFSET : PAGINATION_TOTAL_PAGE,
      maxPage,
    );

    return (
      <Pagination className={className} {...props} ref={ref}>
        <PaginationContent>
          <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={cn('gap-1 pr-2.5', currentPage === 1 ? 'invisible' : 'visible  ')}
            href={buildUrlWithPage(currentPage - 1)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </PaginationLink>
          {rangeInclusive(pageStart, pageEnd).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href={buildUrlWithPage(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink
              aria-label="Go to next page"
              size="default"
              className={cn('gap-1 pr-2.5', currentPage === maxPage ? 'invisible' : 'visible  ')}
              href={buildUrlWithPage(currentPage + 1)}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
);
