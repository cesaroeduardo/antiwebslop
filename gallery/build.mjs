#!/usr/bin/env node
// slop-lint-disable-file  (builds pages that contain slop on purpose)
//
// Builds the before/after gallery: renders the slop and clean HTML fixtures side by side,
// with every slop-lint finding marked on the rendered page. Static output, no dependencies.
// Usage: node gallery/build.mjs   →  gallery/index.html + gallery/pages/*.html

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintText, parseDesignTokens } from '../.cursor/skills/antiwebslop/scripts/slop-lint.mjs';

const ERA = '2026-10';
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const fx = (p) => join(root, 'tests/fixtures', p);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The fixtures use a few Tailwind-style class names; this shim renders them without a build step.
const SHIM = `.text-center{text-align:center}.text-xs{font-size:12px}.uppercase{text-transform:uppercase}.tracking-widest{letter-spacing:.2em}
.text-5xl{font-size:48px;line-height:1}.font-bold{font-weight:700}.bg-indigo-600{background:#4f46e5}.text-gray-400{color:#9ca3af}.p-6{padding:24px}
.rounded-full{border-radius:9999px}.h-2{height:8px}.w-2{width:8px}.bg-emerald-500{background:#10b981}.animate-ping{display:inline-block}
.badge{display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.15)}body{font-family:Inter,Arial,sans-serif;margin:24px}`;

const MARK = `[data-slop]{outline:2px dashed #C2362B!important;outline-offset:3px;position:relative}
[data-slop]::after{content:attr(data-slop);position:absolute;left:0;top:100%;margin-top:4px;z-index:9;white-space:nowrap;
font:600 11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:0;text-transform:none;color:#fff;background:#C2362B;padding:1px 6px;border-radius:3px}
.slop-pagebar{font:12px/1.5 ui-monospace,Menlo,monospace;background:#1B1B1F;color:#F3F1EC;padding:8px 12px;margin:-24px -24px 24px}
.slop-pagebar b{color:#FF8A7A}`;

// Marks the first opening tag inside <body> on each flagged line; everything else goes to the page bar.
function markPage(html, hits) {
  const lines = html.split('\n');
  const bodyStart = lines.findIndex((l) => /<body\b/i.test(l));
  const byLine = new Map();
  for (const h of hits) byLine.set(h.line, [...(byLine.get(h.line) || []), h.rule]);
  const pageWide = [];
  for (const [ln, rules] of byLine) {
    const i = ln - 1;
    const label = [...new Set(rules)].join(' · ');
    if (bodyStart >= 0 && i > bodyStart && /<([a-z][\w-]*)(\s|>)/i.test(lines[i])) {
      lines[i] = lines[i].replace(/<([a-z][\w-]*)(\s|>)/i, (m, tag, after) => `<${tag} data-slop="${esc(label)}"${after}`);
    } else pageWide.push(`line ${ln}: ${label}`);
  }
  let out = lines.join('\n').replace('</head>', `<style>${SHIM}\n${MARK}</style></head>`);
  const bar = `<div class="slop-pagebar"><b>${hits.length} findings</b>${pageWide.length ? ` · page-wide: ${esc(pageWide.join(' | '))}` : ''}</div>`;
  return `<!-- slop-lint-disable-file  (generated gallery page; contains slop on purpose) -->\n` + out.replace(/<body([^>]*)>/i, `<body$1>${bar}`);
}

const exhibits = [
  { id: 'a', title: 'Familiar tells', note: 'Purple gradient, gradient text, glass, emoji badge, copy that could sell anything, invented proof.',
    slop: 'slop/landing.html', clean: 'clean/landing.html' },
  { id: 'b', title: 'Newer tells', note: 'Label above the headline, 01/02 section numbers, a big-number stat row, side stripes, bouncy easing, endless loops, em dashes everywhere.',
    slop: 'slop/v2-landing.html', clean: 'clean/landing.html' },
];

