import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt', 'fr', 'es'],
  defaultLocale: 'en',
  // English at /, the others at /pt, /fr, /es
  localePrefix: 'as-needed',
  // the language is picked from the URL only; no cookie, no Accept-Language redirect
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

/** Path of the home page for a locale: "/" for English, "/pt" etc. for the rest. */
export const localePath = (locale: string) => (locale === routing.defaultLocale ? '/' : `/${locale}`);
