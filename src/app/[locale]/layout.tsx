import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type React from 'react';

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children } = props;

  const messages = await getMessages();

  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
