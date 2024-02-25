'use client';

import { type ForwardedRef, forwardRef } from 'react';
import { JobsBarColumn } from './jobsBarColumn';
import { Separator } from '@/components/ui/separator';

const JobsBarInner = (
  { jobs, isOpens }: { jobs: number[]; isOpens: boolean[] },
  ref?: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <div className="w-full sticky" ref={ref}>
      <ul className="p-2">
        {jobs.map((job, index) => (
          <JobsBarColumn key={index} job={job} isOpen={isOpens[index]} />
        ))}
      </ul>
      <Separator />
    </div>
  );
};

export const JobsBar = forwardRef(JobsBarInner);
