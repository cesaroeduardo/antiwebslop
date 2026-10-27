# Sources and scope

## Where the rules come from

The skill absorbs specific strengths from public tools rather than inventing a parallel stack:

| Source | What it contributes |
|---|---|
| [Taste Skill](https://www.tasteskill.dev/) | Design Read, dials, bans |
| [Vercel web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) | A11y and UX audit rules |
| [getdesign.md](https://getdesign.md/) | DESIGN.md as a reusable brief |
| [image-to-code-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill) | Reference → extract → implement |
| [Playwright CLI](https://playwright.dev/agent-cli/introduction) | Multi-viewport visual QA |
| [MotionSites skill](https://github.com/Motionsites-AI/claude-skill) by Viktor Oddy (MIT references) | Premium motion and composition patterns, restated inside our rules in [premium-patterns](premium-patterns.md); its generic hero media prompted anti-pattern 68 |

The anti-pattern catalog, craft defaults, examples, lint, and eval are this repo's own work.
New rules should come from validation runs (see the repo's `eval/`), not from taste debates.

## Why operate surfaces (product UI) are treated differently

Authenticated apps already have a design system that users have learned. Restyling it to be
"less generic" breaks consistency and costs more than it gains. So in product UI the skill:
- keeps the kit, tokens, and layout patterns,
- still runs the lint and the a11y checks,
- applies the full anti-slop playbook only to **new** surfaces or when a redesign is explicitly requested.

## Marketing composition, conditionally

A full-viewport hero (`min-height: 100dvh`) is a strong default for **landing and campaign pages**
with one clear job. Do not force it on help/docs pages, long-form content, pricing pages, or pages
whose first job is navigation or search; there, put the content in the first viewport instead.
Whatever the page, the first viewport has **one job**, and there are no floating badges or stickers on the hero.
