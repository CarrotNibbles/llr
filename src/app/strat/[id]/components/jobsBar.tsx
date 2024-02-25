'use client';

import { type ForwardedRef, forwardRef } from 'react';
import { HeaderArea } from './headerArea';
import { Separator } from '@/components/ui/separator';

const JobsBarInner = (
  { jobs, isOpens }: { jobs: number[]; isOpens: boolean[] },
  ref?: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <div className="w-full sticky" ref={ref}>
      <ul className="pt-2">
        {jobs.map((job, index) => (
          <HeaderArea key={index} job={job} />
        ))}
      </ul>
      <Separator />
    </div>
  );
};

export const JobsBar = forwardRef(JobsBarInner);
