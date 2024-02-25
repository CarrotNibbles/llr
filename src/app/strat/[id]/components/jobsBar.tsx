'use client';

import { type ForwardedRef, forwardRef } from 'react';

const JobsBarInner = ({ jobs }: { jobs: any[] }, ref?: ForwardedRef<HTMLDivElement>) => {
  return (
    <div className="w-full sticky bg-yellow-50" ref={ref}>
      Jobs
    </div>
  );
};

export const JobsBar = forwardRef(JobsBarInner);
