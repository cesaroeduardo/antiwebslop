# Webdesign Knowledge — an Agent Skill

> Design Lab playbook for marketing & help surfaces — packaged as a Cursor Agent Skill, organized like [revenue-centric-design](https://github.com/heliocosta-dev/revenue-centric-design): thin `SKILL.md` + progressive `references/`.

Distilled from reviewed **Kstonebase** specs in product **Webdesign Knowledge** (`ref/design-lab/*`, exported 2026-10-21).

## Install

Already in this repo:

```text
.cursor/skills/webdesign-knowledge/
```

Cursor picks up project skills from `.cursor/skills/`. Invoke by name (`webdesign-knowledge`) or by task keywords in the skill description (anti-slop, DESIGN.md, image-to-code, visual QA, landing redesign).

To reuse elsewhere, copy the folder into another project's `.cursor/skills/` or into `~/.agents/skills/webdesign-knowledge/`.

## What's inside

The skill loads only the theme relevant to the question.

| Theme | Covers |
|-------|--------|
| [Vision & work loop](references/vision-and-work-loop.md) | Scope, inspiration, read→act→log |
| [Anti-slop & dials](references/anti-slop-and-dials.md) | Design Read, dials, bans, composition |
| [DESIGN.md contract](references/design-md-contract.md) | Brief sections, tokens, read order |
| [Image → code](references/image-to-code.md) | Generate → analyze → implement |
| [Visual QA (Playwright)](references/visual-qa-playwright.md) | Three viewports, severity report |
| [Web Interface Guidelines](references/web-interface-guidelines.md) | Fresh Vercel audit rules |
| [Decision log](references/decision-log.md) | Template + locked decisions |

Entry point: [`SKILL.md`](SKILL.md). Source export mirror: [`ref/design-lab/`](../../../ref/design-lab/).

## The spine (9)

1. Specs before pixels  
2. Design Read first  
3. Dials beat vibes  
4. Bans are hard  
5. One job in the first viewport  
6. DESIGN.md is the brief  
7. Image before freeform code  
8. Prove it at three viewports  
9. Log strong decisions  

## Scope

- **Yes:** landing, help/marketing, visual redesigns, UI QA  
- **Careful:** authenticated product shells — keep HeroUI / existing kits unless redesign is explicit  

## Provenance

Specs authored in Kstonebase product Webdesign Knowledge (workspace General Knowledges). External inspiration: Taste Skill, Vercel web-design-guidelines, getdesign.md, Leonxlnx image-to-code-skill, Playwright Agent CLI.
