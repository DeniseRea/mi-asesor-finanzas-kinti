import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/shared/i18n/config';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;
  request.nextUrl.pathname = `/es${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt).*)'],
};
