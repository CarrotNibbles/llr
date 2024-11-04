'use server';

import { LocalizedDate } from '@/components/LocalizedDate';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import type React from 'react';

type ModifiedTimeProp = Readonly<
  React.HTMLAttributes<HTMLDivElement> & {
    createdAt: string;
    modifiedAt: string;
  }
>;

const ModifiedTime = async ({
  createdAt,
  modifiedAt,
  className,
  ...props
}: { className?: string } & ModifiedTimeProp) => {
  const t = await getTranslations('ViewPage.ModifiedTime');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <LocalizedDate
          dateISOString={createdAt}
          useDifference
          dateFormat="yyyy-MM-dd"
          className={cn(className, 'text-center')}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>
        <div>
          {t('Created')}: <LocalizedDate dateISOString={createdAt} dateFormat="yyyy-MM-dd KK:mm aa" />
        </div>
        <div>
          {t('Modified')}: <LocalizedDate dateISOString={modifiedAt} dateFormat="yyyy-MM-dd KK:mm aa" />
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
ModifiedTime.displayName = 'ModifiedTime';

export { ModifiedTime };
