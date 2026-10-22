import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt', 'fr', 'es'],
  defaultLocale: 'en',
  // English at /, the others at /pt, /fr, /es
  localePrefix: 'as-needed',
  // next-intl's own detection stays off: proxy.ts guesses once from the country (x-vercel-ip-country) on an
  // unprefixed path, and the NEXT_LOCALE cookie (set by that guess or by the language select) wins after that.
  // Prefixed paths and crawlers are never redirected. No Accept-Language.
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Locale-aware path. Home is "/" for English and "/pt" (etc.) for the rest.
 * Pass a site path like "/changelog" for subpages → "/changelog" or "/pt/changelog".
 */
export const localePath = (locale: string, path = '') => {
  const suffix = !path || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  if (locale === routing.defaultLocale) return suffix || '/';
  return `/${locale}${suffix}`;
};

/** Home hash link that stays on the right locale: "#install" or "/pt#install" (no slash before # — Lenis/path match). */
export const localeHash = (locale: string, id: string) => {
  const home = localePath(locale);
  return `${home === '/' ? '' : home}#${id}`;
};
