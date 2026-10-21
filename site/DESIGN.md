# DESIGN.md: antiwebslop site

> Living design brief for https://antiwebslop.cesaroeduardo.com (this `site/` package only).
> Read order: tokens in code (`app/globals.css`) → this file → antiwebslop skill defaults.

## 1. Product truth
- **Users:** developers and designers who build web UI with an AI coding agent (Cursor, Codex, Claude Code, Grok) and are tired of output that looks like every other generated landing page. Mostly on a laptop, often arriving from a GitHub link or a social post; a third on a phone.
- **Purpose:** explain what the antiwebslop skill does, show the evidence (lint output, before/after fixtures), and get it installed in one command.
- **Constraints:** brand assets in `../assets/` (cover, icon, og) stay as they are; brand font DM Mono; colors exactly `#121212`, `#F7EDDB`, `#D1A8FF`. English copy. WCAG AA, keyboard reachable, `prefers-reduced-motion` honored. No analytics, no tracking (the project sells "no telemetry"). Static output.
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
radii: 0, 6px, 10px, 9999px
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
- Scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 (Tailwind steps 1, 2, 3, 4, 6, 8, 12, 16, 24, 32).
- Grid: 12 columns, max-width 1280px, gutter 24px, page margin 24px (16px under 640px).
- Section padding varies by job: hero 96 top / 64 bottom; bento 96; catalog 128 (airy heading, dense list); install 96 dense; footer 64.

## 7. Components
- Radius by role: controls and chips 6px · cards and code blocks 10px · images 0 (crop, no frame) · copy-button pill none (no 9999 except the severity dot).
- Elevation: none. Separation by surface step and 1px hairline.
- Buttons: primary = accent fill, `#121212` text, 6px. Secondary = text link with underline. One primary per view.
- Kit: Radix Accordion (unstyled) for the catalog; no component library styles.

## 8. Motion
- M5: blur reveal per item (opacity 0→1, y 28px→0, blur 14px→0, 700ms, expo.out, stagger 0.06s, ported from falcaobatidos) via GSAP ScrollTrigger.batch; Lenis smooth scroll on desktop pointers.
- Accordion content height 200ms ease-out; copy button label swap, no movement.
- `prefers-reduced-motion: reduce`: no GSAP entrances (content visible from the start), no Lenis, no accordion height animation.

## 9. Imagery and content
- Imagery: renders of `../gallery/pages/*.html` (the test fixtures with lint findings outlined) at 2x, webp, cropped. Labels overlaid bottom-left on a solid bg chip.
- Voice: plain, specific, second person, numbers only when counted from the repo (35 entries, 31 rules).
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

## 12. References
- Layout patterns (borrowed, not copied): useplanes.com (unequal feature cards, two-column FAQ with stacked accordion rows, link-column footer with a cropped wordmark), noone.is (headline bottom-left with copy and actions to its right, big tightly cropped imagery bleeding off the edge, image labels set inside the image).
- Stack reference: falcaobatidos.com.br (Next.js 16 App Router on Vercel, Tailwind 4, next/font, Radix, lucide, GSAP + ScrollTrigger, Lenis).
- Brand assets: `../assets/`.
