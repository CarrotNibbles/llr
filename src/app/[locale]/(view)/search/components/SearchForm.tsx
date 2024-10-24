'use server';

import type { buildRaidsDataQuery } from '@/lib/queries/server';
import { ClientSearchForm } from './ClientSearchForm';
import { Suspense } from 'react';
import type { Patch, SelectableJob } from '@/lib/utils';

type SearchFormData = Awaited<ReturnType<typeof buildRaidsDataQuery>>;
type SearchFormProps = Readonly<
  Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
    q?: string;
    raid?: string;
    patch?: Patch;
    jobs?: SelectableJob[];
    dataPromise: Promise<SearchFormData>;
  }
>;

const SearchForm: React.FC<SearchFormProps> = ({ q, raid, patch, jobs, dataPromise, className, ...props }) => (
  <Suspense fallback={<SearchFormContent q={q} raid={raid} patch={patch} jobs={jobs} />}>
    <SearchFormContent
      q={q}
      raid={raid}
      patch={patch}
      jobs={jobs}
      dataPromise={dataPromise}
      className={className}
      {...props}
    />
  </Suspense>
);
SearchForm.displayName = 'SearchForm';

const DEFAULT_RAIDS_DATA = { data: [], error: null };
type SearchFormContentProps = Readonly<
  Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
    q?: string;
    raid?: string;
    patch?: Patch;
    jobs?: SelectableJob[];
    dataPromise?: Promise<SearchFormData>;
  }
>;
const SearchFormContent: React.FC<SearchFormContentProps> = async ({
  q,
  raid,
  patch,
  jobs,
  dataPromise,
  className,
  ...props
}) => {
  const { data: raidsData, error } = (await dataPromise) ?? DEFAULT_RAIDS_DATA;
  if (raidsData === null || error) throw error;

  return (
    <ClientSearchForm
      q={q}
      raid={raid}
      patch={patch}
      jobs={jobs}
      raidsData={raidsData}
      className={className}
      {...props}
    />
  );
};
SearchFormContent.displayName = 'SearchFormContent';

export { SearchForm };
