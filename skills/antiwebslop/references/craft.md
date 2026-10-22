# Craft: what to do instead

Defaults for when the project's tokens and `DESIGN.md` are silent. Project values always win.

## Typography

- **Pick by the Design Read, not by habit.** Choose the display face first, for its voice, then a text face that reads well at 15–18px.
- **Pairing patterns that work:**
  - Grotesk display + the same family for text (one family, contrast through weight and size). Good for tools and dev products.
  - Serif or high-contrast display + neutral sans text. Good for editorial, premium, and long-form help.
  - Mono accents (labels, numbers, code) + sans text. Use mono for *data*, not for whole paragraphs.
- **Limit:** at most 2 families (3 if one is mono for data) and 2–3 weights each.
- **Scale:** a ratio scale. 1.2 for dense UI, 1.25–1.333 for marketing. Example at 16px base, 1.25: 12.8 · 16 · 20 · 25 · 31 · 39 · 49 · 61. Use `clamp()` for the top 2 steps.
- **Hero headline:** at least 2.5× body on desktop (1.75× on mobile) and at most about 6rem (96px). It should fit in 3 lines at 1440px and 5 lines at 390px with the primary action still above the fold; if not, shorten the copy before shrinking the type. `line-height` 1.0–1.15; slight negative tracking (−0.01 to −0.03em) on large sizes only, never tighter than −0.04em.
- **Body:** 16–18px, `line-height` 1.5–1.7, measure 60–75 characters (`max-width: 65ch`).
- **Wrap:** titles and headlines use `text-wrap: balance` (`text-balance`); body and lead descriptions use `text-wrap: pretty` (`text-pretty`) so a lone last-line word (widow) does not sit alone.
- **Numbers:** `font-variant-numeric: tabular-nums` in tables, prices, and stats.

## Spacing and rhythm

- **One scale.** 4px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. No values outside it without a reason.
- **Proximity beats boxes.** Related items sit close (8–16), groups sit apart (32–64), sections sit far apart (96–128 on desktop).
- **Vary section rhythm by job:** dense proof or logo rows, airy statements, tabular pricing. Do not give every section the same padding and max-width.
- **Mobile:** scale section padding down (about 0.6×) but keep the internal proportions.

## Grid and layout

- 12-column grid at desktop, 4–6 at mobile; content max-width 1120–1280px, text max-width 65ch.
- **Alignment follows VARIANCE.** Low V (1–3) may be fully centered or a strict single column — that is a valid composition, not slop. Mid/high V should lean left-aligned with asymmetric splits; do not force asymmetry onto a page that asked for calm symmetry.
- **Asymmetry on purpose:** 7/5 or 8/4 splits, a headline that spans more columns than its body, an image bleeding off one edge. Asymmetry is the main VARIANCE lever (see [dials](dials.md)).
- Align to a few strong vertical lines. Every element should share an edge with something.
- Full-bleed is for imagery or color fields, not for text. Center short statements and CTAs freely; keep long reading measure left-aligned unless the Design Read chose a centered column.

## Color with intent

- Start from what the brand already has (logo, product UI, existing tokens). Only invent a palette when there is nothing.
- **Structure:** 1 neutral ramp (8–10 steps, slightly tinted toward the brand hue), 1 accent, plus semantic colors (success, warn, error) used only for state.
- **One accent, one job.** The accent marks the primary action and the current state. If everything is accented, nothing is.
- Define tokens as CSS vars (`--color-bg`, `--color-fg`, `--color-muted`, `--color-accent`, `--color-border`); no raw hex in components.
- Contrast: body text ≥ 4.5:1, large text and UI ≥ 3:1. Check muted gray text especially.
- Dark mode is its own palette (lower chroma, 2–3 surface steps), not an inversion.

## Hierarchy

- One primary thing per viewport. Make the most important element clearly bigger or heavier; demote everything else.
- Use at most 3 levels of emphasis per section (primary, secondary, muted).
- One primary button per view; secondary actions are ghost or text links.
- In repeating rows or cards, do not stamp the same labeled CTA on every item ("Copy", "Open", "Edit", "View more", "Learn more"). Prefer an icon-only control with a tooltip, a control that appears on row hover, or one section-level action — so the screen stays light. Keep a clear `aria-label` (and live status when needed) when the visible label is hidden.
- Test: blur the screenshot (or squint). You should still see what to read first and where to click.

## Copy and real content

- Headline = what it is + who it is for + why it is different, in ≤ 12 words. Concrete nouns, numbers, and names over adjectives.
- Subhead adds the proof or the mechanism; it does not repeat the headline.
- CTA = verb + object ("Spin a build", "Import matches").
- Do not invent a wordmark that ends with a period ("Acme.", "Brand."). That trailing-dot lockup is a common LLM branding tic; drop the period.
- Use real data, screenshots, and product names from the repo. If content is missing, write `TODO(content): …` and say so in the reply; never invent testimonials, logos, or metrics.

## Imagery

- Prefer the actual product: UI screenshots, real data visualizations, real photos of the thing.
- Show screenshots at a readable scale and crop to the part that matters.
- Abstract decoration (blobs, meshes, 3D shapes) only when it is part of the documented brand.

## Motion

- Motion explains change (enter, exit, state). It is not decoration.
- 150–300ms for UI, up to 500ms for large entrances; ease-out for enter, ease-in for exit.
- Animate `opacity` and `transform` only. Guard everything non-essential with `prefers-reduced-motion`.
