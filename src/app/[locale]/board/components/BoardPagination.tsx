'use server';

import { type ButtonProps, buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { buildStrategyCountQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_LIMIT, PAGINATION_OFFSET, PAGINATION_TOTAL_PAGE, buildURL, cn, rangeInclusive } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import type Link from 'next/link';
import { redirect } from 'next/navigation';
import type React from 'react';
import { Suspense } from 'react';
import { BoardLink } from './BoardLink';

type BoardPaginationProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    currentPage: number;
    limit: number;
  }
>;

export const BoardPagination: React.FC<BoardPaginationProps> = ({ currentPage, limit, className, ...props }) => {
  const supabase = createClient();

  const fetchData = async () => {
    const { count: strategyCount, error: strategyCountQueryError } = await buildStrategyCountQuery(supabase);
    if (strategyCountQueryError || strategyCount === null) throw strategyCountQueryError;

    const maxPage = Math.floor((strategyCount - 1) / limit) + 1;
    if (currentPage > maxPage) redirect(buildURL('/board', { page: maxPage, limit: DEFAULT_LIMIT }));

    const startPage = Math.max(
      currentPage + PAGINATION_OFFSET <= maxPage
        ? currentPage - PAGINATION_OFFSET
        : maxPage - PAGINATION_TOTAL_PAGE + 1,
      1,
    );
    const endPage = Math.min(
      currentPage - PAGINATION_OFFSET >= 1 ? currentPage + PAGINATION_OFFSET : PAGINATION_TOTAL_PAGE,
      maxPage,
    );

    return {
      startPage,
      endPage,
      maxPage,
    };
  };

  const fetchDefaultData = async () => {
    const startPage = Math.max(currentPage - PAGINATION_OFFSET, 1);
    const endPage = currentPage - PAGINATION_OFFSET >= 1 ? currentPage + PAGINATION_OFFSET : PAGINATION_TOTAL_PAGE;

    return {
      startPage,
      endPage,
      maxPage: Number.MAX_SAFE_INTEGER,
    };
  };

  return (
    <Suspense
      fallback={
        <BoardPaginationContent
          dataPromise={fetchDefaultData()}
          currentPage={currentPage}
          className={className}
          {...props}
        />
      }
    >
      <BoardPaginationContent dataPromise={fetchData()} currentPage={currentPage} className={className} {...props} />
    </Suspense>
  );
};

type BoardPaginationContentData = Readonly<{
  startPage: number;
  endPage: number;
  maxPage: number;
}>;
type BoardPaginationContentProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    currentPage: number;
    dataPromise?: Promise<BoardPaginationContentData>;
  }
>;

const BOARD_PAGINATION_CONTENT_DEFAULT_DATA: BoardPaginationContentData = {
  startPage: 1,
  endPage: PAGINATION_TOTAL_PAGE,
  maxPage: Number.MAX_SAFE_INTEGER,
};
const BoardPaginationContent: React.FC<BoardPaginationContentProps> = async ({
  currentPage,
  dataPromise,
  className,
  ...props
}) => {
  const { startPage, endPage, maxPage } = (await dataPromise) ?? BOARD_PAGINATION_CONTENT_DEFAULT_DATA;

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        <PaginationItem>
          <BoardPaginationPrevious
            page={currentPage - 1}
            className={cn('gap-1 pr-2.5', currentPage === 0 ? 'invisible' : 'visible  ')}
          />
        </PaginationItem>
        {rangeInclusive(startPage, endPage).map((page) => (
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
