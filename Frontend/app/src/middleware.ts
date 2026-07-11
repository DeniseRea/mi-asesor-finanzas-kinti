import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/shared/i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Verificar si el pathname ya contiene un locale soportado
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirigir al locale por defecto (es)
  request.nextUrl.pathname = `/es${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Omitir archivos estáticos e internos de Next.js
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
