import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { useEffect } from "react";
import { useTranslation, UseTranslationOptions } from "react-i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { useServerTranslation } from "./server";
import { getLanguageOptions, Language, LANGUAGE_COOKIE_NAME } from "./settings";
import { translationTable } from "./translationTable";
import { cookies } from "next/headers";

const initializeI18next = async (language?: Language, namespace?: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: Language, namespace: string) =>
          translationTable[language][namespace]
      )
    )
    .init(getLanguageOptions(language, namespace));
  return i18nInstance;
};

// Use i18next singleton for client-side
// If the hook is called from server-side component (it should never be), it will call useServerTranslation instead
export const useClientTranslation = async (
  language: Language,
  namespace?: string,
  options?: UseTranslationOptions<string>
) => {
  const cookieStore = cookies();
  const { t: translate, i18n: i18nextInstance } = useTranslation(
    namespace,
    options
  );
  const runsOnServer = typeof window === "undefined";

  useEffect(() => {
    if (i18nextInstance.resolvedLanguage !== language)
      i18nextInstance.changeLanguage(language);
  }, [language, i18nextInstance, i18nextInstance.resolvedLanguage]);

  useEffect(() => {
    if (cookieStore.get(LANGUAGE_COOKIE_NAME)?.value !== language)
      cookieStore.set(LANGUAGE_COOKIE_NAME, language, { path: "/" });
  }, [language, cookieStore.get(LANGUAGE_COOKIE_NAME)]);

  if (runsOnServer)
    return useServerTranslation(language, namespace, options);

  return {
    translate,
    i18nextInstance,
  };
};
