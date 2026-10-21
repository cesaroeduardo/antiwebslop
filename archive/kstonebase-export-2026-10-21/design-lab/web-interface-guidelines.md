---
title: Web Interface Guidelines audit
type: document
status: reviewed
lastUpdated: 2026-10-13T21:47:18.687Z
product: Webdesign Knowledge
productDescription: Repository for Webdesign Knowledge
---

# Web Interface Guidelines audit

Skill: `.cursor/skills/web-interface-guidelines`.
Inspired by [Vercel web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines).

## Workflow

1. Fetch fresh rules:

```text
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

2. Read target files
3. Check **all** rules
4. Output terse `file:line` findings

## High-signal checks

- Icon-only → `aria-label`
- Visible focus (never `outline-none` without replacement)
- Forms: label, autocomplete, do not block paste
- `prefers-reduced-motion`; ban `transition: all`
- Images: width/height + lazy below-fold
- Real links (`a`/`Link`), not clickable `div`
- Dark: `color-scheme` + native control colors
- Dates/numbers via `Intl.*`

## Format

```text
## path/File.tsx
path/File.tsx:42 - icon button missing aria-label
```
