import content from '@/content/generated.json';
import { AUTHOR_URL, REPO, SITE_URL } from '@/lib/site';

type Props = {
  locale: string;
  title: string;
  description: string;
};

const contentVersion = () => content.version;

/** WebSite + SoftwareApplication + source repo graph for crawlers. */
export function JsonLd({ locale, title, description }: Props) {
  const inLanguage = locale === 'pt' ? 'pt-BR' : locale;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'antiwebslop',
        description,
        inLanguage,
        publisher: { '@id': `${SITE_URL}/#author` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#app`,
        name: 'antiwebslop',
        alternateName: title,
        description,
        url: SITE_URL,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        downloadUrl: REPO,
        softwareVersion: contentVersion(),
        license: `${REPO}/blob/main/LICENSE`,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@id': `${SITE_URL}/#author` },
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${SITE_URL}/#source`,
        name: 'antiwebslop',
        codeRepository: REPO,
        programmingLanguage: ['TypeScript', 'JavaScript', 'Markdown'],
        runtimePlatform: 'Node.js',
        license: `${REPO}/blob/main/LICENSE`,
        author: { '@id': `${SITE_URL}/#author` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#author`,
        name: 'Eduardo de Cesaro',
        url: AUTHOR_URL,
        sameAs: [AUTHOR_URL, 'https://github.com/cesaroeduardo'],
      },
    ],
  };

  // Escape < so a future string containing </script> cannot break out of the tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // JSON-LD is a data blob for crawlers; dangerouslySetInnerHTML is the documented pattern.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
