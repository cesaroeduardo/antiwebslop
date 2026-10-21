# Web Interface Guidelines audit

Credit: [Vercel web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines).

## Workflow

1. Fetch the current rules: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` (if offline, use the high-signal list below).
2. Read the target files.
3. Check all rules.
4. Output terse `file:line` findings.

## High-signal checks

- Icon-only controls have `aria-label`
- Visible focus (no `outline-none` without a `focus-visible` replacement)
- Forms: labels, `autocomplete`, paste allowed
- `prefers-reduced-motion` respected; no `transition: all`
- Images have `width`/`height`; below-fold images are lazy
- Real links (`a`/`Link`), not clickable `div`s
- Dark mode sets `color-scheme` and native control colors
- Dates and numbers formatted with `Intl.*`

Several of these are also caught by `scripts/slop-lint.mjs` (`outline-none`, `transition-all`, `motion-no-reduce`).

## Finding format

```text
## path/File.tsx
path/File.tsx:42 - icon button missing aria-label
```
