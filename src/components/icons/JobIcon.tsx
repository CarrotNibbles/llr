'use client';

import type { Enums } from '@/lib/database.types';
import { type Role, cn } from '@/lib/utils';
import { ReactSVG } from 'react-svg';

const ROLE_ICON_STYLE = {
  Tank: 'fill-blue-600 dark:fill-blue-400 border-blue-600 dark:border-blue-400',
  Healer: 'fill-green-600 dark:fill-green-400 border-green-600 dark:border-green-400',
  DPS: 'fill-red-600 dark:fill-red-400 border-red-600 dark:border-red-400',
  Others: 'fill-zinc-600 dark:fill-zinc-400 border-zinc-600 dark:border-zinc-400',
} satisfies Record<Role, string>;

export const JobIcon = ({
  className,
  job,
  role,
}: {
  className?: string;
  job: Enums<'job'> | null;
  role: Role;
}) => {
  const src = `/icons/job/${job ?? 'BLANK'}.svg`;
  return (
    <>
      {job !== 'LB' && (
        <ReactSVG
          src={src}
          className={cn(className, `${ROLE_ICON_STYLE[role]} rounded-md saturate-50 border-[1.5px]`)}
        />
      )}
    </>
  );
};
