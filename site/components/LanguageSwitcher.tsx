import { getTranslations } from 'next-intl/server';
import { routing, localePath } from '@/i18n/routing';

const names: Record<string, string> = { en: 'English', pt: 'Português', fr: 'Français', es: 'Español' };

/** EN PT FR ES as plain links to each locale's home; the current one is marked with aria-current. */
export async function LanguageSwitcher({ locale, className = '' }: { locale: string; className?: string }) {
  const t = await getTranslations('common');
  return (
    <ul aria-label={t('language')} className={`items-center font-mono text-cap ${className}`}>
      {routing.locales.map((l) => {
        const current = l === locale;
        return (
          <li key={l} className="inline-block">
            <a
              href={localePath(l)}
              hrefLang={l === 'pt' ? 'pt-BR' : l}
              lang={l === 'pt' ? 'pt-BR' : l}
              aria-current={current ? 'page' : undefined}
              aria-label={t('languageLabel', { name: names[l] })}
              className={`inline-block rounded-control px-1.5 py-2 uppercase transition-colors duration-150 ${current ? 'text-accent' : 'text-muted hover:text-fg'}`}
            >
              {l}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
