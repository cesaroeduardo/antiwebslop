---
name: antiwebslop
description: >-
  Stops web UI from looking AI-generated. Use when building, restyling, or
  reviewing a website, landing page, hero, marketing or help/docs page, or a
  frontend component (HTML, CSS, Tailwind, React, Vue, Svelte, Astro), and
  whenever the user says the design looks generic, templated, "AI slop",
  "like every other SaaS", bland, or asks to make it look designed by a person.
  Covers an anti-pattern catalog with a lint script, craft rules for type,
  spacing, color and copy, a per-project DESIGN.md, design dials, viewport QA,
  and a pre-done checklist.
---

# antiwebslop: web design without the AI slop

Make interfaces look like a person with taste made them for *this* product, not
like the average of every landing page an AI model has seen.

## Surface type decides how hard to push

Name what the visitor is here to do on this page ([dials](references/dials.md) has presets):
**persuade** (landing, pricing) · **operate** (dashboards, settings) · **read** (docs, help) · **showcase** (portfolio, case study).
Operate surfaces keep the project's design system and kit unless a redesign was requested; the lint and a11y checks apply everywhere.

## Source of truth (read in this order; earlier wins on conflict)

1. The project's **existing tokens and design system** in code (theme files, CSS vars, Tailwind config, component kit)
2. The project's own **`DESIGN.md`** (repo root or `docs/`), one per project, with product truth and a `design-tokens` block; create it from [the template](templates/DESIGN.template.md) if missing and the task is more than a small fix
3. **This skill's defaults** (references below)

## Work loop (the only canonical copy)

1. **Design Read.** Write one line before any code: *"Reading this as: \<page\> for \<audience\>, a \<surface type\> surface with a \<visual language\> language, on \<stack\>. Dials: V\<n\> M\<n\> D\<n\>."*
2. **Load** only the references this task needs (table below).
3. **Build or audit.** Prefer named levers (tokens, dials, rules) over taste adjectives.
4. **Lint:** `node <skill-dir>/scripts/slop-lint.mjs <changed paths>` (also checks DESIGN.md token drift); fix every `error`, fix or justify every `warn`. If the optional Cursor hook is installed, findings arrive after each write: act on them the same way.
5. **QA** at three viewports when a page is runnable ([visual QA](references/visual-qa-playwright.md)).
6. **Pre-done checklist** (below). Then record durable decisions in the project's `DESIGN.md` and decision log.

## References

| When the task involves… | Open |
|---|---|
| What to avoid; reviewing output for slop | [anti-patterns](references/anti-patterns.md) |
| Type, spacing, grid, color, hierarchy, copy, imagery | [craft](references/craft.md) |
| What good vs. slop looks like in code | [examples](references/examples.md) |
| Surface types and intensity (VARIANCE / MOTION / DENSITY) | [dials](references/dials.md) |
| Creating or updating a project DESIGN.md | [design-md-contract](references/design-md-contract.md) · [template](templates/DESIGN.template.md) |
| A reference image exists or a large new page is being designed | [image-to-code](references/image-to-code.md) |
| Screenshots, viewports, severity report | [visual-qa-playwright](references/visual-qa-playwright.md) |
| Accessibility / UX audit | [web-interface-guidelines](references/web-interface-guidelines.md) |
| Logging a durable decision | [decision-log](references/decision-log.md) |
| Where these rules come from, scope rationale | [sources-and-scope](references/sources-and-scope.md) |

## Pre-done checklist (answer every line before saying "done")

- [ ] Design Read line and dials are stated, and the output visibly matches the dials
- [ ] `slop-lint` shows 0 errors; each remaining warn is fixed or has a one-line reason
- [ ] No purple/indigo/violet gradient, glow, or gradient-text headline (unless it is the documented brand)
- [ ] No glassmorphism as decoration; no decorative blur blobs/orbs
- [ ] No emoji used as bullets, icons, or badge decoration
- [ ] Hero headline says something specific to this product; no "unlock / supercharge / seamless / elevate"; CTA names the action
- [ ] No invented testimonials, logos, user counts, or metrics; placeholders are marked `TODO(content)`
- [ ] Not the centered hero + three equal cards layout; sections do not all share one rhythm
- [ ] No label above the headline, no decorative 01/02/03, no row of big unsourced numbers
- [ ] Hero headline ≤ ~6rem and ≤ 3 lines at 1440px; primary action visible without scrolling
- [ ] Icons only where they aid scanning; one icon set, one size scale
- [ ] Radius and shadow vary by role (not one `rounded-2xl shadow-lg` on everything)
- [ ] Display type is a deliberate choice paired with the body face; a type scale is used
- [ ] Spacing comes from one scale; one accent color with a defined job; no off-token values
- [ ] The first viewport has one job, also at 390px
- [ ] Focus is visible; motion respects `prefers-reduced-motion`; contrast is AA
- [ ] Operate surfaces: the existing kit and tokens are preserved unless a redesign was requested
