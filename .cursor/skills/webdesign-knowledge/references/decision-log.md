# Decision log — design decisions

> Distilled from Design Lab spec `design-lab/decision-log.md` (REVIEWED).
> Append-only log of **strong** decisions agents should reuse.

## Append-only entries with a fixed template
**Principle.** Strong decisions must be reusable across chats; freeform notes are not.
**Apply when.** Locking a look, token set, ban, composition rule, or source-of-truth change.
**The move.** Append:
```markdown
### YYYY-MM-DD — <short title>
- **Context:** …
- **Decision:** …
- **Why:** …
- **Do not:** …
- **Surfaces:** marketing | product-shell | both
- **Refs:** PR / URL / screenshot
```
Also update `design-knowledge/DESIGN.md` when the decision changes the living brief.
**Source.** design-lab/decision-log.md — How to add

## Locked: Design Lab bootstrap (2026-10-12)
**Principle.** Cursor skills + DESIGN.md + Design Lab specs are the central stack.
**Apply when.** Tempted to invent a parallel design-docs tree.
**The move.** Keep skills under `.cursor/skills/*`, brief in `design-knowledge/DESIGN.md`, and Design Lab specs (export: `ref/design-lab/*`).
**Do not.** Create a second DESIGN.md per app; redesign authenticated shells without an explicit ask.
**Surfaces.** both
**Refs.** tasteskill.dev, skills.sh/vercel-labs/…/web-design-guidelines, getdesign.md, playwright.dev/agent-cli

## Locked: dark product theme (2026-10-12)
**Principle.** Unite/Rift analytics UI has a locked dark product theme.
**Apply when.** Touching authenticated Unite/Rift product shells.
**The move.** Canvas ~`#111111`, frost border `rgba(214,235,253,0.19)`, one accent per surface, HeroUI as the kit.
**Do not.** Default purple glow; cream+terracotta AI editorial.
**Surfaces.** product-shell
**Refs.** Unite Metrics `design/system`, `design-knowledge/DESIGN.md`

## Locked: Webdesign Knowledge is the source product (2026-10-13)
**Principle.** Design Lab specs live on product Webdesign Knowledge — not orphan product homes.
**Apply when.** Binding repos or deciding where specs are authoritative.
**The move.** Treat product `cmpa9317ec0de04b0e162d40` (Webdesign Knowledge) / workspace `cmp784ead7ec0e4ead89dd1b` as the home; local export mirror is `ref/design-lab/*`.
**Do not.** Keep editing `design-lab/*` on orphan Unite Metrics as source of truth.
**Surfaces.** both
