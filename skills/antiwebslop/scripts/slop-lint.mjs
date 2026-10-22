#!/usr/bin/env node
// slop-lint-disable-file  (this file contains the patterns it looks for)
//
// slop-lint: flags common "AI slop" web design patterns in source files.
// Zero dependencies, Node >= 18. Framework-agnostic: works on HTML, CSS, JSX/TSX,
// Vue, Svelte, Astro, MDX by matching text, not by parsing.
//
// Usage: node slop-lint.mjs [paths...] [--json] [--quiet] [--max-warnings N] [--ext a,b]
//                           [--design path/to/DESIGN.md | --no-design]
// Token drift: if a DESIGN.md with a ```design-tokens block is found (or passed with
// --design), fonts, colors and radii outside the documented tokens are reported.
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
  { id: 'generic-cta', severity: 'warn', msg: 'generic CTA text; name the action and object (or drop repeated View more / Learn more on every card)',
    re: [/>\s*(?:Get Started(?: Free| Now| Today)?|Learn More|View [Mm]ore|Sign Up Now|Start Now|Try (?:it )?(?:for )?free)\s*(?:<|\{|$)/i,
         /(?:label|text|title|cta)\s*[:=]\s*["'`](?:Get Started|Learn More|View [Mm]ore|Sign Up Now)["'`]/i] },
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
  { id: 'side-tab-border', severity: 'warn', msg: 'thick colored side stripe on a card; use it only for real status, else drop it',
    re: [/\bborder-[lrse]-(?:[2-8]|\[\d+px\])\b/, /border-(?:left|right|inline-start|inline-end)(?:-width)?:\s*(?:[2-9]|\d{2,})px\b/i] },
  { id: 'hard-offset-shadow', severity: 'warn', msg: 'zero-blur offset shadow; only if the project really is neobrutalist',
    test: (l) => /box-shadow:\s*-?[1-9]\d*px\s+-?\d+px\s+0(?:px)?(?:\s|;|$)/i.test(l) || /box-shadow:\s*-?\d+px\s+-?[1-9]\d*px\s+0(?:px)?(?:\s|;|$)/i.test(l)
      || /\bshadow-\[-?\d+px_-?\d+px_0(?:px)?(?:_|\])/.test(l) },
  { id: 'bounce-easing', severity: 'warn', msg: 'bounce/elastic/overshoot easing; settle with a plain ease-out',
    test: (l) => /\banimate-bounce\b/.test(l) || /\b(?:ease(?:In|Out|InOut)(?:Back|Elastic|Bounce)|elastic\.(?:out|in)|back\.(?:out|in)|bounce\.(?:out|in))\b/.test(l)
      || [...l.matchAll(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g)].some((m) => +m[2] < 0 || +m[2] > 1 || +m[4] < 0 || +m[4] > 1) },
  { id: 'attention-loop', severity: 'warn', msg: 'pulsing dot or marquee that moves forever; keep static things still',
    test: (l) => (/\banimate-(?:ping|pulse)\b/.test(l) && /\brounded-full\b/.test(l) && /\b(?:h|w|size)-(?:1|1\.5|2|2\.5|3)\b/.test(l))
      || /<marquee\b/i.test(l) || /\b(?:class|className)=["'`][^"'`]*\bmarquee\b/.test(l) || /animation(?:-name)?:\s*[^;]*\b(?:marquee|ticker|scroll-x)\b/i.test(l) },
  { id: 'section-number', severity: 'warn', msg: '01/02/03 section label; number only real sequences',
    re: [/>\s*0[1-9]\s*(?:[\/·.—–-]\s*[A-Za-z][^<]*)?<\//, /["'`]0[1-9]\s*[\/·—–-]\s*[A-Z][a-z]+["'`]/] },
  { id: 'gray-on-color', severity: 'warn', msg: 'gray text on a colored surface; tint the text from the surface hue or use a light ink',
    test: (l) => /\bbg-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|primary|accent|brand)(?:-[4-9]00)?\b/.test(l)
      && /\btext-(?:gray|slate|zinc|neutral|stone)-[3-6]00\b/.test(l) },
  { id: 'not-x-a-y', severity: 'warn', msg: '"Not X. A Y." slogan contrast; state the useful fact directly',
    re: [/\b(?:Not|It'?s not|isn'?t) (?:just |only |another |a |an |your )[^.!?<]{1,40}[.!]\s*(?:It'?s |It is )?(?:A|An|The|Your) [A-Za-z]/] },
  { id: 'default-font', severity: 'info', msg: 'Inter/Roboto/Arial: fine for body, but pick a deliberate display face',
    re: [/font-family:\s*["']?(?:Inter|Roboto|Arial)\b/i, /\bfontFamily\b[^\n]*["'](?:Inter|Roboto|Arial)\b/,
         /import\s*\{[^}]*\b(?:Inter|Roboto)\b[^}]*\}\s*from\s*["']next\/font\/google["']/, /fonts\.googleapis\.com\/css2?\?family=(?:Inter|Roboto)\b/] },
  { id: 'three-col-grid', severity: 'info', msg: '3-column grid: make sure it is not three equal feature cards',
    re: [/(?:^|[\s"'`])(?:sm:|md:|lg:|xl:)?grid-cols-3\b/, /grid-template-columns:\s*repeat\(\s*3\s*,\s*(?:1fr|minmax)/i] },
  { id: 'period-logo', severity: 'warn', msg: 'wordmark ends with a decorative period; drop the trailing dot',
    re: [/>\s*(?:&lt;|<)?[A-Za-z][A-Za-z0-9]{1,18}\.(?:\/?&gt;|\/?>)\s*</,
         />\s*[A-Z][A-Za-z0-9]{1,18}\.\s*</,
         /(?:aria-label|alt)\s*=\s*["'`][A-Z][A-Za-z0-9]{1,18}\.["'`]/] },
  { id: 'hero-text-strip', severity: 'warn', msg: 'decorative all-caps noun strip in the hero; put a concrete product fact or nothing',
    re: [/\b(?:BRAND|TYPE|FORM|MOTION|SPATIAL|DESIGN|CRAFT|SYSTEM|SIGNAL|VISION)\s*[./·|]\s*(?:BRAND|TYPE|FORM|MOTION|SPATIAL|DESIGN|CRAFT|SYSTEM|SIGNAL|VISION)/,
         />\s*[A-Z]{3,}(?:\s*[./·|]\s*[A-Z]{3,}){2,}\s*</] },
  { id: 'locale-weather', severity: 'warn', msg: 'locale/time/weather atmosphere strip; drop unless the product is about place or weather',
    re: [/\b(?:Lisbon|London|Paris|Berlin|Tokyo|NYC|New York|São Paulo|Sao Paulo|SF|LA)\b[^<\n]{0,40}(?:\d{1,2}:\d{2}|\d{1,2}\s?°\s?[CF]|Clear|Cloudy|Sunny)/i,
         /\b\d{1,2}:\d{2}\b[^<\n]{0,24}\d{1,2}\s?°\s?[CF]\b/,
         /\b\d{1,2}\s?°\s?[CF]\b[^<\n]{0,24}\d{1,2}:\d{2}\b/] },
  { id: 'scroll-cue', severity: 'warn', msg: 'scroll prompt or bouncing chevron; the next section should invite scrolling by content',
    re: [/>\s*Scroll(?:\s+to\s+(?:explore|discover|learn\s+more)|\s+down)?\s*</i,
         /\b(?:scroll[-_]?cue|scroll[-_]?indicator|scroll[-_]?hint)\b/i,
         /(?:aria-label|alt|title)\s*=\s*["'`][^"'`]*\bscroll\b[^"'`]*["'`]/i] },
  { id: 'version-footer', severity: 'warn', msg: 'build/version stamp on a marketing surface; keep versions in changelog or product UI',
    re: [/\bv\d+\.\d+\.\d+\b/, /\bBuild\s+#?\d{2,}\b/i, /\blast sync\b/i, /\bcommit\s+[0-9a-f]{7,}\b/i] },
  { id: 'hero-version', severity: 'warn', msg: 'BETA / version / invite pill in the hero; put release status in the nav or changelog',
    re: [/>\s*(?:BETA|ALPHA|EARLY\s+ACCESS|INVITE[- ]?ONLY|PRIVATE\s+BETA)\s*</i,
         /(?:class|className)=["'`][^"'`]*(?:badge|pill|chip)[^"'`]*["'`][^>]*>\s*(?:BETA|ALPHA|V?\d+\.\d+)/i] },
  { id: 'italic-serif-display', severity: 'warn', msg: 'italic serif at display size; pick a display face that fits this product',
    test: (l) => (/\bfont-serif\b/.test(l) && /\bitalic\b/.test(l) && /\btext-(?:4xl|5xl|6xl|7xl|8xl|9xl)\b/.test(l))
      || (/\bfont-(?:family):\s*[^;]*serif/i.test(l) && /font-style:\s*italic/i.test(l)) },
  { id: 'italic-serif-word', severity: 'warn', msg: 'one-word italic serif inside a sans headline; keep the title in one family',
    test: (l) => {
      if (!/\bfont-serif\b/.test(l) || !/\bitalic\b/.test(l)) return false;
      // Full-headline italic serif is covered by italic-serif-display.
      if (/\btext-(?:4xl|5xl|6xl|7xl|8xl|9xl)\b/.test(l)) return false;
      return /<(?:span|em|i)\b/i.test(l) || /\b(?:class|className)=["'`][^"'`]*(?:font-serif[^"'`]*italic|italic[^"'`]*font-serif)/.test(l);
    } },
  { id: 'blink-cursor', severity: 'warn', msg: 'blinking caret on static copy; keep cursors only where the user can type',
    re: [/\bcursor[-_]?(?:blink|caret)\b/i, /\banimate-(?:pulse|ping)\b[^"'`>]*[│|▌]/,
         />\s*[│|▌]\s*</, /@keyframes\s+\w*(?:blink|caret|cursor)/i] },
  { id: 'grid-bg', severity: 'warn', msg: 'decorative line-grid background; keep grids for canvases, maps, or editors',
    re: [/\b(?:bg|background)[-_]?(?:grid|graph[-_]?paper)\b/i,
         /(?:background(?:-image)?):\s*[^;]*(?:repeating-linear-gradient|linear-gradient)[^;]*(?:1px|hairline)[^;]*(?:1px|hairline)/i,
         /(?:background(?:-image)?):\s*[^;]*linear-gradient\([^)]*(?:#(?:e5e5e5|e5e7eb|d4d4d4|d1d5db)|rgba?\([^)]*0\.\d+\))[^)]*\)\s*,\s*linear-gradient/i] },
  { id: 'faded-dot-grid', severity: 'warn', msg: 'dotted/checkered grid with edge fade; keep grids for real canvases, without a vignette',
    re: [/\b(?:dot(?:ted)?[-_]?grid|bg-dot(?:s)?|dot[-_]?pattern|checkered[-_]?bg|grid[-_]?fade)\b/i,
         /radial-gradient\(\s*(?:circle(?:\s+\d+px)?\s+at\s+\d|circle\s*,)[^)]*(?:transparent|1px)/i,
         /(?:-webkit-)?mask(?:-image)?:\s*[^;]*radial-gradient/i,
         /mask-image:\s*[^;]*linear-gradient[^;]*transparent/i,
         /(?:background(?:-image)?):\s*[^;]*radial-gradient\([^)]*circle[^)]*(?:1px|2px)[^)]*transparent[^)]*\)[^;]*(?:repeating|,\s*radial)/i] },
  { id: 'soft-spotlight', severity: 'warn', msg: 'soft radial spotlight behind content; use size/weight/space for emphasis',
    re: [/\bradial-gradient\([^)]*(?:ellipse\s+)?(?:at\s+(?:center|top|50%))[^)]*(?:rgba?\([^)]*,\s*0\.\d+\)|transparent)/i,
         /\b(?:soft[-_]?glow|ambient[-_]?glow|spotlight[-_]?(?:bg|glow|wash))\b/i] },
  { id: 'hairline-wide-shadow', severity: 'warn', msg: 'hairline border and wide shadow on the same card; pick one edge treatment',
    test: (l) => (/\bborder\b/.test(l) || /border(?:-width)?:\s*1px\b/i.test(l))
      && (/\bshadow-(?:xl|2xl)\b/.test(l) || /box-shadow:\s*[^;]*(?:\d{2,}px\s+){2,}\d{2,}px/i.test(l))
      && !/\bborder-0\b|\bborder-none\b|border:\s*(?:none|0)\b/i.test(l)
      && !/\bborder-[trblse]\b/.test(l) },
  { id: 'extreme-radius', severity: 'warn', msg: 'huge radius on a card; match corner curve to the card size',
    // Flag blob radii (~2rem–6rem / 32–96px / rounded-3xl). Skip full pills (9999px, 100%, full).
    test: (l) => {
      if (/\brounded-(?:full|none)\b/.test(l) || /border-radius:\s*(?:9999px|100%|999rem)\b/i.test(l)) return false;
      if (/\brounded-3xl\b/.test(l)) return true;
      const tw = l.match(/\brounded-(?:[trblse]{1,2}-)?\[(\d+(?:\.\d+)?)(px|rem)?\]/);
      if (tw) {
        const n = +tw[1]; const u = tw[2] || 'px';
        return u === 'rem' ? n >= 1.5 && n <= 6 : n >= 32 && n <= 96;
      }
      const css = l.match(/border-radius:\s*(\d+(?:\.\d+)?)(px|rem)\b/i);
      if (css) {
        const n = +css[1]; const u = css[2].toLowerCase();
        return u === 'rem' ? n >= 1.5 && n <= 6 : n >= 32 && n <= 96;
      }
      return false;
    } },
  { id: 'row-double-border', severity: 'warn', msg: 'top and bottom border on every list row; use one divider or another component',
    test: (l) => (/\bborder-t\b/.test(l) && /\bborder-b\b/.test(l))
      || /border-(?:top|bottom)(?:-width)?:\s*[^;]+;[^;]*border-(?:bottom|top)/i.test(l) },
  { id: 'stripe-fill', severity: 'warn', msg: 'repeating-gradient stripes as fill; use a plain surface or a brand texture',
    re: [/repeating-(?:linear|conic)-gradient\s*\(/i, /\b(?:stripe(?:d|s)?[-_]?(?:bg|fill|pattern)|bg-stripes)\b/i] },
  { id: 'all-caps-body', severity: 'warn', msg: 'all-caps body block; use sentence case for paragraphs',
    test: (l) => {
      if (!(/\buppercase\b/.test(l) || /text-transform:\s*uppercase/i.test(l))) return false;
      // Tiny tracked labels / eyebrows are fine; body-sized caps are not.
      if (/\b(?:text-(?:\[?\d{1,2}px\]?|xs|cap)|tracking-(?:wide|wider|widest|\[))\b/.test(l)) return false;
      return /\b(?:text-(?:base|lg|xl)|leading-(?:relaxed|7|8)|max-w-prose|prose)\b/.test(l)
        || /<(?:p|P)\b/.test(l);
    } },
  { id: 'jagged-mask', severity: 'warn', msg: 'jagged clip-path mask on an image; use a clean crop or a prepared cut-out',
    re: [/clip-path:\s*polygon\s*\(/i, /\bclip-path-\[polygon\(/i] },
  { id: 'justified-body', severity: 'warn', msg: 'justified body text; start-align paragraphs on the web',
    re: [/\btext-justify\b/, /text-align:\s*justify\b/i] },
  { id: 'icon-tile', severity: 'warn', msg: 'large icon tile stacked above a feature heading; put the icon beside the title or drop it',
    test: (l) => (/\b(?:size|h|w)-(?:10|12|14|16|20)\b/.test(l) && /\brounded-(?:xl|2xl|3xl|\[)/.test(l)
        && (/\b(?:bg-|from-)/.test(l) || /\bshadow\b/.test(l)))
      || (/\b(?:icon[-_]?tile|feature[-_]?icon|icon[-_]?box)\b/i.test(l)) },
  { id: 'crushed-tracking', severity: 'warn', msg: 'display tracking tighter than −0.04em; ease up so glyphs do not collide',
    test: (l) => {
      if (/\btracking-tighter\b/.test(l)) return true;
      const em = (n, u) => {
        const v = +n;
        if (u === 'em' || u === 'rem' || !u) return v;
        if (u === 'px') return v / 16;
        return null;
      };
      for (const m of l.matchAll(/\btracking-\[(-?\d+(?:\.\d+)?)(em|rem|px)?\]/g)) {
        const v = em(m[1], m[2]);
        if (v != null && v <= -0.05) return true;
      }
      for (const m of l.matchAll(/letter-spacing:\s*(-?\d+(?:\.\d+)?)(em|rem|px)\b/gi)) {
        const v = em(m[1], m[2].toLowerCase());
        if (v != null && v <= -0.05) return true;
      }
      return false;
    } },
  { id: 'wide-body-tracking', severity: 'warn', msg: 'wide tracking on body copy; keep letter-spacing for short labels',
    test: (l) => {
      const wide = /\btracking-(?:wide|wider|widest)\b/.test(l)
        || /letter-spacing:\s*(\d+(?:\.\d+)?)(em|rem|px)\b/i.test(l) && (() => {
          const m = l.match(/letter-spacing:\s*(\d+(?:\.\d+)?)(em|rem|px)\b/i);
          if (!m) return false;
          const n = +m[1]; const u = m[2].toLowerCase();
          const em = u === 'px' ? n / 16 : n;
          return em >= 0.05;
        })()
        || /\btracking-\[(\d+(?:\.\d+)?)(em|rem|px)?\]/.test(l) && (() => {
          const m = l.match(/\btracking-\[(\d+(?:\.\d+)?)(em|rem|px)?\]/);
          if (!m) return false;
          const n = +m[1]; const u = m[2] || 'em';
          const em = u === 'px' ? n / 16 : n;
          return em >= 0.05;
        })();
      if (!wide) return false;
      if (/\b(?:text-(?:\[?\d{1,2}px\]?|xs|cap)|uppercase)\b/.test(l) && !/<(?:p|P)\b/.test(l)) return false;
      return /\b(?:text-(?:base|lg|xl)|leading-(?:relaxed|7|8)|max-w-prose|prose)\b/.test(l)
        || /<(?:p|P)\b/.test(l);
    } },
  { id: 'weightless-display', severity: 'warn', msg: 'ultralight weight at display size; use medium/semibold for headlines',
    test: (l) => {
      const light = /\bfont-(?:thin|extralight|light)\b/.test(l) || /font-weight:\s*(?:100|200|300)\b/.test(l);
      if (!light) return false;
      return /\btext-(?:4xl|5xl|6xl|7xl|8xl|9xl)\b/.test(l)
        || /font-size:\s*(?:clamp\([^)]*(?:[3-9]|[1-9]\d)\s*rem|[3-9](?:\.\d+)?rem|[4-9]\dpx|[1-9]\d{2,}px)/i.test(l);
    } },
  { id: 'mono-body', severity: 'warn', msg: 'monospace used as body copy; keep mono for data, labels, and code',
    test: (l) => {
      if (!(/\bfont-mono\b/.test(l) || /font-family:\s*[^;}]*\bmonospace\b/i.test(l))) return false;
      if (/<(?:code|pre|kbd|samp)\b/i.test(l)) return false;
      if (/\btext-(?:\[?\d{1,2}px\]?|xs|cap)\b/.test(l)) return false;
      return /\b(?:text-(?:base|lg|xl)|leading-(?:relaxed|7|8)|max-w-prose|prose)\b/.test(l)
        || /<(?:p|P)\b/.test(l);
    } },
];

const FILE_RULES = [
  ['uniform-radius-shadow', 'warn'], ['icon-soup', 'warn'], ['motion-no-reduce', 'warn'], ['centered-everything', 'info'],
  ['eyebrow-kicker', 'warn'], ['hero-metric', 'warn'], ['em-dash-overuse', 'warn'], ['kit-monoculture', 'warn'],
  ['missing-wrap', 'info'],
  ['token-font', 'warn'], ['token-color', 'warn'], ['token-radius', 'warn'],
];

const WRAP_UTIL = /\btext-(?:balance|pretty)\b|text-wrap:\s*(?:balance|pretty)\b|\[text-wrap:(?:balance|pretty)\]/;
const GLOBAL_HEADING_WRAP = /(?:^|[,{}\s])h[1-6](?:\s*,\s*h[1-6])*\s*\{[^}]*text-wrap\s*:|(?:@apply)[^;]*\btext-(?:balance|pretty)\b/i;
const GLOBAL_P_WRAP = /(?:^|[,{}\s])p\s*\{[^}]*text-wrap\s*:/i;
export const RULES = [...LINE_RULES.map((r) => [r.id, r.severity || 'error|warn']), ...FILE_RULES];

const ICON_IMPORT = /import\s*\{([^}]*)\}\s*from\s*["'](?:lucide-react|lucide-vue-next|lucide-svelte|@heroicons\/react[^"']*|react-icons[^"']*|@tabler\/icons-react|@phosphor-icons\/react)["']/gs;
// Stock kit families agents default to stacking even when plain structure would do.
const KIT_FAMILIES = [
  [/<(?:Card|CardHeader|CardTitle|CardDescription|CardContent|CardFooter)\b/, 'Card'],
  [/<(?:Badge)\b/, 'Badge'],
  [/<(?:Button)\b/, 'Button'],
  [/<(?:Separator)\b/, 'Separator'],
  [/<(?:Dialog|DialogContent|DialogHeader|DialogTitle|DialogTrigger|DialogFooter)\b/, 'Dialog'],
];

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
    msg: `${centered} centered blocks — OK if intentional (low V, splash, short statements); avoid as a default for long body copy` });
  const eyebrowRe = /\b(?:eyebrow|kicker|overline)\b|(?=.*\buppercase\b)(?=.*\btracking-(?:wide|wider|widest|\[))|(?=.*\brounded-full\b)(?=.*\btext-xs\b)(?=.*\b(?:px-[2-3]|border)\b)/;
  const headingRe = /<(?:h[1-3]|H1|Heading)\b/;
  lines.forEach((l, i) => {
    if (!eyebrowRe.test(l) || headingRe.test(l)) return;
    const next = lines.slice(i + 1, i + 4).join('\n');
    if (headingRe.test(next)) out.push({ rule: 'eyebrow-kicker', severity: 'warn', line: i + 1, msg: 'small label above a heading; fold the useful words into the heading or drop it' });
  });
  const metricRe = /\btext-(?:4xl|5xl|6xl|7xl|8xl|9xl)\b[^>]*>\s*[$€£R]*\$?[\d.,]+\s*(?:%|[kKmMbB]|x|\+|ms|s)?\+?\s*</;
  const metrics = lines.filter((l) => metricRe.test(l)).length;
  if (metrics >= 3) out.push({ rule: 'hero-metric', severity: 'warn', line: firstLine(metricRe),
    msg: `${metrics} big-number stats; the stat-row template says little unless each number has context and a source` });
  const kitHit = KIT_FAMILIES.filter(([re]) => re.test(text)).map(([, name]) => name);
  if (kitHit.length >= 4) out.push({ rule: 'kit-monoculture', severity: 'warn', line: firstLine(/<(?:Card|Badge|Button|Separator|Dialog)\b/),
    msg: `stock kit combo (${kitHit.join(', ')}); prefer simpler structure when a card/dialog is not needed` });
  const dashLines = lines.filter((l) => /\S\s?—\s?\S/.test(l) && !/^\s*(?:\/\/|\/\*|\*|<!--)/.test(l)).length;
  if (dashLines >= 4) out.push({ rule: 'em-dash-overuse', severity: 'warn', line: firstLine(/\S\s?—\s?\S/),
    msg: `em dashes on ${dashLines} lines; split into sentences or use other punctuation` });
  // Widow prevention: require wrap utilities on display titles / lead copy unless the file sets text-wrap globally.
  const globalH = GLOBAL_HEADING_WRAP.test(text);
  const globalP = GLOBAL_P_WRAP.test(text);
  if (!globalH || !globalP) {
    lines.forEach((l, i) => {
      if (WRAP_UTIL.test(l)) return;
      if (/\b(?:nav|button|label|Badge|Button)\b/.test(l) && !/<h[1-3]\b/i.test(l)) return;
      const words = l.replace(/<[^>]+>/g, ' ').replace(/\{[^}]*\}/g, ' ').split(/\s+/).filter((w) => /[A-Za-zÀ-ÖØ-öø-ÿ]{2,}/.test(w));
      if (words.length <= 1) return;
      const display = /\btext-(?:4xl|5xl|6xl|7xl|8xl|9xl)\b/.test(l);
      const isH1 = /<h1\b/i.test(l);
      const isLead = /<p\b/i.test(l) && /\btext-(?:lg|xl|2xl)\b/.test(l);
      if (isH1 && !globalH) {
        out.push({ rule: 'missing-wrap', severity: 'info', line: i + 1, msg: 'display title without text-balance / text-wrap: balance; avoid a lone last-line word' });
        return;
      }
      if (display && /<(?:h[1-3]|p|div|span)\b/i.test(l) && !globalH) {
        out.push({ rule: 'missing-wrap', severity: 'info', line: i + 1, msg: 'display type without text-balance / text-wrap: balance; avoid a lone last-line word' });
        return;
      }
      if (isLead && !globalP) {
        out.push({ rule: 'missing-wrap', severity: 'info', line: i + 1, msg: 'lead/description without text-pretty / text-wrap: pretty; avoid a lone last-line word' });
      }
    });
  }
  return out;
}

const GENERIC_FONTS = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif',
  'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong', 'inherit', 'initial', 'unset', 'revert', '-apple-system', 'blinkmacsystemfont']);
const norm = (v) => v.trim().replace(/^["']|["']$/g, '').trim().toLowerCase();
function normColor(c) {
  c = c.toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(c)) return '#' + [...c.slice(1)].map((x) => x + x).join('');
  if (/^#[0-9a-f]{4}$/.test(c)) return '#' + [...c.slice(1)].map((x) => x + x).join('');
  return c;
}

// Parse the ```design-tokens block of a DESIGN.md. Format (one key per line):
//   fonts: Söhne, GT Sectra, JetBrains Mono
//   colors: #FBFBFA, #17181A, #5B5F66
//   radii: 0, 6px, 10px, 9999px
export function parseDesignTokens(md) {
  const m = md.match(/```design-tokens\s*\r?\n([\s\S]*?)```/);
  if (!m) return null;
  const t = { fonts: new Set(), colors: new Set(), radii: new Set() };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^\s*(fonts|colors|radii)\s*:\s*(.+?)\s*$/i);
    if (!kv) continue;
    const key = kv[1].toLowerCase();
    for (const v of kv[2].split(',').map(norm).filter(Boolean)) t[key].add(key === 'colors' ? normColor(v) : v);
  }
  return t;
}

function tokenDrift(lines, tokens) {
  const out = [];
  if (!tokens) return out;
  lines.forEach((l, i) => {
    const line = i + 1;
    if (tokens.fonts.size) {
      const ff = l.match(/font-family:\s*([^;}"]+)/i);
      const fams = ff ? ff[1].split(',').map((v) => v.trim().replace(/^["']|["']$/g, '')) : [];
      const tw = l.match(/\bfont-\[['"]?([^\]'"]+)['"]?\]/);
      if (tw) fams.push(tw[1].replace(/_/g, ' '));
      for (const f of fams) { const k = norm(f);
        if (k && !k.startsWith('var(') && !GENERIC_FONTS.has(k) && !tokens.fonts.has(k))
          out.push({ rule: 'token-font', severity: 'warn', line, msg: `font "${f}" is not in DESIGN.md tokens; use a documented font or add it there` }); }
    }
    if (tokens.colors.size) {
      for (const m of l.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        const c = normColor(m[0]);
        if (![4, 7, 9].includes(c.length) || tokens.colors.has(c) || tokens.colors.has(c.slice(0, 7))) continue;
        out.push({ rule: 'token-color', severity: 'warn', line, msg: `color ${m[0]} is not in DESIGN.md tokens; use a palette token or add it there` });
      }
    }
    if (tokens.radii.size) {
      const vals = [];
      const br = l.match(/border-radius:\s*([^;}"]+)/i);
      if (br) vals.push(...br[1].trim().split(/\s+/).map(norm));
      for (const m of l.matchAll(/\brounded(?:-[trblse]{1,2})?-\[([^\]]+)\]/g)) vals.push(norm(m[1]));
      for (const v of vals) if (v && !/^var\(/.test(v) && v !== '0' && !tokens.radii.has(v))
        out.push({ rule: 'token-radius', severity: 'warn', line, msg: `radius ${v} is not in DESIGN.md tokens; use a documented radius or add it there` });
    }
  });
  return out;
}

export function lintText(text, { tokens = null } = {}) {
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
  for (const h of [...fileRules(text, lines), ...tokenDrift(lines, tokens)]) {
    const prev = lines[h.line - 2] || '';
    if (/slop-lint-disable-line/.test(lines[h.line - 1] || '') || /slop-lint-disable-next-line/.test(prev)) continue;
    hits.push({ ...h, snippet: (lines[h.line - 1] || '').trim().slice(0, 100) });
  }
  return hits.sort((a, b) => a.line - b.line);
}

export function findDesignMd(dir) {
  for (const c of ['DESIGN.md', 'docs/DESIGN.md']) { const p = join(dir, c); if (existsSync(p)) return p; }
  return null;
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
  const args = { paths: [], json: false, quiet: false, maxWarnings: Infinity, ext: DEFAULT_EXT, design: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') args.json = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--design') args.design = argv[++i];
    else if (a === '--no-design') args.design = null;
    else if (a === '--list-rules') { for (const [id, sev] of RULES) console.log(`${id.padEnd(22)} ${sev}`); console.log(`${RULES.length} rules`); return 0; }
    else if (a === '--max-warnings') args.maxWarnings = Number(argv[++i]);
    else if (a === '--ext') args.ext = String(argv[++i]).split(',').map((s) => s.trim().replace(/^\./, ''));
    else if (a === '-h' || a === '--help') { console.log('usage: slop-lint [paths...] [--json] [--quiet] [--max-warnings N] [--ext html,css,...] [--design DESIGN.md | --no-design]'); return 0; }
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
  if (args.design && !existsSync(args.design)) { console.error(`slop-lint: no such DESIGN.md ${args.design}`); return 2; }
  const designPath = args.design === null ? null : args.design || findDesignMd(process.cwd());
  const tokens = designPath ? parseDesignTokens(readFileSync(designPath, 'utf8')) : null;
  const results = [];
  for (const f of files) {
    let text; try { text = readFileSync(f, 'utf8'); } catch { continue; }
    for (const h of lintText(text, { tokens })) results.push({ file: relative(process.cwd(), f) || f, ...h });
  }
  const shown = args.quiet ? results.filter((r) => r.severity !== 'info') : results;
  const count = (s) => results.filter((r) => r.severity === s).length;
  const summary = { files: files.length, design: designPath && tokens ? relative(process.cwd(), designPath) || designPath : null, errors: count('error'), warnings: count('warn'), info: count('info'), byRule: {} };
  for (const r of results) summary.byRule[r.rule] = (summary.byRule[r.rule] || 0) + 1;
  if (args.json) console.log(JSON.stringify({ summary, results: shown }, null, 2));
  else {
    for (const r of shown) console.log(`${r.file}:${r.line}  ${r.severity.padEnd(5)}  ${r.rule.padEnd(22)}  ${r.msg}\n    » ${r.snippet}`);
    const rules = Object.entries(summary.byRule).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(', ');
    console.log(`\nslop-lint: ${results.length} hits (${summary.errors} error, ${summary.warnings} warn, ${summary.info} info) in ${summary.files} files${summary.design ? ` (tokens: ${summary.design})` : ''}${rules ? `\n  by rule: ${rules}` : ''}`);
  }
  return summary.errors > 0 || summary.warnings > args.maxWarnings ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('slop-lint.mjs')) process.exitCode = main(process.argv.slice(2));
