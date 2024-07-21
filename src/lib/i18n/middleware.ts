import { MiddleWareFactory } from "../types";
import acceptLanguage from "accept-language";
import {
  ACCEPT_LANGUAGE,
  FALLBACK_LANGUAGE,
  isSupportedLanguage,
  LANGUAGE_COOKIE_NAME,
  REFERER,
  SUPPORTED_LANGUAGES,
} from "./languages";
import { NextRequest, NextResponse } from "next/server";

const getLanguage = (request: NextRequest) => {
  if (request.cookies.has(LANGUAGE_COOKIE_NAME)) {
    const languageFromCookie = request.cookies.get(LANGUAGE_COOKIE_NAME)!.value;
    if (isSupportedLanguage(languageFromCookie)) return languageFromCookie;
  }

  if (request.headers.has(ACCEPT_LANGUAGE)) {
    const acceptLanguageParser = acceptLanguage.create();
    acceptLanguageParser.languages([...SUPPORTED_LANGUAGES]);

    const languageFromHeader = acceptLanguageParser.get(
      request.headers.get(ACCEPT_LANGUAGE)!
    );

    if (languageFromHeader) return languageFromHeader;
  }

  if (request.headers.has(REFERER)) {
    const refererUrl = new URL(request.headers.get(REFERER)!);
    const languageFromReferer = SUPPORTED_LANGUAGES.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    if (languageFromReferer) return languageFromReferer;
  }

  return FALLBACK_LANGUAGE;
};

export const withInternationalization: MiddleWareFactory =
  (middleware) => async (request, event) => {
    let response = await middleware(request, event);

    if (
      request.nextUrl.pathname.startsWith("/auth") ||
      request.nextUrl.pathname.startsWith("/_next")
    )
      return response;

    // Redirect if the url doesn't have any language is not supported
    if (
      !SUPPORTED_LANGUAGES.some((l) =>
        request.nextUrl.pathname.startsWith(`/${l}`)
      )
    ) {
      const language = getLanguage(request);
      response.cookies.set(LANGUAGE_COOKIE_NAME, language);
      response = NextResponse.redirect(  
        new URL(`/${language}${request.nextUrl.pathname}`, request.url)
      );
    }

    return response;
  };
