---
title: "Decision log — design decisions"
type: document
status: reviewed
lastUpdated: 2026-10-13T21:47:30.425Z
product: Webdesign Knowledge
productDescription: Repository for Webdesign Knowledge
---

# Decision log — design decisions

Append-only log of **strong** decisions agents should reuse.

## How to add

```markdown
### YYYY-MM-DD — <short title>
- **Context:** …
- **Decision:** …
- **Why:** …
- **Do not:** …
- **Surfaces:** marketing | product-shell | both
- **Refs:** PR / URL / screenshot
```

## Entries

### 2026-10-12 — Design Lab bootstrap
- **Context:** Centralize web design decisions inspired by Taste Skill, Vercel guidelines, getdesign.md, image-to-code, Playwright agent-cli.
- **Decision:** Cursor skills in `.cursor/skills/*` + brief in `design-knowledge/DESIGN.md` + Kstonebase specs under `design-lab/*`.
- **Why:** Agents need stable cross-chat rules.
- **Do not:** Create a second DESIGN.md per app; redesign authenticated shells without an explicit ask.
- **Surfaces:** both
- **Refs:** tasteskill.dev, skills.sh/vercel-labs/…/web-design-guidelines, getdesign.md, playwright.dev/agent-cli

### 2026-10-12 — Dark product theme locked
- **Context:** Unite/Rift analytics UI.
- **Decision:** Canvas ~`#111111`, frost border `rgba(214,235,253,0.19)`, one accent per surface, HeroUI as the kit.
- **Why:** Shipped consistency; avoids generic slop.
- **Do not:** Default purple glow; cream+terracotta AI editorial.
- **Surfaces:** product-shell
- **Refs:** Unite Metrics `design/system`, `design-knowledge/DESIGN.md`

### 2026-10-13 — Migrated to Webdesign Knowledge product
- **Context:** Pro upgrade; workspace General Knowledges.
- **Decision:** Design Lab specs live on product `cmpa9317ec0de04b0e162d40` (Webdesign Knowledge). Repo binding points here.
- **Why:** Correct workspace membership; free-plan orphan product was a temporary home.
- **Do not:** Keep editing `design-lab/*` on orphan Unite Metrics as source of truth.
- **Surfaces:** both
- **Refs:** workspace `cmp784ead7ec0e4ead89dd1b`