mkdirSync(join(here, 'pages'), { recursive: true });
const cleanTokens = parseDesignTokens(readFileSync(fx('clean/DESIGN.md'), 'utf8'));
const cards = [];
for (const ex of exhibits) {
  const slopHtml = readFileSync(fx(ex.slop), 'utf8');
  const cleanHtml = readFileSync(fx(ex.clean), 'utf8');
  const slopHits = lintText(slopHtml);
  const cleanHits = lintText(cleanHtml, { tokens: cleanTokens });
  writeFileSync(join(here, 'pages', `${ex.id}-before.html`), markPage(slopHtml, slopHits));
  writeFileSync(join(here, 'pages', `${ex.id}-after.html`), markPage(cleanHtml, cleanHits));
  const count = (hs, s) => hs.filter((h) => h.severity === s).length;
  const list = slopHits.map((h) => `<li><code>${h.line}</code> <span class="sev sev-${h.severity}">${h.severity}</span> ${esc(h.rule)}</li>`).join('\n');
  cards.push(`<section class="exhibit" id="exhibit-${ex.id}">
  <header><h2>${esc(ex.title)}</h2><p>${esc(ex.note)}</p></header>
  <div class="pair">
    <figure><figcaption>Before · <code>tests/fixtures/${ex.slop}</code> · ${count(slopHits, 'error')} errors, ${count(slopHits, 'warn')} warnings</figcaption>
      <iframe src="pages/${ex.id}-before.html" title="${esc(ex.title)}: before" loading="lazy"></iframe></figure>
    <figure><figcaption>After · <code>tests/fixtures/${ex.clean}</code> · ${count(cleanHits, 'error')} errors, ${count(cleanHits, 'warn')} warnings (with its DESIGN.md tokens)</figcaption>
      <iframe src="pages/${ex.id}-after.html" title="${esc(ex.title)}: after" loading="lazy"></iframe></figure>
  </div>
  <details><summary>All ${slopHits.length} findings in the before page</summary><ol class="findings">${list}</ol></details>
</section>`);
}

const page = `<!doctype html>
<!-- slop-lint-disable-file  (generated by gallery/build.mjs; the frames contain slop on purpose) -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Slop gallery · era ${ERA}</title>
<style>
  :root{--bg:#F3F1EC;--ink:#1B1B1F;--muted:#5C5A55;--line:#D9D5CC;--mark:#C2362B;--ok:#2F6B4F}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif}
  main{max-width:1480px;margin:0 auto;padding:56px 32px 96px}
  h1{font-size:44px;line-height:1.08;margin:0 0 12px;max-width:22ch;font-weight:600}
  .lede{max-width:68ch;color:var(--muted);margin:0 0 8px}
  .meta{font:13px/1.5 ui-monospace,Menlo,monospace;color:var(--muted);margin:0 0 48px}
  .exhibit{border-top:1px solid var(--line);padding-top:32px;margin-top:40px}
  .exhibit header{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:32px;align-items:baseline;margin-bottom:20px}
  h2{font-size:26px;margin:0;font-weight:600}
  .exhibit header p{margin:0;color:var(--muted);max-width:70ch}
  .pair{display:grid;grid-template-columns:1fr 1fr;gap:24px}
  figure{margin:0}
  figcaption{font:13px/1.5 ui-monospace,Menlo,monospace;color:var(--muted);margin-bottom:8px}
  iframe{width:100%;height:760px;border:1px solid var(--line);background:#fff;display:block}
  details{margin-top:16px;font:14px/1.6 ui-monospace,Menlo,monospace}
  summary{cursor:pointer}
  summary:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
  .findings{columns:3;column-gap:32px;padding-left:20px}
  .sev{font-weight:700}.sev-error{color:var(--mark)}.sev-warn{color:#8A5A00}.sev-info{color:var(--muted)}
  code{font-family:ui-monospace,Menlo,monospace;font-size:.92em}
  @media (max-width:900px){.pair,.exhibit header{grid-template-columns:1fr}.findings{columns:1}}
</style>
</head>
<body>
<main>
  <h1>What slop-lint sees, marked on the page</h1>
  <p class="lede">Each exhibit shows a deliberately sloppy fixture next to the clean one. Dashed red outlines are elements slop-lint flagged, with the rule names underneath; findings that belong to styles or the whole file are listed in the dark bar at the top of each frame. These are test fixtures, not client work, and they exaggerate on purpose.</p>
  <p class="meta">Era ${ERA} · ${exhibits.length} exhibits · built by gallery/build.mjs from tests/fixtures</p>
  ${cards.join('\n  ')}
</main>
</body>
</html>
`;
writeFileSync(join(here, 'index.html'), page);
console.log(`gallery: wrote gallery/index.html and ${exhibits.length * 2} pages (era ${ERA})`);
