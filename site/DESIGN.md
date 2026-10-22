# DESIGN.md: antiwebslop site

> Living design brief for https://antiwebslop.cesaroeduardo.com (this `site/` package only).
> Read order: tokens in code (`app/globals.css`) → this file → antiwebslop skill defaults.

## 1. Product truth
- **Users:** developers and designers who build web UI with an AI coding agent (Cursor, Codex, Claude Code, Grok) and are tired of output that looks like every other generated landing page. Mostly on a laptop, often arriving from a GitHub link or a social post; a third on a phone.
- **Purpose:** explain what the antiwebslop skill does, show the evidence (lint output, before/after fixtures), and get it installed in one command.
- **Constraints:** brand assets in `../assets/` (cover, icon, og) stay as they are; brand font DM Mono; colors exactly `#121212`, `#F7EDDB`, `#D1A8FF`. Copy in English (default, at `/`), Brazilian Portuguese (`/pt`), French (`/fr`) and Spanish (`/es`); catalog entries, comparison rows and prior-art notes stay English (read from the skill). WCAG AA, keyboard reachable, `prefers-reduced-motion` honored. No analytics, no tracking (the project sells "no telemetry"). Static output.
- **Success means:** a visitor copies an install command for their agent, or opens the repo. Secondary: they open the anti-pattern catalog and understand the rule set in under a minute.
- **Real content available:** `../skills/antiwebslop/references/anti-patterns.md` (35 entries), `slop-lint` output on `../tests/fixtures/`, the gallery fixtures rendered in `public/gallery/`, `../eval/` (rubric, A/B protocol; no runs yet), `../README.md` (install lines, comparison, prior art). **No users, quotes, or scores exist yet; none are shown.**

## 2. Design Read and surface types
Reading this as: the antiwebslop landing and docs page for developers who ship UI with AI coding agents, a persuade surface with a terminal-editorial language (DM Mono display, flat near-black, one lavender mark), on Next.js 16 + Tailwind CSS 4 + GSAP/Lenis. Dials: V7 M5 D4.

| Surface | Type | V | M | D |
|---|---|---|---|---|
| Home (`/`) | persuade | 7 | 5 | 4 |
| Catalog and install sections inside it | read (local) | 4 | 2 | 6 |

## 3. Visual direction and project bans
- Terminal-editorial: monospace display type set large and left-aligned, real command lines and lint output as the main imagery, hairline rules instead of boxes where grouping by space is enough.
- Images are real artifacts (fixture renders with lint marks), shown big, cropped to the part that matters, allowed to bleed off the right edge.
- The background is flat `#121212`. The only light is one barely visible falloff at the top center, matching `../assets/og.png` (cream at ≤ 4% opacity). No glow, no blobs, no gradients anywhere else.
- Bans (on top of the catalog): no gradients on any element; lavender never fills large areas; no stock or AI imagery; no fake terminal "typing" effects; no analytics scripts.
- Allowed exceptions, with reason: lavender `#D1A8FF` is in the violet family. It is the documented brand accent (see cover/icon), used flat only, never as a gradient or glow, so `purple-gradient` stays clean.

## 4. Color tokens

```design-tokens
fonts: DM Mono, DM Sans
colors: #121212, #F7EDDB, #D1A8FF
radii: 0, 6px, 10px, 38px, 57px, 9999px
```

Everything else is a tint of these three, mixed in CSS (`color-mix`), so no extra hex values exist.

| Token | Value | Job |
|---|---|---|
| `--color-bg` | `#121212` | page background |
| `--color-surface` | cream 4% over bg | cards, code blocks, accordion rows |
| `--color-surface-2` | cream 7% over bg | hover state of rows, pressed buttons |
| `--color-fg` | `#F7EDDB` | body and headings |
| `--color-muted` | cream 68% over bg (≈ 7.1:1 on bg, 6.3:1 on surface-2) | secondary text, captions |
| `--color-border` | cream 12% over bg | hairlines |
| `--color-accent` | `#D1A8FF` | the primary action, the "slop" mark, focus ring, current/open state |
| `--color-accent-fg` | `#121212` | text on accent (≈ 9.6:1) |

## 5. Typography
- Display: **DM Mono** 400/500. Why: it is the brand wordmark's face; a mono display says "this is a dev tool" without decoration.
- Text: **DM Sans** 400/500. Why: the skill's craft rules say mono is for data, not whole paragraphs; catalog entries and explanations are paragraphs. DM Sans is drawn by the same foundry family as DM Mono (shared proportions), so the pair does not fight.
- Mono for data: commands, rule ids, severities, file:line, labels on images.
- Scale (ratio 1.333, base 16): 12 · 14 · 16 · 21.33 · 28.43 · 37.9 · 50.52 · 67.34. Hero headline `clamp(2.5rem, 5vw, 4.21rem)` (≤ 67px, ≤ 3 lines at 1440).
- Body: 17px / 1.6 / 65ch. Tracking −0.02em on ≥ 37px only.

