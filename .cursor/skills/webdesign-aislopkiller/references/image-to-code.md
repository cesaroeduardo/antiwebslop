# Image → code workflow

> Distilled from Design Lab spec `design-lab/image-to-code.md` (REVIEWED).

## Generate → analyze → implement (mandatory when images are available)
**Principle.** Freeform coding without a visual system produces slop.
**Apply when.** Visual tasks where image generation (or a provided reference) is available.
**The move.** Strict order:
1. Generate reference image(s) (section-scale, readable)
2. Analyze deeply (extract the system)
3. Implement matching code

Do **not** start with freeform coding when image generation is available.
**Source.** design-lab/image-to-code.md — Mandatory order

## Default image-to-code dials
**Principle.** Image-first work uses a sharper dial set than general marketing defaults.
**Apply when.** Setting intensity for image→code runs.
**The move.** Use: `VARIANCE 8 / DENSITY 3 / ART_DIRECTION 8 / IMPLEMENTATION_CLARITY 9 / SPACING 9 / SIMPLICITY 9`
**Source.** design-lab/image-to-code.md — Default dials

## Large per-section images; regenerate if unreadable
**Principle.** A compressed board destroys hierarchy and spacing cues.
**Apply when.** Choosing how many / how large reference images to generate.
**The move.**
- Large per-section images over one compressed board
- Generate enough (hero + key sections)
- Hero must be readable on a small laptop
- If unreadable → regenerate **before** coding
**Source.** design-lab/image-to-code.md — Image rules

## Extract the system before writing CSS
**Principle.** Code should match an extracted system, not approximate a vibe.
**Apply when.** After images exist, before implementation.
**The move.** Extract: palette, typography, spacing, buttons, geometry, and what to **avoid** (nested cards, stickers).
**Source.** design-lab/image-to-code.md — Extract before coding

## Close the loop in DESIGN.md and the decision log
**Principle.** A successful image→code run creates durable library knowledge.
**Apply when.** Implementation lands and the look should be reused.
**The move.** Update `design-knowledge/DESIGN.md` and append the decision log.
**Source.** design-lab/image-to-code.md — Afterward
