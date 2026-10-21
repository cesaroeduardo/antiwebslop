---
title: "Design Lab — vision and how to use"
type: document
status: reviewed
lastUpdated: 2026-10-13T21:47:56.449Z
product: Webdesign Knowledge
productDescription: Repository for Webdesign Knowledge
---

# Design Lab — vision and how to use

## Why it exists

A library of **strong web design decisions** for agents and humans. Cross-project knowledge living in product **Webdesign Knowledge** inside workspace **General Knowledges**.

## External inspiration

| Tool | What we absorbed |
|------|------------------|
| [Taste Skill](https://www.tasteskill.dev/) | Anti-slop, design read, dials, bans |
| [Vercel web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) | Fresh a11y/UX audit rules |
| [getdesign.md](https://getdesign.md/) | DESIGN.md as a reusable brief |
| [image-to-code-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill) | Image → analysis → code |
| [Playwright Agent CLI](https://playwright.dev/agent-cli/introduction) | Multi-viewport visual QA |

## Repo artifacts

| Path | Role |
|------|------|
| `design-knowledge/DESIGN.md` | Living brief |
| `design-knowledge/README.md` | Index |
| `.cursor/skills/web-design-taste` | Anti-slop |
| `.cursor/skills/web-interface-guidelines` | Audit |
| `.cursor/skills/design-md` | Maintain DESIGN.md |
| `.cursor/skills/image-to-code` | Image-first |
| `.cursor/skills/visual-qa-playwright` | Screenshot QA |

## Work loop

1. Read `design-lab/*` + `DESIGN.md`
2. Load the right skill
3. Implement / audit / capture viewports
4. Record durable decisions in `design-lab/decision-log`

## Scope

- **Yes:** landing, help/marketing, visual redesigns, UI QA
- **Careful:** authenticated product shells — preserve existing design systems (e.g. HeroUI) unless explicitly redesigning