## 6. Spacing and layout
- Scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192 (Tailwind steps 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48).
- Widths, two tokens: **wide 1280px** (`--container-wide`, `max-w-wide`) for the hero, the header and the footer, 12 columns, gutter 24px, page margin 24px (16px under 640px); **content 524px** (`--container-content`, `max-w-content`) for every other section (catalog, newer tells, install, eval, prior art), centered, text left-aligned on its edge. The content width is the newer-tells "words" image. The hero photo and the references canvas stay full bleed.
- Section order: hero → references canvas → catalog → gallery → install → how we measure it → prior art → footer.
- Section padding varies by job: hero fills the first screen, content on its bottom edge, 64 bottom; references canvas 128 (192 md) with no intro text, then full-bleed; catalog, newer tells, install and eval 128 (160 md), eval also at the bottom; newer-tells rows 80 apart (120 md); prior art 128/160 bottom; footer 64.

## 7. Components
- Radius by role: controls and chips 6px · cards and code blocks 10px · images 0 (crop, no frame), except the newer-tells media rows: 38px, 57px from 768px (after america.gov) · copy-button pill none (no 9999 except the severity dot).
- Elevation: none. Separation by surface step and 1px hairline.
- Buttons: primary = accent fill, `#121212` text, 6px. Secondary = text link with underline. One primary per view.
- Kit: Radix Accordion (unstyled) for the catalog; no component library styles.

## 8. Motion
- M5: blur reveal per item (opacity 0→1, y 28px→0, blur 14px→0, 700ms, expo.out, stagger 0.06s, ported from falcaobatidos) via GSAP ScrollTrigger.batch; Lenis smooth scroll on desktop pointers.
- Accordion content height 200ms ease-out; copy button label swap, no movement.
- `prefers-reduced-motion: reduce`: no GSAP entrances (content visible from the start), no Lenis, no accordion height animation.

## 9. Imagery and content
- Imagery: renders of `../gallery/pages/*.html` (the test fixtures with lint findings outlined) at 2x, webp, cropped. Labels overlaid bottom-left on a solid bg chip.
- Image slots (`public/slots/`: `catalog-findings` 16:9, `hook-feedback` 4:3, `newer-tells` 4:3) hold illustrative generated mockups supplied by Eduardo, not screenshots of real lint runs. They show what the findings look like; the real output is the gallery fixture render and the lint itself. Exception to the "no AI imagery" ban, limited to these three slots; replace them with real captures when available. Since 2026-10-21 only `newer-tells` is on the page (the bento section that showed the other two was removed; the files stay in `public/slots/`).
- Voice: plain, specific, second person, numbers only when counted from the repo (35 entries, 31 rules).
- Headings carry no terminal period: h1–h4, card and row titles, in every locale. Body copy keeps its periods.
- Content sources: generated at build by `scripts/build-content.mjs` from the repo files, committed as `content/generated.json` so the site also builds without the rest of the repo.

## 10. Do / Don't
| Do | Don't |
|---|---|
| Show the real command with a working copy button above the fold | Link to "Get started" |
| Quote rule ids and file:line output as they print | Paraphrase findings into marketing claims |
| Say "no runs yet" in the results table | Show any score before `eval/VALIDATION.md` has one |
| Say plainly what it does not do (no rendered-page checks, no extension) | Claim to be better than other tools |

## 11. Decision log

### 2026-10-21 — Brand palette and fonts locked
- **Context:** first site for the project; Eduardo supplied cover, icon, og and the palette.
- **Decision:** `#121212` / `#F7EDDB` / `#D1A8FF`, DM Mono display + DM Sans text, all other colors as `color-mix` tints.
- **Why:** matches the supplied assets; keeps the design-tokens block to the three brand values.
- **Do not:** add a fourth color or a gradient; use lavender for anything but the primary action, the slop mark, focus, and open state.
- **Surfaces:** marketing
- **Refs:** `../assets/cover.png`, `../assets/og.png`

### 2026-10-21 — Catalog content read from the skill at build time
- **Context:** the site lists all 35 anti-patterns; a hand copy would drift.
- **Decision:** `scripts/build-content.mjs` parses `anti-patterns.md`, runs the real lint on the fixtures, and writes `content/generated.json`; a root test fails if the committed JSON is stale.
- **Why:** one source of truth; the site never claims a rule the lint lacks.
- **Do not:** edit `content/generated.json` by hand.
- **Surfaces:** marketing
- **Refs:** `scripts/build-content.mjs`, `../tests/site-content.test.mjs`

