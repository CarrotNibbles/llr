'use server';

import { type ButtonProps, buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { buildStrategyCountQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { PAGINATION_OFFSET, PAGINATION_TOTAL_PAGE, cn, rangeInclusive } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import type Link from 'next/link';
import type React from 'react';
import { Suspense } from 'react';
import { BoardLink } from './ViewLink';

type ViewPaginationData = Readonly<{
  startPage: number;
  endPage: number;
  maxPage: number;
}>;
type ViewPaginationProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    currentPage: number;
    limit: number;
    dataPromise: Promise<ViewPaginationData>;
  }
>;

export const ViewPagination: React.FC<ViewPaginationProps> = ({
  dataPromise,
  currentPage,
  limit,
  className,
  ...props
}) => {
  const fetchDefaultData = async () => {
    const startPage = Math.max(currentPage - PAGINATION_OFFSET, 1);
    const endPage = currentPage - PAGINATION_OFFSET >= 1 ? currentPage + PAGINATION_OFFSET : PAGINATION_TOTAL_PAGE;

    return {
      startPage,
      endPage,
      maxPage: 1,
    };
  };

  return (
    <Suspense
      fallback={
        <ViewPaginationContent
          dataPromise={fetchDefaultData()}
          currentPage={currentPage}
          className={className}
          {...props}
        />
      }
    >
      <ViewPaginationContent dataPromise={dataPromise} currentPage={currentPage} className={className} {...props} />
    </Suspense>
  );
};

type ViewPaginationContentProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    currentPage: number;
    dataPromise?: Promise<ViewPaginationData>;
  }
>;

const VIEW_PAGINATION_CONTENT_DEFAULT_DATA: ViewPaginationData = {
  startPage: 1,
  endPage: PAGINATION_TOTAL_PAGE,
  maxPage: Number.MAX_SAFE_INTEGER,
};
const ViewPaginationContent: React.FC<ViewPaginationContentProps> = async ({
  currentPage,
  dataPromise,
  className,
  ...props
}) => {
  const { startPage, endPage, maxPage } = (await dataPromise) ?? VIEW_PAGINATION_CONTENT_DEFAULT_DATA;

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        <PaginationItem>
          <ViewPaginationPrevious
            page={currentPage - 1}
            className={cn('gap-1 pr-2.5', currentPage === 1 ? 'invisible' : 'visible  ')}
          />
        </PaginationItem>
        {rangeInclusive(startPage, endPage).map((page) => (
          <PaginationItem key={page}>
            <ViewPaginationLink page={page} isActive={page === currentPage}>
              {page}
            </ViewPaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <ViewPaginationNext
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

const ViewPaginationLink: React.FC<PaginationLinkProps> = ({ page, className, isActive, size = 'icon', ...props }) => {
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

ViewPaginationLink.displayName = 'ViewPaginationLink';

const ViewPaginationPrevious: React.FC<PaginationLinkProps> = ({ className, ...props }) => (
  <ViewPaginationLink aria-label="Go to previous page" size="default" className={cn('pl-2.5', className)} {...props}>
    <ChevronLeftIcon className="h-4 w-4" />
  </ViewPaginationLink>
);
ViewPaginationPrevious.displayName = 'ViewPaginationPrevious';

const ViewPaginationNext: React.FC<PaginationLinkProps> = ({ className, ...props }) => (
  <ViewPaginationLink aria-label="Go to next page" size="default" className={cn('pr-2.5', className)} {...props}>
    <ChevronRightIcon className="h-4 w-4" />
  </ViewPaginationLink>
);
ViewPaginationNext.displayName = 'ViewPaginationNext';
