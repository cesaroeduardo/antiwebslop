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
- **Slop:** anything from the [anti-pattern catalog](anti-patterns.md) that the lint cannot see: centered-everything, identical section rhythm, icon soup, stock imagery, uniform card look.
- **A11y:** low contrast, invisible focus, motion without reduced-motion support.
- **Dials:** does the screenshot match the stated V/M/D? (see [dials](dials.md))

## Report

```text
## Desktop 1440×900
- [high] Hero CTA and secondary link have equal weight → make the link text-only
## Mobile 390×844
- [critical] Headline wraps to 7 lines; primary CTA below the fold → step headline down one scale size
```

Severity: `critical` (broken or unusable) · `high` (slop or hierarchy failure) · `medium` · `nit`.
Fix critical and high, re-capture, and include the after-screenshots.
