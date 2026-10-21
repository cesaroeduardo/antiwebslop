import type { MetadataRoute } from 'next';
import { routing, localePath } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const url = (l: string) => `${SITE_URL}${localePath(l) === '/' ? '/' : localePath(l)}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l === 'pt' ? 'pt-BR' : l, url(l)]));
  return routing.locales.map((l) => ({
    url: url(l),
    changeFrequency: 'monthly',
    priority: l === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages: { ...languages, 'x-default': url(routing.defaultLocale) } },
  }));
}
