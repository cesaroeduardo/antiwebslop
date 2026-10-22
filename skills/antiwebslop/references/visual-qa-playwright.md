# Visual QA with Playwright CLI

Credit: [Playwright CLI](https://playwright.dev/agent-cli/introduction). Any browser
screenshot tool works (Cursor browser tools, Playwright MCP); the viewports and report format are what matter.

## Setup (once per machine)

```bash
npm install -g @playwright/cli
playwright-cli install-browser chromium
```

## Capture

```bash
playwright-cli open http://localhost:3000
playwright-cli resize 1440 900  && playwright-cli screenshot
playwright-cli resize 768 1024  && playwright-cli screenshot
playwright-cli resize 390 844   && playwright-cli screenshot
playwright-cli snapshot          # accessibility tree, for focus/labels review
```

`screenshot` captures the viewport. For long pages, also capture below the fold: scroll with
`playwright-cli mousewheel 0 900` and screenshot again, or take one full-page shot through
`playwright-cli run-code` with `page.screenshot({ fullPage: true })` (check `playwright-cli --help run-code` for the exact form).

| Name | Size |
|---|---|
| Desktop | 1440×900 |
| Tablet | 768×1024 |
| Mobile | 390×844 |

## What to flag

- **Layout:** clipping, horizontal overflow, sticky elements covering content or focus, broken grid at tablet.
- **Hierarchy:** no clear first read (blur test), competing primary buttons, headline and CTA below the fold on mobile.
- **Type:** widow (lone last-line word) on titles or lead copy at 1440 and 390; missing `text-balance` / `text-pretty`.
- **Slop:** anything from the [anti-pattern catalog](anti-patterns.md) that the lint cannot see: default centered-everything without a dial/Design Read reason, identical section rhythm, icon soup, stock imagery, uniform card look. Intentional centered/low-V layouts are not slop.
- **A11y:** low contrast, invisible focus, motion without reduced-motion support.
- **Dials:** does the screenshot match the stated V/M/D? (see [dials](dials.md))

## Report

Write findings the way you’d say them out loud: blunt, specific, no “perhaps we could…”, no em dashes. Name the failure, then the fix. Keep design terms in English; prefix font names (“the typeface …”).

```text
## Desktop 1440×900
- [high] Primary and secondary look the same weight. The secondary is winning the fight. Make it a text link.
## Mobile 390×844
- [critical] Headline is 7 lines and the CTA is below the fold. Shorten the copy first; only then drop a type step.
```

Severity: `critical` (broken or unusable) · `high` (slop or hierarchy failure) · `medium` · `nit`.
Fix critical and high, re-capture, and include the after-screenshots.
