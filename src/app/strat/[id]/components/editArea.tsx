'use client';

import { EditAreaColumn } from './editAreaColumn';
import { Separator } from '@/components/ui/separator';

export const EditArea = ({ jobs, isOpens }: { jobs: number[]; isOpens: boolean[] }) => {
  return (
    <div className="w-full flex-grow">
      <ul className="px-2">
        {jobs.map((job, index) => (
          <EditAreaColumn key={index} job={job} isOpen={isOpens[index]} />
        ))}
      </ul>
      <Separator />
    </div>
  );
};
