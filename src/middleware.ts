import { updateSession } from '@/lib/supabase/middleware';
import { withInternationalization } from './lib/i18n/middleware';

// Due to internal implementation detail of withInternationalization, it should always be the first middleware in the list
export const middleware = withInternationalization(updateSession);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
