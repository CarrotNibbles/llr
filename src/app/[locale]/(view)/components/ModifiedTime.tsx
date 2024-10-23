'use server';

import { LocalizedDate } from '@/components/LocalizedDate';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type React from 'react';

type ModifiedTimeProp = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    createdAt: string;
    modifiedAt: string;
  }
>;

const ModifiedTime: React.FC<ModifiedTimeProp> = ({ createdAt, modifiedAt, className, ...props }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <LocalizedDate dateISOString={modifiedAt} useDifference dateFormat="yyyy-MM-dd" className="text-center" />
      </TooltipTrigger>
      <TooltipContent>
        <div>
          Created: <LocalizedDate dateISOString={createdAt} dateFormat="yyyy-MM-dd KK:mm aa" />
        </div>
        <div>
          Modified: <LocalizedDate dateISOString={modifiedAt} dateFormat="yyyy-MM-dd KK:mm aa" />
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
ModifiedTime.displayName = 'ModifiedTime';

export { ModifiedTime };
