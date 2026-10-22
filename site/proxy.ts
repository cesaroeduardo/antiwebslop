import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing, type Locale } from './i18n/routing';

const intl = createMiddleware(routing);

/** The cookie the language select writes. Once set (by a manual pick or by the first geo guess), it decides. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';
const YEAR = 60 * 60 * 24 * 365;

/** First-visit guess from the visitor's country (Vercel's x-vercel-ip-country). Anything else, or no header, is English. */
const SPANISH = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY'];
export function localeForCountry(country: string | null | undefined): Locale {
  const c = (country ?? '').toUpperCase();
  if (c === 'BR') return 'pt';
  if (c === 'FR') return 'fr';
  if (SPANISH.includes(c)) return 'es';
  return 'en';
}

/** Crawlers and link previews always get the URL they asked for: hreflang and canonicals stay the source of truth. */
const BOT = /bot|crawl|spider|slurp|archiver|bingpreview|facebookexternalhit|embedly|whatsapp|telegram|discord|slack|linkedin|twitter|skype|vkshare|pinterest|lighthouse|pagespeed|headless|preview/i;

const isLocale = (v: string | undefined): v is Locale => !!v && (routing.locales as readonly string[]).includes(v);

/** Path carries a non-default locale prefix (/pt, /fr, /es). Those never redirect. */
const prefixed = (pathname: string) =>
  routing.locales.some((l) => l !== routing.defaultLocale && (pathname === `/${l}` || pathname.startsWith(`/${l}/`)));

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const ua = req.headers.get('user-agent') ?? '';
  if (prefixed(pathname) || BOT.test(ua) || (req.method !== 'GET' && req.method !== 'HEAD')) return intl(req);

  // Unprefixed path (English). A saved choice wins; with none, guess once from the country and remember it.
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : localeForCountry(req.headers.get('x-vercel-ip-country'));

  const res =
    locale === routing.defaultLocale
      ? intl(req)
      : NextResponse.redirect(new URL(`/${locale}${pathname === '/' ? '' : pathname}${search}`, req.url), 307);
  if (locale !== routing.defaultLocale) res.headers.set('Cache-Control', 'private, no-store');
  if (!isLocale(saved)) {
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: YEAR,
      sameSite: 'lax',
      secure: req.nextUrl.protocol === 'https:',
    });
  }
  return res;
}

export const config = {
  // every page path, but not API routes, Next internals or files with an extension (llm.txt, images, sitemap.xml)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
