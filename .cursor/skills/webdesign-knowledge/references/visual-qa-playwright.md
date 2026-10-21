# Visual QA with Playwright Agent CLI

> Distilled from Design Lab spec `design-lab/visual-qa-playwright.md` (REVIEWED).

## Install Playwright Agent CLI once
**Principle.** Viewport proof needs a real browser pipeline.
**Apply when.** First visual QA setup on a machine.
**The move.**
```bash
npm install -g @playwright/cli
playwright-cli install-browser chromium
```
**Source.** design-lab/visual-qa-playwright.md — Setup

## Capture the three canonical viewports
**Principle.** Desktop-only screenshots hide mobile/tablet failure modes.
**Apply when.** Auditing a live local or preview URL.
**The move.**
```bash
playwright-cli open http://localhost:3000 --headed
playwright-cli resize 1440 900 && playwright-cli screenshot
playwright-cli resize 768 1024 && playwright-cli screenshot
playwright-cli resize 390 844 && playwright-cli screenshot
playwright-cli snapshot
```
Fallback: Cursor browser tools (`browser_take_screenshot`, `browser_snapshot`).

| Name | Size |
|------|------|
| Desktop | 1440×900 |
| Tablet | 768×1024 |
| Mobile | 390×844 |

**Source.** design-lab/visual-qa-playwright.md — Loop / Viewports

## Flag the high-cost visual failures
**Principle.** Not every pixel issue is equal; catch what kills hierarchy and use.
**Apply when.** Reviewing screenshots / snapshots.
**The move.** Flag: clipping, weak hierarchy, low contrast, horizontal overflow, sticky covering focus, hero clutter, motion without reduced-motion support.
**Source.** design-lab/visual-qa-playwright.md — Flag

## Report by viewport with severity, then fix and re-capture
**Principle.** Visual QA without a severity report and re-proof is incomplete.
**Apply when.** Writing findings after capture.
**The move.** Sections per viewport; severity `critical|high|medium|nit`; fix with anti-slop/dials; re-capture. Human dashboard: `playwright-cli show --annotate`.
**Source.** design-lab/visual-qa-playwright.md — Report
