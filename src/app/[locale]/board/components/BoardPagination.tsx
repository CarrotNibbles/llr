'use server';

import { type ButtonProps, buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { PAGINATION_OFFSET, PAGINATION_TOTAL_PAGE, cn, rangeInclusive } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import type Link from 'next/link';
import type React from 'react';
import { BoardLink } from './BoardLink';

type BoardPaginationProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    currentPage: number;
    maxPage: number;
  }
>;

export const BoardPagination: React.FC<BoardPaginationProps> = ({ currentPage, maxPage, className, ...props }, ref) => {
  const pageStart = Math.max(
    currentPage + PAGINATION_OFFSET <= maxPage ? currentPage - PAGINATION_OFFSET : maxPage - PAGINATION_TOTAL_PAGE + 1,
    1,
  );
  const pageEnd = Math.min(
    currentPage - PAGINATION_OFFSET >= 1 ? currentPage + PAGINATION_OFFSET : PAGINATION_TOTAL_PAGE,
    maxPage,
  );

  return (
    <Pagination className={className} {...props} ref={ref}>
      <PaginationContent>
        <PaginationItem>
          <BoardPaginationPrevious
            page={currentPage - 1}
            className={cn('gap-1 pr-2.5', currentPage === maxPage ? 'invisible' : 'visible  ')}
          />
        </PaginationItem>
        {rangeInclusive(pageStart, pageEnd).map((page) => (
          <PaginationItem key={page}>
            <BoardPaginationLink page={page} isActive={page === currentPage}>
              {page}
            </BoardPaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <BoardPaginationNext
            page={currentPage + 1}
            className={cn('gap-1 pr-2.5', currentPage === maxPage ? 'invisible' : 'visible  ')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

type PaginationLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  isActive?: boolean;
  page: number;
} & Pick<ButtonProps, 'size'>;

const BoardPaginationLink: React.FC<PaginationLinkProps> = ({ page, className, isActive, size = 'icon', ...props }) => {
  return (
    <BoardLink
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className,
      )}
      page={page}
      {...props}
    />
  );
};

BoardPaginationLink.displayName = 'BoardPaginationLink';

const BoardPaginationPrevious: React.FC<PaginationLinkProps> = ({ className, ...props }) => (
  <BoardPaginationLink aria-label="Go to previous page" size="default" className={cn('pl-2.5', className)} {...props}>
    <ChevronLeftIcon className="h-4 w-4" />
  </BoardPaginationLink>
);
BoardPaginationPrevious.displayName = 'BoardPaginationPrevious';

const BoardPaginationNext: React.FC<PaginationLinkProps> = ({ className, ...props }) => (
  <BoardPaginationLink aria-label="Go to next page" size="default" className={cn('pr-2.5', className)} {...props}>
    <ChevronRightIcon className="h-4 w-4" />
  </BoardPaginationLink>
);
BoardPaginationNext.displayName = 'BoardPaginationNext';
