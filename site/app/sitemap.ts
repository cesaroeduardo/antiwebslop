import type { MetadataRoute } from 'next';
import { routing, localePath } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const paths = ['', '/changelog'] as const;

const url = (locale: string, path: (typeof paths)[number]) => {
  const p = localePath(locale, path);
  return `${SITE_URL}${p === '/' ? '/' : p}`;
};

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(routing.locales.map((l) => [l === 'pt' ? 'pt-BR' : l, url(l, path)]));
    return routing.locales.map((l) => ({
      url: url(l, path),
      changeFrequency: path === '/changelog' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? (l === routing.defaultLocale ? 1 : 0.8) : l === routing.defaultLocale ? 0.7 : 0.6,
      alternates: { languages: { ...languages, 'x-default': url(routing.defaultLocale, path) } },
    }));
  });
}
