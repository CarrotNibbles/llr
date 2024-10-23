'use client';

import { JobIcon } from '@/components/JobIcon';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { JOB_LAYOUT, type SelectableJob, cn, getRole, sortJobs } from '@/lib/utils';
import React from 'react';
import { useState } from 'react';

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

    const onValueChange = (value: SelectableJob[]) => {
      const newValue = sort ? sortJobs(value) : value;

      if (!isControlled) {
        setNativeValue(newValue);
        return;
      }
      if (onValueChangeExternal !== undefined) onValueChangeExternal(newValue);
    };

    return (
      <ToggleGroup
        value={value}
        onValueChange={onValueChange}
        type="multiple"
        className={cn('flex items-start gap-x-1 bg-background', className)}
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
                className="flex flex-col gap-y-1"
              >
                {nonNullJobs.map((job) => (
                  <ToggleGroupItem
                    key={job}
                    value={job ?? ''}
                    disabled={maxCount && value.length >= maxCount ? !value.includes(job) : false}
                    className="p-1 w-auto h-auto focus:bg-inherit"
                  >
                    <JobIcon job={job} role={getRole(job)} className="w-6 h-6" />
                  </ToggleGroupItem>
                ))}
              </div>
            )
          );
        })}
      </ToggleGroup>
    );
  },
);
JobToggleGroup.displayName = 'JobToggleGroup';

export { JobToggleGroup };
