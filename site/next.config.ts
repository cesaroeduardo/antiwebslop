import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'node:url';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // This package lives in a subfolder of the repo; keep Turbopack's root here.
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
};

export default withNextIntl(nextConfig);
