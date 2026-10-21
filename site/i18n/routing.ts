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

/** Path of the home page for a locale: "/" for English, "/pt" etc. for the rest. */
export const localePath = (locale: string) => (locale === routing.defaultLocale ? '/' : `/${locale}`);