### 2026-10-21 — Long commands wrap instead of scrolling
- **Context:** visual QA pass 1 at 1440 and 390: install commands, the hook reply and the hero command were clipped mid-word inside scroll boxes, and the footer wordmark ran off the right edge.
- **Decision:** code rows and the hook terminal use `pre-wrap` with `overflow-wrap: anywhere`; lint terminals stay `pre` (short lines); footer wordmark capped at 15vw.
- **Why:** a command you cannot see in full is one you will not paste; copy buttons stay for the exact text.
- **Do not:** truncate a command or hide part of it behind horizontal scroll.
- **Surfaces:** marketing
- **Refs:** `/workspace/site-shots/iter1/` (before), `/workspace/site-shots/` (after)

### 2026-10-21 — "Run the lint yourself" section removed
- **Context:** Eduardo asked to drop the lint usage section; it repeated the install section and held an empty image slot.
- **Decision:** remove `#lint` (heading "Run the lint yourself", its commands, script paths and image slot) and its nav link. Lint usage stays documented in the README and SKILL.md.
- **Why:** shorter page, install leads straight into the evidence (how we measure it).
- **Do not:** reintroduce a section that only repeats commands already in the install rows.
- **Surfaces:** marketing
- **Refs:** `app/page.tsx`

### 2026-10-21 — "How we measure it" as a protocol ledger
- **Context:** the eval section was a numbered list next to an empty five-column table; it read as filler.
- **Decision:** asymmetric 7/5 split. Left: the A/B protocol as a vertical timeline of its four phases (Setup, Run, Blind review, Decide), each with its source file and the rules it fixes. Right, sticky on desktop: the scorecard drawn to scale (A 20, B 12, C 10 as proportional blocks, D as a dashed gate) and the VALIDATION.md entry format with "runs logged: 0".
- **Why:** the protocol is the evidence until runs exist; drawing the card to scale shows where the points are without inventing any score.
- **Do not:** show a score, a run, or a sample result before `../eval/VALIDATION.md` logs one.
- **Surfaces:** marketing
- **Refs:** `../eval/ab-protocol.md`, `../eval/rubric.md`, `/workspace/site-shots/v5-measured-*.png`

### 2026-10-21 — References canvas as the second section
- **Context:** Eduardo asked for a second section like useplanes.com's: an edgeless, draggable surface of cards.
- **Decision:** `components/SiteCanvas.tsx`, no new dependency. 14 real sites (`lib/canvas-sites.ts`) found on Awwwards, Minimal Gallery, Recent Design, Curated Design and Design Spells, captured with headless Chrome at 1440×900 (`public/canvas/`, 1440w + 720w webp). 7×4 slots, the second copy of the 14 decorative; each card wraps modulo the tile, so the surface never ends. Pointer drag with inertia, horizontal or shift wheel; vertical wheel and vertical touch stay page scroll. Slow drift when idle, off under reduced motion. A press under 6px opens a native `<dialog>` lightbox (Esc, backdrop, close button; focus returns to the card). Keyboard: Tab focuses and centers a card, arrows pan.
- **Why:** shows the skill's step 2 (references before tokens) with real work instead of describing it; images are captures of live sites, not generated.
- **Do not:** hijack vertical wheel inside the canvas; add a screenshot without its source gallery; cards stay 10px radius, images unframed.
- **Surfaces:** marketing
- **Refs:** https://useplanes.com/ (second section), `/workspace/site-shots/v5-canvas-*.png`, `/workspace/site-shots/v5-lightbox-*.png`

### 2026-10-21 — Hero photo, full bleed
- **Context:** Eduardo supplied `public/hero/portrait.webp` (his own portrait, frowning, half behind reeded glass with lilac light) for a noone.is-style hero. The earlier image (a worried woman behind lilac frosted glass) is kept as `public/hero/portrait-woman.webp` to switch back.
- **Decision:** the photo fills the first screen edge to edge, behind the header (`next/image` fill, priority, `sizes=100vw`; 64svh on phones so both eyes stay in frame above the text). It replaces the top light there. Three scrims in the bg color (bottom to top, left to right, a short one under the header) keep the headline, line and install command AA readable. Decorative: `alt=""`, `aria-hidden`.
- **Why:** one strong, specific image says "generated sameness is a problem" better than more copy; the lilac in the glass is the brand accent, not an added glow.
- **Exception:** the scrims are the only gradients on the site, bg-color to transparent only, never a color gradient.
- **Surfaces:** marketing
- **Refs:** `/workspace/site-shots/v6-hero-photo-1440.png`, `/workspace/site-shots/v6-hero-photo-390.png`

