'use server';

import { buildStrategyCountQuery } from '@/lib/queries/server';
import { createClient } from '@/lib/supabase/server';
import { PAGINATION_OFFSET, PAGINATION_TOTAL_PAGE, type Version } from '@/lib/utils';
import type React from 'react';
import { ViewPagination } from '../../components/ViewPagination';

type BoardPaginationProps = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    raid?: string;
    version?: Version;
    currentPage: number;
    limit: number;
  }
>;
export const BoardPagination: React.FC<BoardPaginationProps> = ({
  raid,
  version,
  currentPage,
  limit,
  className,
  ...props
}) => {
  const supabase = createClient();

  const fetchData = async () => {
    const { count: strategyCount, error: strategyCountQueryError } = await buildStrategyCountQuery(supabase, {
      raid,
      version,
    });
    if (strategyCountQueryError || strategyCount === null) throw strategyCountQueryError;

    const maxPage = Math.floor((strategyCount - 1) / limit) + 1;

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

  return (
    <ViewPagination
      dataPromise={fetchData()}
      currentPage={currentPage}
      limit={limit}
      className={className}
      {...props}
    />
  );
};
