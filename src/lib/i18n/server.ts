import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getLanguageOptions, Language } from "./settings";
import { translationTable } from "./translationTable";
import { UseTranslationOptions } from "react-i18next";

const initializeI18next = async (language?: Language, namespace?: string) => {
  const i18nextInstance = createInstance();
  await i18nextInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: Language, namespace: string) =>
          translationTable[language][namespace]
      )
    )
    .init(getLanguageOptions(language, namespace));
  return i18nextInstance;
};

// Create instance for server-side hook (i18next singleton has concurrency issues)
export const useServerTranslation = async (
  language: Language,
  namespace?: string,
  options?: UseTranslationOptions<string>
) => {
  const i18nextInstance = await initializeI18next(language, namespace);

  return {
    translate: i18nextInstance.getFixedT(language, namespace, options?.keyPrefix),
    i18nextInstance,
  };
};
