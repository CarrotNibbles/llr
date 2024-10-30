'use server';

import { type ButtonProps, buttonVariants } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import type { buildMaxPageQuery } from '@/lib/queries/server';
import { PAGINATION_OFFSET, PAGINATION_TOTAL_PAGE, cn, rangeInclusive } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import type Link from 'next/link';
import type React from 'react';
import { Suspense } from 'react';
import { ViewLink } from './ViewLink';

type ViewPaginationData = Awaited<ReturnType<typeof buildMaxPageQuery>>;
type ViewPaginationProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    currentPage: number;
    dataPromise: Promise<ViewPaginationData>;
  }
>;

const ViewPagination: React.FC<ViewPaginationProps> = ({ dataPromise, currentPage, className, ...props }) => {
  return (
    <Suspense fallback={<ViewPaginationContent currentPage={currentPage} className={className} {...props} />}>
      <ViewPaginationContent dataPromise={dataPromise} currentPage={currentPage} className={className} {...props} />
    </Suspense>
  );
};
ViewPagination.displayName = 'ViewPagination';

type ViewPaginationContentProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    currentPage: number;
    dataPromise?: Promise<ViewPaginationData>;
  }
>;

const VIEW_PAGINATION_CONTENT_DEFAULT_DATA: ViewPaginationData = {
  data: 1,
  error: null,
};
const ViewPaginationContent: React.FC<ViewPaginationContentProps> = async ({
  currentPage,
  dataPromise,
  className,
  ...props
}) => {
  const { data: maxPage, error } = (await dataPromise) ?? VIEW_PAGINATION_CONTENT_DEFAULT_DATA;

  if (maxPage === null || error) throw error;

  const startPage = Math.max(
    currentPage + PAGINATION_OFFSET <= maxPage ? currentPage - PAGINATION_OFFSET : maxPage - PAGINATION_TOTAL_PAGE + 1,
    1,
  );
  const endPage = Math.min(
    currentPage - PAGINATION_OFFSET >= 1 ? currentPage + PAGINATION_OFFSET : PAGINATION_TOTAL_PAGE,
    maxPage,
  );

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        <PaginationItem>
          <ViewPaginationPrevious
            page={currentPage - 1}
            className={cn(currentPage === 1 ? 'invisible' : 'visible  ')}
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
            className={cn(currentPage === maxPage ? 'invisible' : 'visible  ')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
ViewPaginationContent.displayName = 'ViewPaginationContent';

type PaginationLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  isActive?: boolean;
  page: number;
} & Pick<ButtonProps, 'size'>;

const ViewPaginationLink: React.FC<PaginationLinkProps> = ({ page, className, isActive, size = 'icon', ...props }) => {
  return (
    <ViewLink
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        'rounded-none',
        className,
      )}
      page={page}
      {...props}
    />
  );
};
ViewPaginationLink.displayName = 'ViewPaginationLink';

const ViewPaginationPrevious: React.FC<PaginationLinkProps> = ({ className, ...props }) => (
  <ViewPaginationLink
    aria-label="Go to previous page"
    className={cn('flex items-center justify-center p-0', className)}
    {...props}
  >
    <ChevronLeftIcon />
  </ViewPaginationLink>
);
ViewPaginationPrevious.displayName = 'ViewPaginationPrevious';

const ViewPaginationNext: React.FC<PaginationLinkProps> = ({ className, ...props }) => (
  <ViewPaginationLink
    aria-label="Go to next page"
    className={cn('flex items-center justify-center p-0', className)}
    {...props}
  >
    <ChevronRightIcon />
  </ViewPaginationLink>
);
ViewPaginationNext.displayName = 'ViewPaginationNext';

export { ViewPagination };
