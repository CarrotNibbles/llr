import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const SUPPORTED_LOCALES = ["en", "ko", "jp"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export default getRequestConfig(async ({ locale: l }) => {
  const locale = l as Locale;

  if (!SUPPORTED_LOCALES.includes(locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
