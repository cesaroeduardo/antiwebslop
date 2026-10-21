#!/usr/bin/env node
// slop-lint-disable-file  (this file contains the patterns it looks for)
//
// slop-lint: flags common "AI slop" web design patterns in source files.
// Zero dependencies, Node >= 18. Framework-agnostic: works on HTML, CSS, JSX/TSX,
// Vue, Svelte, Astro, MDX by matching text, not by parsing.
//
// Usage: node slop-lint.mjs [paths...] [--json] [--quiet] [--max-warnings N] [--ext a,b]
// Exit:  0 = no errors and warnings <= max (default: unlimited)
//        1 = errors found, or warnings > --max-warnings
//        2 = usage error
// Suppress: `slop-lint-disable-line`, `slop-lint-disable-next-line`, or
//           `slop-lint-disable-file` in a comment (add a reason).

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';

const DEFAULT_EXT = ['html', 'htm', 'css', 'scss', 'sass', 'less', 'js', 'jsx', 'mjs', 'ts', 'tsx', 'vue', 'svelte', 'astro', 'mdx'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.svelte-kit', '.output', '.vercel', 'coverage', 'vendor', 'fixtures']);

const EMOJI = '(?![\\u00A9\\u00AE\\u2122\\u2194-\\u2199])\\p{Extended_Pictographic}';
const PURPLE = 'purple|violet|indigo|fuchsia';
const PURPLE_HEX = '#(?:6366f1|4f46e5|4338ca|818cf8|8b5cf6|7c3aed|6d28d9|a78bfa|a855f7|9333ea|c084fc|d946ef)\\b';

// Line rules: severity may be a function of the match.
const LINE_RULES = [
  { id: 'purple-gradient', severity: 'error', msg: 'purple/indigo/violet gradient or glow; derive color from the brand',
    re: [new RegExp(`\\b(?:from|via|to)-(?:${PURPLE})-\\d{2,3}\\b`), new RegExp(`\\bshadow-(?:${PURPLE})-\\d{2,3}\\b`),
         new RegExp(`(?:linear|radial|conic)-gradient\\([^;]*?(?:${PURPLE}|${PURPLE_HEX})`, 'i'),
         new RegExp(`box-shadow:[^;]*${PURPLE_HEX}`, 'i')] },
  { id: 'gradient-text', severity: 'error', msg: 'gradient-text headline; use solid ink and weight/size for emphasis',
    re: [/\bbg-clip-text\b/, /(?:-webkit-)?background-clip:\s*text/i] },
  { id: 'glassmorphism', severity: 'warn', msg: 'backdrop blur; use opaque surfaces unless content really scrolls underneath',
    re: [/\bbackdrop-blur(?:-[\w[\]]+)?\b/, /backdrop-filter:\s*blur/i] },
  { id: 'blur-blob', severity: 'warn', msg: 'decorative blur blob/orb; use real imagery or space',
    test: (l) => (/\bblur-(?:2xl|3xl|\[\d{2,}px\])/.test(l) && /\brounded-full\b/.test(l)) || /\bfilter:\s*blur\(\s*(?:[4-9]\d|\d{3,})px/i.test(l) },
  { id: 'cream-terracotta', msg: 'stock "AI editorial" cream/terracotta palette',
    severityOf: (l) => (/#(?:f4f1ea|f5f0e8|faf7f2|f3efe6)\b/i.test(l) ? 'error' : 'warn'),
    re: [/#(?:f4f1ea|f5f0e8|faf7f2|f3efe6)\b/i, /#(?:d97757|cc785c|e07a5f|c96442)\b/i] },
  { id: 'transition-all', severity: 'error', msg: 'transition all; list properties (opacity, transform)',
    re: [/\btransition-all\b/, /transition(?:-property)?:\s*all\b/i] },
  { id: 'outline-none', severity: 'warn', msg: 'focus outline removed; add a focus-visible replacement',
    test: (l) => /\boutline-none\b|outline:\s*(?:none|0)\s*[;}"']/i.test(l) && !/focus-visible|focus:ring|focus:outline/.test(l) },
  { id: 'slop-copy', severity: 'error', msg: 'generic AI marketing copy; say what the product does, concretely',
    re: [/\bunlock(?:ing)? the (?:full |true )?(?:power|potential)\b/i, /\bsupercharg(?:e|es|ed|ing)\b/i, /\bseamless(?:ly)?\b/i,
         /\belevate your\b/i, /\brevolutioni[sz](?:e|es|ing)\b/i, /\bgame[- ]?chang(?:er|ing)\b/i, /\bnext[- ]level\b/i,
         /\bcutting[- ]edge\b/i, /\bharness(?:ing)? the power\b/i, /\bempower(?:s|ing)? (?:you|your|teams|developers|businesses)\b/i,
         /\beffortless(?:ly)?\b/i, /\bin today'?s fast[- ]paced\b/i, /\bbuilt for the future\b/i, /\bunleash\b/i,
         /\b(?:best|world)[- ]class\b/i, /\btransform the way\b/i, /\blorem ipsum\b/i] },
  { id: 'generic-cta', severity: 'warn', msg: 'generic CTA text; name the action and object',
    re: [/>\s*(?:Get Started(?: Free| Now| Today)?|Learn More|Sign Up Now|Start Now|Try (?:it )?(?:for )?free)\s*(?:<|\{|$)/i,
         /(?:label|text|title|cta)\s*[:=]\s*["'`](?:Get Started|Learn More|Sign Up Now)["'`]/i] },
  { id: 'fake-proof', severity: 'warn', msg: 'unverified social proof or metric; use real, sourced data or remove',
    re: [/\b(?:trusted|loved|used|relied on) by\s+(?:over\s+|more than\s+)?[\d.,]+\s*[kKmM]?\+?/i,
         /\bjoin\s+(?:over\s+|more than\s+)?[\d.,]+\s*[kKmM]?\+?\s+(?:teams|users|developers|companies|customers|creators|players|people)\b/i,
         /\b\d+x\s+(?:faster|better|more|cheaper|productivity)\b/i, /\b99\.9+\s?%/] },
  { id: 'placeholder-name', severity: 'warn', msg: 'placeholder person/company; fake testimonials must not ship',
    re: [/\b(?:John|Jane) (?:Doe|Smith)\b/, /\bAcme(?:\s+(?:Inc|Corp|Co)\.?)?\b/] },
  { id: 'emoji-decoration', msg: 'emoji used as bullet/icon/badge; use real markers, an icon set, or nothing',
    severityOf: () => 'error',
    test: (l) => new RegExp(`>[^<]*?${EMOJI}`, 'u').test(l) || new RegExp(`^\\s*(?:[-*+]|\\d+\\.)\\s+${EMOJI}`, 'u').test(l)
      || new RegExp(`["'\`]\\s*${EMOJI}`, 'u').test(l) },
  { id: 'default-font', severity: 'info', msg: 'Inter/Roboto/Arial: fine for body, but pick a deliberate display face',
    re: [/font-family:\s*["']?(?:Inter|Roboto|Arial)\b/i, /\bfontFamily\b[^\n]*["'](?:Inter|Roboto|Arial)\b/,
         /import\s*\{[^}]*\b(?:Inter|Roboto)\b[^}]*\}\s*from\s*["']next\/font\/google["']/, /fonts\.googleapis\.com\/css2?\?family=(?:Inter|Roboto)\b/] },
  { id: 'three-col-grid', severity: 'info', msg: '3-column grid: make sure it is not three equal feature cards',
    re: [/(?:^|[\s"'`])(?:sm:|md:|lg:|xl:)?grid-cols-3\b/, /grid-template-columns:\s*repeat\(\s*3\s*,\s*(?:1fr|minmax)/i] },
];

const ICON_IMPORT = /import\s*\{([^}]*)\}\s*from\s*["'](?:lucide-react|lucide-vue-next|lucide-svelte|@heroicons\/react[^"']*|react-icons[^"']*|@tabler\/icons-react|@phosphor-icons\/react)["']/gs;

function fileRules(text, lines) {
  const out = [];
  const firstLine = (re) => { const i = lines.findIndex((l) => re.test(l)); return i < 0 ? 1 : i + 1; };
  const uniform = lines.filter((l) => /\brounded-(?:xl|2xl|3xl)\b/.test(l) && /\bshadow-(?:md|lg|xl|2xl)\b/.test(l)).length;
  if (uniform >= 3) out.push({ rule: 'uniform-radius-shadow', severity: 'warn', line: firstLine(/\brounded-(?:xl|2xl|3xl)\b.*\bshadow-(?:md|lg|xl|2xl)\b|\bshadow-(?:md|lg|xl|2xl)\b.*\brounded-(?:xl|2xl|3xl)\b/),
    msg: `same large radius + shadow on ${uniform} elements; vary radius/elevation by role` });
  let icons = 0; for (const m of text.matchAll(ICON_IMPORT)) icons += m[1].split(',').filter((s) => s.trim()).length;
  if (icons > 8) out.push({ rule: 'icon-soup', severity: 'warn', line: firstLine(/from\s*["'](?:lucide|@heroicons|react-icons|@tabler|@phosphor)/),
    msg: `${icons} icons imported in one file; keep icons where they aid scanning` });
  const motion = /@keyframes|\banimate-(?:spin|ping|pulse|bounce|\[)|\banimation:\s*(?!none)\w/;
  if (motion.test(text) && !/prefers-reduced-motion|motion-reduce:|motion-safe:|useReducedMotion|reducedMotion/.test(text))
    out.push({ rule: 'motion-no-reduce', severity: 'warn', line: firstLine(motion), msg: 'animation without prefers-reduced-motion / motion-safe guard' });
  const centered = lines.filter((l) => /\btext-center\b|text-align:\s*center/.test(l)).length;
  if (centered >= 6) out.push({ rule: 'centered-everything', severity: 'info', line: firstLine(/\btext-center\b|text-align:\s*center/),
    msg: `${centered} centered blocks; left-align body copy and most sections` });
  return out;
}

export function lintText(text) {
  if (/slop-lint-disable-file/.test(text)) return [];
  const lines = text.split(/\r?\n/);
  const hits = [];
  lines.forEach((line, i) => {
    if (/slop-lint-disable-line/.test(line) || (i > 0 && /slop-lint-disable-next-line/.test(lines[i - 1]))) return;
    for (const r of LINE_RULES) {
      const matched = r.test ? r.test(line) : r.re.some((re) => re.test(line));
      if (matched) hits.push({ rule: r.id, severity: r.severityOf ? r.severityOf(line) : r.severity, line: i + 1, msg: r.msg, snippet: line.trim().slice(0, 100) });
    }
  });
  for (const h of fileRules(text, lines)) {
    const prev = lines[h.line - 2] || '';
    if (/slop-lint-disable-line/.test(lines[h.line - 1] || '') || /slop-lint-disable-next-line/.test(prev)) continue;
    hits.push({ ...h, snippet: (lines[h.line - 1] || '').trim().slice(0, 100) });
  }
  return hits.sort((a, b) => a.line - b.line);
}

function collect(p, exts, files, explicit) {
  const st = statSync(p);
  if (st.isDirectory()) {
    if (!explicit && SKIP_DIRS.has(basename(p))) return;
    for (const e of readdirSync(p)) collect(join(p, e), exts, files, false);
  } else if (explicit || (exts.includes(extname(p).slice(1).toLowerCase()) && !/\.min\./.test(p))) {
    files.push(p);
  }
}

function main(argv) {
  const args = { paths: [], json: false, quiet: false, maxWarnings: Infinity, ext: DEFAULT_EXT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') args.json = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--max-warnings') args.maxWarnings = Number(argv[++i]);
    else if (a === '--ext') args.ext = String(argv[++i]).split(',').map((s) => s.trim().replace(/^\./, ''));
    else if (a === '-h' || a === '--help') { console.log('usage: slop-lint [paths...] [--json] [--quiet] [--max-warnings N] [--ext html,css,...]'); return 0; }
    else if (a.startsWith('-')) { console.error(`slop-lint: unknown option ${a}`); return 2; }
    else args.paths.push(a);
  }
  if (!args.paths.length) args.paths = ['.'];
  if (Number.isNaN(args.maxWarnings)) { console.error('slop-lint: --max-warnings needs a number'); return 2; }
  const files = [];
  for (const p of args.paths) {
    if (!existsSync(p)) { console.error(`slop-lint: no such path ${p}`); return 2; }
    collect(p, args.ext, files, true);
  }
  const results = [];
  for (const f of files) {
    let text; try { text = readFileSync(f, 'utf8'); } catch { continue; }
    for (const h of lintText(text)) results.push({ file: relative(process.cwd(), f) || f, ...h });
  }
  const shown = args.quiet ? results.filter((r) => r.severity !== 'info') : results;
  const count = (s) => results.filter((r) => r.severity === s).length;
  const summary = { files: files.length, errors: count('error'), warnings: count('warn'), info: count('info'), byRule: {} };
  for (const r of results) summary.byRule[r.rule] = (summary.byRule[r.rule] || 0) + 1;
  if (args.json) console.log(JSON.stringify({ summary, results: shown }, null, 2));
  else {
    for (const r of shown) console.log(`${r.file}:${r.line}  ${r.severity.padEnd(5)}  ${r.rule.padEnd(22)}  ${r.msg}\n    » ${r.snippet}`);
    const rules = Object.entries(summary.byRule).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(', ');
    console.log(`\nslop-lint: ${results.length} hits (${summary.errors} error, ${summary.warnings} warn, ${summary.info} info) in ${summary.files} files${rules ? `\n  by rule: ${rules}` : ''}`);
  }
  return summary.errors > 0 || summary.warnings > args.maxWarnings ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('slop-lint.mjs')) process.exitCode = main(process.argv.slice(2));
