# Web Interface Guidelines audit

> Distilled from Design Lab spec `design-lab/web-interface-guidelines.md` (REVIEWED).
> Inspired by [Vercel web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines).

## Fetch fresh rules, then check everything
**Principle.** Audit rules drift; always pull the current command file.
**Apply when.** Running an a11y/UX interface audit on target files.
**The move.**
1. Fetch fresh rules from:
   `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
2. Read target files
3. Check **all** rules
4. Output terse `file:line` findings
**Source.** design-lab/web-interface-guidelines.md — Workflow

## High-signal checks that catch most regressions
**Principle.** A short checklist of high-leverage failures covers most shipping UI.
**Apply when.** Time-boxed reviews or before merge.
**The move.** Verify at least:
- Icon-only controls → `aria-label`
- Visible focus (never `outline-none` without replacement)
- Forms: label, autocomplete, do not block paste
- `prefers-reduced-motion`; ban `transition: all`
- Images: width/height + lazy below-fold
- Real links (`a`/`Link`), not clickable `div`
- Dark: `color-scheme` + native control colors
- Dates/numbers via `Intl.*`
**Source.** design-lab/web-interface-guidelines.md — High-signal checks

## Findings are terse and path:line addressed
**Principle.** Verbose essays hide the fix; `file:line` finds do not.
**Apply when.** Writing audit output.
**The move.** Use:
```text
## path/File.tsx
path/File.tsx:42 - icon button missing aria-label
```
**Source.** design-lab/web-interface-guidelines.md — Format
