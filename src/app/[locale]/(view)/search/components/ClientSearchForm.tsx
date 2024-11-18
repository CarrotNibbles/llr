'use client';

import { JobIcon } from '@/components/icons/JobIcon';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RaidsDataType } from '@/lib/queries/server';
import { ALL_PATCHES, ALL_SELECTABLE_JOBS, PATCH_REGEX } from '@/lib/utils/constants';
import { cn, getRole } from '@/lib/utils/helpers';
import type { Patch } from '@/lib/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon, MagnifyingGlassIcon, ResetIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DEFAULT_LIMIT, DEFAULT_SORT } from '../../utils/constants';
import { buildSearchURL } from '../../utils/helpers';
import type { SelectableJob } from '../../utils/types';
import { JobToggleGroup } from './JobToggleGroup';

type ClientSearchFormProps = Readonly<
  Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
    q?: string;
    raid?: string;
    patch?: Patch;
    jobs?: SelectableJob[];
    raidsData: RaidsDataType;
  }
>;

const ClientSearchForm: React.FC<ClientSearchFormProps> = ({
  q,
  raid,
  patch,
  jobs,
  raidsData,
  className,
  ...props
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [raidsPopoverOpen, setRaidsPopoverOpen] = useState(false);
  const t = useTranslations('ViewPage.SearchForm');
  const tRaids = useTranslations('Common.Raids');
  const tPatches = useTranslations('Common.FFXIVPatches');

  const formSchema = z.object({
    q: z.string().optional(),
    raid: z.string().optional(),
    patch: z.string().regex(PATCH_REGEX).optional(),
    jobs: z.array(z.enum(ALL_SELECTABLE_JOBS)).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { q: q ?? '', raid: '', patch: '', jobs: [] },
  });

  useEffect(() => {
    form.setValue('q', q);
    form.setValue('raid', raid);
    form.setValue('patch', patch && `${patch.version}.${patch.subversion}`);
    form.setValue('jobs', jobs ?? []);
  }, [q, raid, patch, jobs, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSearching) return;

    const { q, raid, patch, jobs } = values;

    if (
      (q === undefined || q === '') &&
      (raid === undefined || raid === '') &&
      patch === undefined &&
      (jobs === undefined || jobs.length === 0)
    ) {
      setErrorMessage(t('FieldRequired'));
      return;
    }

    setErrorMessage(null);
    setIsSearching(true);
    router.push(
      buildSearchURL(
        searchParams,
        {
          raid: raid === '' ? undefined : raid,
          jobs: jobs?.length === 0 ? undefined : jobs,
          page: 1,
          limit: DEFAULT_LIMIT,
          sort: DEFAULT_SORT,
          q: values.q === '' ? undefined : values.q,
        },
        {
          patch: patch,
        },
      ),
    );
    setIsSearching(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('py-3 space-y-4', className)} {...props}>
        <div className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-6 sm:gap-y-0">
          <FormField
            control={form.control}
            name="q"
            render={({ field: { value: q, ...field } }) => (
              <FormItem className="flex-grow">
                <div>
                  <FormControl>
                    <Input type="search" placeholder={t('NameLabel')} value={q ?? ''} {...field} />
                  </FormControl>
                  {errorMessage !== null && (
                    <p className="text-[0.8rem] mt-0.5 font-medium text-destructive">{errorMessage}</p>
                  )}
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="pl-7 pr-6 w-auto">
            <div className="flex gap-x-2 w-auto max-w-full">
              <MagnifyingGlassIcon className="w-5 h-5 -ml-2" />
              {t('SearchButton')}
            </div>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-y-4 gap-x-6 mt-4">
          <FormField
            control={form.control}
            name="raid"
            render={({ field }) => {
              const raidSelected = raidsData.some((raid) => raid.semantic_key === field.value);
              return (
                <FormItem className="md:col-span-2 xl:col-span-3">
                  <FormLabel className="inline-block">{t('RaidLabel')}</FormLabel>
                  <Popover
                    open={raidsPopoverOpen}
                    onOpenChange={(open) => {
                      if (!open && !raidSelected) form.resetField('raid');
                      setRaidsPopoverOpen(open);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full inline-flex text-left justify-between hover:bg-background hover:ring-ring hover:ring-1 transition-all',
                            !raidSelected && 'text-muted-foreground',
                          )}
                        >
                          <div className="overflow-hidden">{raidSelected ? tRaids(field.value) : t('RaidAll')}</div>
                          <CaretSortIcon className="ml-1 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="p-0"
                      style={{ width: 'var(--radix-popover-trigger-width)' }}
                    >
                      <Command>
                        <CommandInput placeholder={t('RaidSearchPlaceholder')} className="h-9" />
                        <CommandEmpty>{t('RaidEmpty')}</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              form.resetField('raid');
                              setRaidsPopoverOpen(false);
                            }}
                          >
                            {t('RaidAll')}
                            <CheckIcon
                              className={cn('ml-auto h-4 w-4', field.value === '' ? 'opacity-100' : 'opacity-0')}
                            />
                          </CommandItem>
                          {raidsData.map((raid) => (
                            <CommandItem
                              value={raid.semantic_key}
                              key={raid.id}
                              onSelect={() => {
                                form.setValue('raid', raid.semantic_key);
                                setRaidsPopoverOpen(false);
                              }}
                            >
                              {tRaids(raid.semantic_key)}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  raid.semantic_key === field.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="jobs"
            render={({ field: { value: jobs, ...field } }) => (
              <FormItem className="md:col-span-1 xl:col-span-2">
                <ResetIcon className="float-right mt-1 h-4 w-4 cursor-pointer" onClick={() => field.onChange([])} />
                <FormLabel>{t('JobLabel')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full h-auto min-h-9 inline-flex text-left justify-between hover:bg-background hover:ring-ring hover:ring-1 transition-all',
                          jobs === undefined || (jobs.length === 0 && 'text-muted-foreground'),
                        )}
                      >
                        {jobs === undefined || jobs.length === 0 ? (
                          t('JobAll')
                        ) : (
                          <div className="grid grid-cols-4 xs:grid-cols-8 gap-2">
                            {jobs.map((job) => (
                              <JobIcon key={job} job={job} role={getRole(job)} className="w-4 h-4 xs:w-5 xs:h-5" />
                            ))}
                          </div>
                        )}
                        <CaretSortIcon className="ml-1 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto" align="end">
                    <JobToggleGroup sort maxCount={8} value={jobs ?? []} {...field} />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="patch"
            render={({ field }) => (
              <FormItem className="md:col-span-1 xl:col-span-2">
                <FormLabel>{t('PatchLabel')}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    value !== 'none' ? field.onChange(value) : field.onChange(undefined);
                  }}
                  defaultValue="none"
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        'w-full inline-flex text-left justify-between bg-background hover:ring-ring hover:ring-1 hover:text-accent-foreground hover:font-semibold transition-all',
                        field.value === '' && 'text-muted-foreground',
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent align="end">
                    <SelectItem value="none">
                      <div className="px-1">{t('PatchAll')}</div>
                    </SelectItem>
                    {ALL_PATCHES.toReversed().map(({ version, subversion }) => (
                      <SelectItem key={`select-patch-${version}.${subversion}`} value={`${version}.${subversion}`}>
                        <div className="px-1">
                          {`${version}.${subversion}`} - {tPatches(`${version}.${subversion}`)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        {/* </CollapsibleContent>
        </Collapsible> */}
      </form>
    </Form>
  );
};
ClientSearchForm.displayName = 'SearchForm';

export { ClientSearchForm };
