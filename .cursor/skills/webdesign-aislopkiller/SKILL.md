---
name: webdesign-knowledge
description: >-
  Design Lab playbook for marketing and help surfaces: anti-slop dials and bans,
  DESIGN.md contract, image→code workflow, Playwright visual QA, Web Interface
  Guidelines audits, and durable decision logging. Use when designing or auditing
  landing pages, marketing/help UI, visual redesigns, DESIGN.md, screenshots,
  image-to-code, or when the user mentions anti-slop, design dials, or Design Lab.
  Distilled from the Webdesign Knowledge product (Kstonebase design-lab specs).
  On authenticated product shells, preserve the existing design system unless an
  explicit redesign is requested.
---

# Webdesign Knowledge

A distilled playbook from the **Webdesign Knowledge** Design Lab — strong web design
decisions for agents and humans. Cross-project knowledge originally authored as
reviewed Kstonebase specs under `design-lab/*`, exported into this repo's `ref/`.

Use this skill when improving how a **landing, help/marketing, or visual redesign**
surface **looks, converts attention, and stays on-brand** — anti-slop, DESIGN.md,
image-first implementation, viewport QA, or a11y/UX audit.

## Scope boundary (required)

| Surface | Rule |
|---------|------|
| Landing / help / marketing / visual redesign | Full playbook |
| Authenticated product shells | **Preserve** the project design system (e.g. HeroUI). Apply anti-slop only to **new** surfaces or when the user **explicitly** asks for a redesign |

## How to use it

1. Identify the task, then open only the matching reference file(s) below (progressive disclosure).
2. Start every visual task with a **Design Read** (see anti-slop): *"Reading this as: \<page\> for \<audience\>, with a \<language\> language, leaning toward \<stack\>."*
3. Prefer **named levers** (dials, bans, DESIGN.md sections, viewport set) over vague taste talk.
4. After a durable decision, update `design-knowledge/DESIGN.md` **and** append the decision log.

## The spine: Design Lab in 9 principles

1. **Specs before pixels** — read Design Lab + DESIGN.md before inventing a look.
2. **Design Read first** — name page, audience, language, and stack before coding.
3. **Dials beat vibes** — set VARIANCE / MOTION / DENSITY (and image-to-code dials) explicitly.
4. **Bans are hard** — purple glow, cream+terracotta editorial, card stacks, hero stickers are out.
5. **One job in the first viewport** — brand-first, full-bleed hero, `min-h-[100dvh]` for marketing.
6. **DESIGN.md is the brief** — one living library brief; hex/tokens over adjectives.
7. **Image before freeform code** — generate → analyze system → implement when images are available.
8. **Prove it at three viewports** — 1440×900, 768×1024, 390×844; flag, fix, re-capture.
9. **Log strong decisions** — append-only decision log so agents reuse, not rediscover.

## Work loop

1. Read relevant `references/*` (+ `design-knowledge/DESIGN.md` when present)
2. Load only the theme files needed for this turn
3. Implement / audit / capture viewports
4. Record durable decisions (DESIGN.md + decision-log format)

## Reference library

| When the question is about… | Open |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Why Design Lab exists, scope, external inspiration, default work loop | [vision-and-work-loop](references/vision-and-work-loop.md) |
| Anti-slop, Design Read, dials, bans, marketing composition, product shells | [anti-slop-and-dials](references/anti-slop-and-dials.md) |
| Living DESIGN.md sections, tokens, read order, when to update | [design-md-contract](references/design-md-contract.md) |
| Image generation → analysis → code; default image dials | [image-to-code](references/image-to-code.md) |
| Playwright Agent CLI screenshots, viewports, severity report | [visual-qa-playwright](references/visual-qa-playwright.md) |
| Fresh Vercel Web Interface Guidelines audit + finding format | [web-interface-guidelines](references/web-interface-guidelines.md) |
| Append-only decision log template + existing locked decisions | [decision-log](references/decision-log.md) |

Canonical exported specs (source bundle): `ref/design-lab/`. Prefer this skill's references in-session; keep `ref/` as the export mirror.

## Provenance

Reviewed specifications from product **Webdesign Knowledge** (workspace General Knowledges),
exported 2026-10-21. External inspiration: Taste Skill, Vercel web-design-guidelines,
getdesign.md, Leonxlnx image-to-code-skill, Playwright Agent CLI.
