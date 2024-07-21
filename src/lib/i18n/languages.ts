export const FALLBACK_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = [FALLBACK_LANGUAGE, "jp", "ko"] as const; 

export type Language = typeof SUPPORTED_LANGUAGES[number];

export const isSupportedLanguage = (language: string | null | undefined) => {
  return SUPPORTED_LANGUAGES.some(l => l === language);
}

export const LANGUAGE_COOKIE_NAME = "LLR-Language";
export const ACCEPT_LANGUAGE = "Accept-Language";
export const REFERER = "Referer";