'use client';

import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { type Locale as DateFNSLocale, enUS, ja, ko } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import React from 'react';

type LocalizedDateProp = React.HTMLAttributes<HTMLSpanElement> & {
  dateISOString: string;
};

const localeMap: Record<Locale, DateFNSLocale> = {
  en: enUS,
  ko: ko,
  ja: ja,
};

export const LocalizedDate = React.forwardRef<HTMLSpanElement, LocalizedDateProp>(
  ({ dateISOString, className, ...props }, ref) => {
    const localeString = useLocale();
    const locale = localeMap[localeString as Locale] ?? enUS;

    const date = new Date(dateISOString);
    const timeDifference = formatDistanceToNowStrict(date, { addSuffix: true, locale });

    return (
      <span className={cn(className, 'capitalize')} {...props} ref={ref}>
        {timeDifference}
      </span>
    );
  },
);
