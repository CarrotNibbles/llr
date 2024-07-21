import { withUpdateSession } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";
import { withInternationalization } from "./lib/i18n/middleware";
import { MiddleWareFactory, MyNextMiddleware } from "./lib/types";

export const defaultMiddleware = (request: NextRequest) =>
  NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

const chainMiddlewares = (withMiddlewares: MiddleWareFactory[]) =>
  withMiddlewares.reduce<MyNextMiddleware>(
    (previousMiddleware, withMiddleware) => withMiddleware(previousMiddleware),
    defaultMiddleware
  );

export const middleware = chainMiddlewares([
  withUpdateSession,
  withInternationalization,
]);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
