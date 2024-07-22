import type { Locale } from "@/lib/i18n";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import type React from "react";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
