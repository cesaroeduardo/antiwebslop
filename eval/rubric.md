# Scorecard (0–2 per item)

0 = fails · 1 = partly · 2 = clearly passes. Score from the 3-viewport screenshots plus the code.
Items marked **(lint)** take their evidence from `slop-lint --json`; the others are judged by a person.

## A. Slop absence (20 pts)

| # | Item | 2 = | Evidence |
|---|---|---|---|
| A1 | No purple/indigo gradient, glow, gradient text | none, or documented brand | lint: purple-gradient, gradient-text |
| A2 | No decorative glass or blur blobs | none, or blur only where content scrolls under | lint: glassmorphism, blur-blob |
| A3 | No emoji as decoration | none | lint: emoji-decoration |
| A4 | Copy is specific | headline and CTA name this product and action | lint: slop-copy, generic-cta + read |
| A5 | No invented proof | none, or marked `TODO(content)` | lint: fake-proof, placeholder-name |
| A6 | Not centered hero + three equal cards | different composition chosen from content | screenshot |
| A7 | Section rhythm varies by job | at least 2 distinct densities/widths | screenshot |
| A8 | Icons only where useful; one set | ≤ 1 icon per item, none decorative | lint: icon-soup + screenshot |
| A9 | Radius/shadow vary by role | at least 2 radius values; elevation only on floating UI | lint: uniform-radius-shadow |
| A10 | No stock palette (cream+terracotta, neon dark) | none | lint: cream-terracotta + screenshot |

## B. Craft (12 pts)

| # | Item | 2 = |
|---|---|---|
| B1 | Type pairing deliberate | display face fits the Design Read; ≤ 2 families |
| B2 | Type scale | ratio scale; headline ≥ 2.5× body (desktop) |
| B3 | Spacing scale | values come from one scale; groups and sections clearly separated |
| B4 | Color with intent | tokens; one accent with one job; AA contrast |
| B5 | Hierarchy | blur test shows one first read and one primary action per view |
| B6 | Real content | real screenshots/data/names; nothing invented |

## C. Process (10 pts)

| # | Item | 2 = |
|---|---|---|
| C1 | Design Read + dials stated | present before code |
| C2 | Output matches dials | reviewer can see the stated V/M/D (see dials.md tables) |
| C3 | DESIGN.md | created or updated with tokens and a decision entry when warranted |
| C4 | Visual QA | 3 viewports captured, severity report, critical/high fixed |
| C5 | A11y | focus visible, reduced motion, labels; lint `outline-none`, `transition-all`, `motion-no-reduce` clean |

## D. Scope safety (gate)

| # | Item | Pass = |
|---|---|---|
| D1 | Product UI untouched unless asked | kit, tokens, layout preserved; **a fail here fails the run regardless of score** |

## Totals

- Max 42. Report `A/20 · B/12 · C/10 · total/42 · D pass|fail · lint E/W/I`.
- **Pass bar for a skill version:** with-skill total ≥ baseline × 1.3, zero lint errors in with-skill outputs, D passes on every run.
