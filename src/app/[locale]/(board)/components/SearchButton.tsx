'use client';

import { JobIcon } from '@/components/JobIcon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { type SearchStrategiesDataType, buildSearchButtonStrategiesDataQuery } from '@/lib/queries/client';
import { createClient } from '@/lib/supabase/client';
import {
  DEFAULT_LIMIT,
  SEARCH_BUTTON_LIMIT,
  SEARCH_BUTTON_MOBILE_LIMIT,
  buildURL,
  cn,
  getOrderedRole,
  rangeInclusive,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ExclamationTriangleIcon,
  HeartFilledIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MixerVerticalIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type SearchButtonProps = Readonly<ButtonProps & {}>;

const SearchButton = forwardRef<HTMLButtonElement, SearchButtonProps>(({ className, ...props }, ref) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);

  return isDesktop ? (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={className} {...props} ref={ref}>
          <span className="sr-only">Search</span>
          <MagnifyingGlassIcon className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="rounded-none w-96" sideOffset={8}>
        <SearchButtonForm limit={SEARCH_BUTTON_LIMIT} closeForm={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  ) : (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className={className} {...props} ref={ref}>
          <span className="sr-only">Search</span>
          <MagnifyingGlassIcon className="w-6 h-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-4/5">
        <SearchButtonForm limit={SEARCH_BUTTON_MOBILE_LIMIT} closeForm={() => setIsOpen(false)} className="px-8 my-8" />
      </DrawerContent>
    </Drawer>
  );
});
SearchButton.displayName = 'SearchPopover';

enum SearchState {
  Start = 0,
  Loading = 1,
  Failure = 2,
  Done = 3,
}

type SearchButtonFormProps = Readonly<
  Omit<React.ComponentProps<'form'>, 'onSubmit'> & {
    limit: number;
    closeForm: () => void;
  }
>;

const SearchButtonForm: React.FC<SearchButtonFormProps> = ({ limit, closeForm, className, ...props }) => {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchState, setSearchState] = useState(SearchState.Start);
  const [searchResult, setSearchResult] = useState<SearchStrategiesDataType>([]);

  const formSchema = z.object({
    q: z.string({ required_error: '검색 문자열을 입력하세요.' }), //.min(5, '5글자 이상 입력해주세요.'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (searchState === SearchState.Loading) return;

    setSearchState(SearchState.Loading);
    const { data, error } = await buildSearchButtonStrategiesDataQuery(supabase, values.q, 1, limit);
    if (data === null || error) {
      setSearchState(SearchState.Failure);
      return;
    }
    setSearchResult(data);
    setSearchState(SearchState.Done);
  };

  const onDetailedClick = () => {
    router.push(buildURL('/search', searchParams, { q: form.getValues('q'), page: 1, limit: DEFAULT_LIMIT }));
    closeForm();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={className} {...props}>
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem>
                <div className="flex border focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="Search"
                      className="rounded-none border-none flex-grow focus-visible:ring-0 focus-visible:ring-ring"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-none m-0"
                    onClick={onDetailedClick}
                  >
                    <MixerVerticalIcon className="w-5 h-5" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <SearchButtonResult
        q={form.getValues('q')}
        searchState={searchState}
        searchResult={searchResult}
        limit={limit}
        className="mt-2"
      />
    </>
  );
};
SearchButtonForm.displayName = 'SearchButtonForm';

type SearchButtonResultProps = Readonly<
  React.ComponentProps<'table'> & {
    q: string;
    searchState: SearchState;
    searchResult: SearchStrategiesDataType;
    limit: number;
  }
>;

const SearchButtonResult: React.FC<SearchButtonResultProps> = ({
  q,
  searchState,
  searchResult,
  limit,
  className,
  ...props
}) => {
  const searchParams = useSearchParams();

  if (searchState === SearchState.Start) return null;

  if (searchState === SearchState.Failure)
    return (
      <Table className={cn('mt-2', className)}>
        <TableBody>
          <TableCell>
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>검색에 실패했습니다. 잠시 후 재시도해 주세요.</AlertDescription>
            </Alert>
          </TableCell>
        </TableBody>
      </Table>
    );

  if (searchState === SearchState.Loading)
    return (
      <Table className={cn('border-y', className)} {...props}>
        <TableBody>
          {rangeInclusive(1, SEARCH_BUTTON_LIMIT).map((index) => {
            return (
              <TableRow key={index}>
                <TableCell>
                  <div className="w-full flex flex-col pl-4 py-4 pr-2">
                    <div className="h-5 md:h-6 w-2/3">
                      <Skeleton className="h-[14px] md:h-4" />
                    </div>
                    <div className="h-4 md:h-5 w-1/2">
                      <Skeleton className="h-3 md:h-[14px]" />
                    </div>
                    <div>
                      <div className="inline-grid grid-cols-4 sm:grid-cols-8 gap-1 mt-2">
                        {rangeInclusive(1, 8).map((index) => (
                          <Skeleton key={index} className="aspect-square w-5 h-5" />
                        ))}
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );

  return (
    <>
      <Table className={cn('border-y', className)} {...props}>
        <TableBody>
          {searchResult.map((strat) => {
            const likeCount =
              strat.like_counts === null ? 0 : strat.like_counts.anon_likes + strat.like_counts.user_likes;
            return (
              <TableRow key={strat.id}>
                <TableCell>
                  <Link href={`/strat/${strat.id}`} className="w-full h-full flex items-center">
                    <div className="w-full flex flex-col pl-4 py-4 pr-2">
                      <div className="flex justify-between">
                        <h2 className="text-sm md:text-base font-bold">{strat.name}</h2>
                        <div className="flex items-center gap-x-1.5">
                          {likeCount > 0 ? <HeartFilledIcon className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}{' '}
                          {likeCount}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {strat.raids?.name} ({strat.version}.{strat.subversion})
                      </div>
                      {strat.strategy_players.length !== 0 && (
                        <div>
                          <div className="inline-grid grid-cols-8 gap-1 mt-2">
                            {strat.strategy_players.map((player) => (
                              <JobIcon
                                job={player.job}
                                role={getOrderedRole(player.job, player.order)}
                                key={player.id}
                                className="aspect-square w-4 h-4"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {searchResult.length === 0 && <div>No results found</div>}
      {searchResult.length === limit && (
        <div className="mt-2">
          <Link href={buildURL('/search', searchParams, { q, page: 1, limit: DEFAULT_LIMIT })}>More...</Link>
        </div>
      )}
    </>
  );
};
SearchButtonResult.displayName = 'SearchButtonResult';

export { SearchButton };
