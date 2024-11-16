import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const SUPPORTED_LOCALES = ['en', 'ko', 'ja'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: 'en',
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !SUPPORTED_LOCALES.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
