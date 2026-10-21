import type { Metadata, Viewport } from 'next';
import { DM_Mono, DM_Sans } from 'next/font/google';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' });
const sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-sans', display: 'swap' });

const title = 'antiwebslop: a design skill that keeps agent-built pages from looking AI-made';
const description =
  'An agent skill for Cursor, Codex, Claude Code and Grok: 35 named anti-patterns with fixes, a 31-rule zero-dependency lint, a per-project DESIGN.md, and a blind A/B eval. MIT, no telemetry.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: 'antiwebslop',
  authors: [{ name: 'Eduardo de Cesaro', url: 'https://github.com/cesaroeduardo' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'antiwebslop',
    title,
    description,
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: 'antiwebslop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${SITE_URL}/og.png`],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#121212',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
