'use client';

import { JobIcon } from '@/components/JobIcon';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RaidsDataType } from '@/lib/queries/server';
import {
  ALL_PATCHES,
  ALL_SELECTABLE_JOBS,
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  type Patch,
  type SelectableJob,
  buildSearchURL,
  cn,
  getRole,
  patchRegex,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CollapsibleContent } from '@radix-ui/react-collapsible';
import { CaretSortIcon, CheckIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  const tPatches = useTranslations('Common.FFXIVPatches');

  const formSchema = z.object({
    q: z.string().optional(),
    raid: z.string().optional(),
    patch: z.string().regex(patchRegex).optional(),
    jobs: z.array(z.enum(ALL_SELECTABLE_JOBS)).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { q, raid: '', patch: '', jobs: [] },
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

    if (q === '' && raid === undefined && patch === undefined && (jobs === undefined || jobs.length === 0)) {
      setErrorMessage('Please set at least one field');
      return;
    }

    setErrorMessage(null);
    setIsSearching(true);
    router.push(
      buildSearchURL(
        searchParams,
        {
          raid: raid,
          jobs: jobs,
          page: 1,
          limit: DEFAULT_LIMIT,
          sort: DEFAULT_SORT,
          q: values.q,
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('rounded-xl px-12 py-8 mx-2 mt-4 mb-8 bg-secondary space-y-4', className)}
        {...props}
      >
        <div className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-6 sm:gap-y-0">
          <FormField
            control={form.control}
            name="q"
            render={({ field: { value: q, ...field } }) => (
              <FormItem className="flex-grow">
                <div>
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="제목"
                      className="border-muted-foreground bg-background"
                      value={q ?? ''}
                      {...field}
                    />
                  </FormControl>
                  {errorMessage !== null && (
                    <p className="text-[0.8rem] font-medium text-destructive">{errorMessage}</p>
                  )}
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="min-w-28">
            <div className="flex gap-x-2 w-auto max-w-full">
              Search
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
          </Button>
        </div>
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex gap-x-1 items-center mt-2 ml-2">
            <Icons.filter /> Advanced filter
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-y-4 gap-x-6 mt-4 mx-4">
              <FormField
                control={form.control}
                name="raid"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 xl:col-span-3">
                    <FormLabel className="inline-block">레이드</FormLabel>
                    <Popover open={raidsPopoverOpen} onOpenChange={setRaidsPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full inline-flex text-left justify-between hover:bg-background hover:ring-ring hover:ring-1',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <div className="overflow-hidden">
                              {field.value
                                ? raidsData.find((raid) => raid.semantic_key === field.value)?.name
                                : '모든 레이드'}
                            </div>
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
                          <CommandInput placeholder="레이드 검색..." className="h-9" />
                          <CommandEmpty>레이드가 없습니다.</CommandEmpty>
                          <CommandGroup>
                            {raidsData.map((raid) => (
                              <CommandItem
                                value={raid.name}
                                key={raid.id}
                                onSelect={() => {
                                  form.setValue('raid', raid.semantic_key);
                                  setRaidsPopoverOpen(false)
                                }}
                              >
                                {raid.name}
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
                )}
              />
              <FormField
                control={form.control}
                name="jobs"
                render={({ field: { value: jobs, ...field } }) => (
                  <FormItem className="md:col-span-1 xl:col-span-2">
                    <FormLabel>포함 직업</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full h-auto min-h-9 inline-flex text-left justify-between hover:bg-background hover:ring-ring hover:ring-1',
                              jobs === undefined || (jobs.length === 0 && 'text-muted-foreground'),
                            )}
                          >
                            {jobs === undefined || jobs.length === 0 ? (
                              '모든 직업'
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
                      <PopoverContent>
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
                    <FormLabel>패치</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        value !== 'none' ? field.onChange(value) : field.onChange(undefined);
                      }}
                      defaultValue={'none'}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            'w-full inline-flex text-left justify-between bg-background hover:ring-ring hover:ring-1 hover:text-accent-foreground hover:font-semibold',
                            field.value === undefined && 'text-muted-foreground',
                          )}
                        >
                          <SelectValue placeholder="모든 패치" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent align="end">
                        <SelectItem value="none">
                          <div className="px-1">모든 패치</div>
                        </SelectItem>
                        {ALL_PATCHES.map(({ version, subversion }) => (
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
          </CollapsibleContent>
        </Collapsible>
      </form>
    </Form>
  );
};
ClientSearchForm.displayName = 'SearchForm';

export { ClientSearchForm };
