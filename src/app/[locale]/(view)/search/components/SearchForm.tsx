'use server'

import type { buildRaidsDataQuery } from '@/lib/queries/server';
import { ClientSearchForm } from './ClientSearchForm';
import { Suspense } from 'react';

type SearchFormData = Awaited<ReturnType<typeof buildRaidsDataQuery>>;
type SearchFormProps = Readonly<
  Omit<React.ComponentProps<'form'>, 'onSubmit'> & { q: string; dataPromise: Promise<SearchFormData> }
>;

export const SearchForm: React.FC<SearchFormProps> = ({ q, dataPromise, className, ...props }) => (
  <Suspense fallback={<SearchFormContent q={q} />}>
    <SearchFormContent q={q} dataPromise={dataPromise} className={className} {...props} />
  </Suspense>
);

const DEFAULT_RAIDS_DATA = { data: [], error: null };
type SearchFormContentProps = Readonly<
  Omit<React.ComponentProps<'form'>, 'onSubmit'> & { q: string; dataPromise?: Promise<SearchFormData> }
>;
const SearchFormContent: React.FC<SearchFormContentProps> = async ({ q, dataPromise, className, ...props }) => {
  const { data: raidsData, error } = (await dataPromise) ?? DEFAULT_RAIDS_DATA;
  if (raidsData === null || error) throw error;

  return <ClientSearchForm q={q} raidsData={raidsData} className={className} {...props}/>
};
