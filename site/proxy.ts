import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // every page path, but not API routes, Next internals or files with an extension (llm.txt, images, sitemap.xml)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
