'use client';

import { JobIcon } from '@/components/icons/JobIcon';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { JOB_LAYOUT } from '@/lib/utils/constants';
import { cn, getRole } from '@/lib/utils/helpers';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { sortJobs } from '../../utils/helpers';
import type { SelectableJob } from '../../utils/types';

type JobToggleGroupProps = Readonly<
  Omit<React.ComponentProps<'div'>, 'defaultValue' | 'dir'> & {
    sort?: boolean;
    value?: SelectableJob[];
    maxCount?: number;
    onChange?: (value: SelectableJob[]) => void;
  }
>;

const JobToggleGroup = React.forwardRef<HTMLDivElement, JobToggleGroupProps>(
  ({ value: externalValue, onChange: onValueChangeExternal, sort, maxCount, className, ...props }, ref) => {
    const [nativeValue, setNativeValue] = useState<SelectableJob[]>([]);
    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : nativeValue;

    const t = useTranslations('ViewPage.SearchForm');

    const onValueChange = (value: SelectableJob[]) => {
      const newValue = sort ? sortJobs(value) : value;

      if (!isControlled) {
        setNativeValue(newValue);
        return;
      }
      if (onValueChangeExternal !== undefined) onValueChangeExternal(newValue);
    };

    return (
      <div className="flex flex-col gap-y-3">
        <h3 className="text-xs font-bold">{t('JobDescription')}</h3>
        <ToggleGroup
          value={value}
          onValueChange={onValueChange}
          type="multiple"
          className={cn('flex items-start gap-x-2 bg-background', className)}
          {...props}
          ref={ref}
        >
          {JOB_LAYOUT.map((row, i) => {
            const nonNullJobs = row.filter((job) => job !== null);
            return (
              nonNullJobs.length !== 0 && (
                <div
                  key={`job-col-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    i
                  }`}
                  className="flex flex-col gap-y-2"
                >
                  {nonNullJobs.map((job) => (
                    <ToggleGroupItem
                      key={job}
                      value={job ?? ''}
                      disabled={maxCount && value.length >= maxCount ? !value.includes(job) : false}
                      className="w-auto h-auto focus:bg-inherit p-0"
                    >
                      <JobIcon job={job} role={getRole(job)} className="w-6 h-6" />
                    </ToggleGroupItem>
                  ))}
                </div>
              )
            );
          })}
        </ToggleGroup>
        {/* <div className="flex justify-end">
          <Button variant="destructive" className="flex gap-x-1 h-8 m-0 py-0" onClick={() => onValueChange([])}>
            {t('JobClear')}
            <TrashIcon className="w-5 h-5" />
          </Button>
        </div> */}
      </div>
    );
  },
);
JobToggleGroup.displayName = 'JobToggleGroup';

export { JobToggleGroup };
