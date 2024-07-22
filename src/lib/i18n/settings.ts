import acceptLanguage from "accept-language";
import { InitOptions } from "i18next";

export const FALLBACK_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = [FALLBACK_LANGUAGE, "ko", "jp"] as const;
export const DEFAULT_NAMESPACE = "translation";
export const LANGUAGE_COOKIE_NAME = "LLR-Language";
export const ACCEPT_LANGUAGE = "Accept-Language";
export const REFERER = "Referer";
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const acceptLanguageParser = (() => {
  const acceptLanguageParser = acceptLanguage.create();
  acceptLanguageParser.languages([...SUPPORTED_LANGUAGES]);
  return acceptLanguageParser;
})();

export const isSupportedLanguage = (language: string | null | undefined) => {
  return SUPPORTED_LANGUAGES.some((l) => l === language);
};

export function getLanguageOptions<T>(
  language = FALLBACK_LANGUAGE,
  namespace = DEFAULT_NAMESPACE
): InitOptions<T> {
  return {
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: FALLBACK_LANGUAGE,
    lng: language,
    fallbackNS: DEFAULT_NAMESPACE,
    defaultNS: DEFAULT_NAMESPACE,
    ns: namespace
  }
};
