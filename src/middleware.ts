import { withUpdateSession } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { withInternationalization } from './lib/i18n/middleware';
import type { MiddleWareFactory, MyNextMiddleware } from './lib/types';

export const defaultMiddleware = (request: NextRequest) =>
  NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

const chainMiddlewares = (withMiddlewares: MiddleWareFactory[]) =>
  withMiddlewares.reduce<MyNextMiddleware>(
    (previousMiddleware, withMiddleware) => withMiddleware(previousMiddleware),
    defaultMiddleware,
  );

// Due to internal implementation detail of withInternationalization, it should always be the first middleware in the list
export const middleware = chainMiddlewares([withInternationalization, withUpdateSession]);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
