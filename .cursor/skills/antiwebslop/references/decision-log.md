# Decision log

Each project keeps an append-only log of **strong** design decisions so agents reuse them
instead of rediscovering them. It lives in the project's `DESIGN.md` (section 11) or in a
sibling `DESIGN-DECISIONS.md` if it grows past ~20 entries.

## Template

```markdown
### YYYY-MM-DD — <short title>
- **Context:** …
- **Decision:** …
- **Why:** …
- **Do not:** …
- **Surfaces:** marketing | product-ui | both
- **Refs:** PR / URL / screenshot
```

Log it when you lock a token, a ban, a composition rule, a dial change, or a source-of-truth change.
Do not log routine fixes.

## Example entry (from a past project — illustrative, not a rule)

This shows the level of detail expected. It belongs to one project's product UI; do **not**
apply these values anywhere else.

```markdown
### 2026-10-12 — Dark product theme locked
- **Context:** Analytics dashboard (product UI) for a game-stats app.
- **Decision:** Canvas ~#111111, frost border rgba(214,235,253,0.19), one accent per surface, HeroUI as the kit.
- **Why:** Shipped consistency; avoids default purple-glow dark mode.
- **Do not:** Default purple glow; cream + terracotta editorial palette.
- **Surfaces:** product-ui
- **Refs:** the project's design/system page
```
