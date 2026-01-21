import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // 기본 locale(ko)은 URL에 없으므로 모든 경로를 매칭
  matcher: ['/', '/(en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