### 2026-10-21 — Four languages with next-intl
- **Context:** Eduardo asked for pt, fr and es next to English.
- **Decision:** next-intl 4 (Next 16 compatible) with `app/[locale]`, `localePrefix: 'as-needed'` (English at `/`, others at `/pt`, `/fr`, `/es`), first-visit guess in `proxy.ts` on unprefixed paths only: country from `x-vercel-ip-country` (BR → pt; ES and Spanish-speaking Latin America → es; FR → fr; anything else or no header → en; no Accept-Language), remembered in `NEXT_LOCALE` for a year; a saved cookie (from that guess or the language select) wins; `/pt`, `/fr`, `/es` and crawlers are never redirected. All UI strings, aria labels, alt texts and metadata live in `messages/{en,pt,fr,es}.json`; pages are statically generated per locale. `hreflang` alternates plus `x-default`, per-locale canonical and a sitemap with alternates. Language select in the header at every width (PT, EN, ES, FR; a listbox styled like the GitHub button); a pick writes `NEXT_LOCALE` for a year. Header nav: References (from 640px), Install (from 440px), language, GitHub (new tab).
- **Why:** one source per language; commands, file names and rule ids stay literal in every language.
- **Do not:** translate commands, rule ids, file paths or the A/B follow-up prompt; machine-translate the catalog at build time.
- **Surfaces:** marketing
- **Refs:** `i18n/`, `messages/`, `proxy.ts`

### 2026-10-21 — Newer tells as america.gov media rows; a shorter "How we measure it"
- **Context:** Eduardo asked to drop the "14 findings" capture from the newer tells, show the newer-tells image bigger in america.gov's image-beside-topic layout with more topics, and to cut "How we measure it" to the essentials (no trade-offs table, no intro, no VALIDATION.md block, no "no scores" line).
- **Decision:** newer tells = header (title + one line) then four stacked rows, all image left, topic right: image at columns 2–7 (4:3), one empty column, topic at 9–12, vertically centered; 120px between rows (80 under md), 40px image-to-text and 32px text-to-chips on phones. Row 1 is the full `slots/newer-tells.webp`; rows 2–4 zoom into its tagged regions (big-number row, numbered cards with side stripes, pulsing dot), so no new image. Topics come from catalog §24–29 and §32–33, each with its lint rule ids. Later the same day Eduardo dropped the section title, intro and the gallery/ line (aria-label keeps the name); each row keeps its own title, copy and rule-id chips beside the image. Eval keeps the four-phase timeline (one line per phase, source file linked) and the scorecard drawn to scale. Prior art stays as a credits list.
- **Measured on america.gov (1430px):** 12 columns, 16px gaps; media 434×434 at columns 3–6, text 434 wide at 8–11 (copy 308 wide), centered vertically; 120px between rows (80px at 390); radius 57.3px desktop, 38.2px at 390 (13% of the media). Kept our 24px gutter and fonts; widened the media to 6 columns because the capture needs the size.
- **Do not:** add placeholder images or invented stats to these rows; show a score before `../eval/VALIDATION.md` logs one.
- **Surfaces:** marketing
- **Refs:** https://www.america.gov (how-it-works rows), `/workspace/am/measure.json`, `/workspace/site-shots/v8-*.png`

### 2026-10-21 — Bento section removed
- **Context:** Eduardo found the "what it does" bento (Proof, not taste / What not to ship / One brief per project / Flagged on every write) redundant with the sections below it.
- **Decision:** removed. The page goes hero → references canvas → catalog → newer tells → install → eval → prior art. The back-to-top button keys on the catalog, now the third section.

### 2026-10-21 — Two widths: wide and content
- **Context:** Eduardo found the page too wide (1280 → 1120 earlier the same day), then asked for one shared width set by the newer-tells image of the "words dressed up as design" row (524px at the time), with the hero, header and footer back at the original width.
- **Decision:** two tokens. `--container-wide: 1280px` for hero, header and footer; `--container-content: 524px` for catalog, newer tells, install, eval and prior art, centered. The 1120 page token is gone. Catalog header stacks above the accordion; newer-tells rows stack image over title, copy and chips; install rows stack name over command; eval's timeline stacks above the scorecard. If the newer-tells media frame changes size, change the content token, nothing else.

## 12. References
- Layout patterns (borrowed, not copied): useplanes.com (edgeless draggable card canvas, unequal feature cards, two-column FAQ with stacked accordion rows, link-column footer with a cropped wordmark), america.gov (stacked rounded media rows with the topic beside them), noone.is (headline bottom-left with copy and actions to its right, big tightly cropped imagery bleeding off the edge, image labels set inside the image).
- Stack reference: falcaobatidos.com.br (Next.js 16 App Router on Vercel, Tailwind 4, next/font, Radix, lucide, GSAP + ScrollTrigger, Lenis).
- Brand assets: `../assets/`.
