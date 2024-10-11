import { LocalizedDate } from '@/components/LocalizedDate';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type React from 'react';

type ModifiedTimeProp = React.HTMLAttributes<HTMLDivElement> & {
  createdAt: string;
  modifiedAt: string;
};

export const ModifiedTime: React.FC<ModifiedTimeProp> = ({ createdAt, modifiedAt, className, ...props }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <LocalizedDate useDifference dateISOString={modifiedAt} dateFormat="yyyy-MM-dd" />
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
