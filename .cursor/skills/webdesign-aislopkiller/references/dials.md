# Design dials

Three dials, 1–10, stated in the Design Read (`Dials: V8 M6 D4`). Each level has
**observable** effects so a reviewer can check the output against the stated dial.
The same three dials are used everywhere, including image-to-code runs.

## VARIANCE: how far the composition departs from the template

VARIANCE controls *composition*, not the number of elements. High variance can still
be very simple: one huge headline set off-axis is V9 with very few elements.

| Level | Observable in the output |
|---|---|
| Low (1–3) | Symmetric, centered or a strict single column; conventional section order; uniform section widths |
| Mid (4–6) | Left-aligned grid with 1–2 asymmetric splits (7/5, 8/4); one section that breaks the column (bleed image or wide quote); type scale ratio ~1.25 |
| High (7–10) | Asymmetry in most sections; oversized display type (≥ 4× body); overlapping or bleeding elements; an unconventional section order or navigation; scale ratio ≥ 1.333 |

## MOTION: how much moves and how noticeably

| Level | Observable in the output |
|---|---|
| Low (1–3) | Hover and focus state changes only; no entrance animation; ≤ 150ms |
| Mid (4–6) | Plus one entrance (fade/slide ≤ 16px) per section, staggered ≤ 3 items; 200–300ms; all guarded by `prefers-reduced-motion` |
| High (7–10) | Plus scroll-linked or choreographed hero motion, one signature interaction; still `opacity`/`transform` only, still guarded |

## DENSITY: how much content per screen

| Level | Observable in the output |
|---|---|
| Low (1–3) | 1 idea per viewport; section padding ≥ 128px desktop; body 18px+; lots of empty space |
| Mid (4–6) | 2–3 content blocks per viewport; section padding 64–96px; body 16–17px |
| High (7–10) | Tables, multi-column lists, compact controls; section padding ≤ 48px; body 14–15px; tabular numbers |

## Presets

| Context | V | M | D |
|---|---|---|---|
| Default marketing / landing | 8 | 6 | 4 |
| Minimal, tool-like (Linear-style) | 5–6 | 3–4 | 2–3 |
| Premium consumer | 7–8 | 5–7 | 3–4 |
| Experimental / portfolio | 9–10 | 8–10 | 3–4 |
| Help / docs | 3–4 | 2–3 | 5–6 |
| Analytics dashboard / product UI | 3–4 | 2–3 | 6–8 |

Rules:
- If the user or `DESIGN.md` sets dials, use those. Otherwise pick a preset, choose one number inside its range, and say which.
- Change one dial at a time when iterating, and say which one and why.
- When the dials and a project rule conflict, the project rule wins (see the source-of-truth order in `SKILL.md`).

> Changed from v0: presets are unchanged except for a new Help / docs row. There were four extra image-to-code dials (`ART_DIRECTION`, `IMPLEMENTATION_CLARITY`, `SPACING`, `SIMPLICITY`) with no definitions, and image runs used DENSITY 3 against a marketing default of 4. They are replaced by fixed rules in [image-to-code](image-to-code.md) (match the reference exactly, use the spacing scale), and image runs now use the surface's own preset.
