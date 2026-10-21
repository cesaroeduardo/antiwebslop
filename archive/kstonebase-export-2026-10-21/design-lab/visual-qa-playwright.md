---
title: Visual QA with Playwright Agent CLI
type: document
status: reviewed
lastUpdated: 2026-10-13T21:48:04.78Z
product: Webdesign Knowledge
productDescription: Repository for Webdesign Knowledge
---

# Visual QA with Playwright Agent CLI

Skill: `.cursor/skills/visual-qa-playwright`.
Inspired by [Playwright Agent CLI](https://playwright.dev/agent-cli/introduction).

## Setup

```bash
npm install -g @playwright/cli
playwright-cli install-browser chromium
```

## Loop

```bash
playwright-cli open http://localhost:3000 --headed
playwright-cli resize 1440 900 && playwright-cli screenshot
playwright-cli resize 768 1024 && playwright-cli screenshot
playwright-cli resize 390 844 && playwright-cli screenshot
playwright-cli snapshot
```

Fallback: Cursor browser tools (`browser_take_screenshot`, `browser_snapshot`).

## Viewports

| Name | Size |
|------|------|
| Desktop | 1440×900 |
| Tablet | 768×1024 |
| Mobile | 390×844 |

## Flag

Clipping, weak hierarchy, low contrast, horizontal overflow, sticky covering focus, hero clutter, motion without reduced-motion support.

## Report

Sections per viewport; severity `critical|high|medium|nit`; then fix with `web-design-taste` and re-capture.

Human dashboard: `playwright-cli show --annotate`.
