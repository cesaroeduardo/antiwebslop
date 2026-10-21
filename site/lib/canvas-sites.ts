/**
 * Sites on the canvas (second section). Each was found in one of the galleries SKILL.md lists,
 * then captured live with headless Chrome at 1440×900, above the fold, on 2026-10-21.
 * Files: public/canvas/<slug>.webp (1440w, lightbox) and <slug>-thumb.webp (720w, card).
 */
export type CanvasSite = { slug: string; name: string; url: string; gallery: string; galleryUrl: string };

const G = {
  awwwards: ['Awwwards', 'https://www.awwwards.com/websites/sites_of_the_day/'],
  minimal: ['Minimal Gallery', 'https://minimal.gallery/'],
  recent: ['Recent Design', 'https://recent.design/websites'],
  curated: ['Curated Design', 'https://curated.design/'],
  spells: ['Design Spells', 'https://designspells.com/'],
} as const;

const site = (slug: string, name: string, url: string, g: keyof typeof G): CanvasSite => ({
  slug, name, url, gallery: G[g][0], galleryUrl: G[g][1],
});

export const canvasSites: CanvasSite[] = [
  site('obys-format', 'Format by Obys', 'https://format.obys.agency', 'awwwards'),
  site('interfere', 'Interfere', 'https://interfere.com', 'recent'),
  site('how-studio', 'How Studio', 'https://how.studio', 'minimal'),
  site('nogood', 'NoGood', 'https://nogood.studio', 'curated'),
  site('mymind', 'mymind', 'https://mymind.com', 'spells'),
  site('twks', 'TWKS', 'https://twks.ch', 'awwwards'),
  site('displace', 'Displace', 'https://displace.agency', 'recent'),
  site('grafik', 'Grafik', 'https://grafik.nz', 'minimal'),
  site('tinloof', 'Tinloof', 'https://tinloof.com', 'curated'),
  site('signal-a', 'Signal A', 'https://signal-a.studio', 'awwwards'),
  site('augen', 'Augen', 'https://augen.pro', 'recent'),
  site('union-boulangerie', 'Union Boulangerie', 'https://unionboulangerie.com', 'minimal'),
  site('vercel', 'Vercel', 'https://vercel.com', 'spells'),
  site('podium', 'Podium', 'https://podium.global', 'recent'),
];
