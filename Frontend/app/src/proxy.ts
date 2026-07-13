import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/shared/i18n/config';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(segments[0])) segments.shift();
  request.nextUrl.pathname = `/es${segments.length ? `/${segments.join('/')}` : ''}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt).*)'],
};
