# Design dials

Three dials, 1–10, stated in the Design Read (`Dials: V8 M6 D4`). Each level has
**observable** effects so a reviewer can check the output against the stated dial.
The same three dials are used everywhere, including image-to-code runs.

## VARIANCE: how far the composition departs from the template

VARIANCE controls *composition*, not the number of elements. High variance can still
be very simple: one huge headline set off-axis is V9 with very few elements.

| Level | Observable in the output |
|---|---|
| Low (1–3) | Symmetric, centered or a strict single column; conventional section order; uniform section widths. Centered here is intentional craft, not the “centered everything” anti-pattern |
| Mid (4–6) | Left-aligned grid with 1–2 asymmetric splits (7/5, 8/4); one section that breaks the column (bleed image or wide quote); type scale ratio ~1.25 |
| High (7–10) | Asymmetry in most sections; display type 3–4× body but still inside the hero cap (≤ ~6rem, ≤ 3 lines at 1440px, see [craft](craft.md#typography)); overlapping or bleeding elements; an unconventional section order or navigation; scale ratio ≥ 1.333. High variance comes from composition, not from ever-bigger type |

## MOTION: how much moves and how noticeably

| Level | Observable in the output |
|---|---|
| Low (1–3) | Hover and focus state changes only; no entrance animation; ≤ 150ms |
| Mid (4–6) | Plus one entrance (fade/slide ≤ 16px) per section, staggered ≤ 3 items; 200–300ms; all guarded by `prefers-reduced-motion` |
| High (7–10) | Plus scroll-linked or choreographed hero motion, one signature interaction (pick it from [premium patterns](premium-patterns.md)); still `opacity`/`transform` only, still guarded |

## DENSITY: how much content per screen

| Level | Observable in the output |
|---|---|
| Low (1–3) | 1 idea per viewport; section padding ≥ 128px desktop; body 18px+; lots of empty space |
| Mid (4–6) | 2–3 content blocks per viewport; section padding 64–96px; body 16–17px |
| High (7–10) | Tables, multi-column lists, compact controls; section padding ≤ 48px; body 14–15px; tabular numbers |

## Surface types and presets

Decide what the visitor is there to do on **this page** (not what the company sells), then start
from that preset. A dev tool's landing page is *persuade*; its docs are *read*.

| Surface type | The visitor is here to… | Typical pages | V | M | D |
|---|---|---|---|---|---|
| **Persuade** | understand an offer and act on it | landing, campaign, pricing, signup | 7–8 | 5–6 | 3–4 |
| **Operate** | get a task done, repeatedly | dashboards, settings, editors, admin | 3–4 | 2–3 | 6–8 |
| **Read** | learn or look something up | docs, help center, changelog, blog post | 3–4 | 2–3 | 4–6 |
| **Showcase** | experience the work itself | portfolio, gallery, case study, launch film | 8–10 | 6–9 | 2–3 |

What the type changes beyond the dials:
- **Persuade:** the first viewport states the offer and shows the primary action in working form (a real input or button, not a link to one). Proof must be real.
- **Operate:** familiar patterns win over novelty; the existing kit stays; personality lives in small details (empty states, microcopy, focus styles).
- **Read:** measure, hierarchy, and navigation beat composition; no full-viewport hero; code and tables get room.
- **Showcase:** the work leads from the first viewport and the interface gets out of the way; motion is allowed to be the point, still with reduced-motion fallbacks.

Rules:
- If the user or `DESIGN.md` sets dials, use those. Otherwise name the surface type, choose one number inside its ranges, and say both in the Design Read.
- Change one dial at a time when iterating, and say which one and why.
- When the dials and a project rule conflict, the project rule wins (see the source-of-truth order in `SKILL.md`).

> v2: the context presets became four surface types; the old "Minimal / Linear" row is a low-variance Persuade, "Analytics dashboard" is Operate. Changed from v0: There were four extra image-to-code dials (`ART_DIRECTION`, `IMPLEMENTATION_CLARITY`, `SPACING`, `SIMPLICITY`) with no definitions, and image runs used DENSITY 3 against a marketing default of 4. They are replaced by fixed rules in [image-to-code](image-to-code.md) (match the reference exactly, use the spacing scale), and image runs now use the surface's own preset.
