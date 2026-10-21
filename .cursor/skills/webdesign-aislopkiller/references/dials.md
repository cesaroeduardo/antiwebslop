# Anti-slop and design dials

> Distilled from Design Lab spec `design-lab/anti-slop.md` (REVIEWED).

## Design Read is mandatory before code
**Principle.** Naming the page, audience, language, and stack prevents generic AI layout.
**Apply when.** Any visual implementation or redesign starts.
**The move.** Say aloud (in the reply or plan): *"Reading this as: \<page\> for \<audience\>, with a \<language\> language, leaning toward \<stack\>."* Do not skip to components.
**Source.** design-lab/anti-slop.md — Design Read

## Set dials explicitly; defaults are marketing-strong
**Principle.** VARIANCE / MOTION / DENSITY are controllable knobs, not vibes.
**Apply when.** Choosing intensity for a surface.
**The move.** Default marketing: `VARIANCE 8 / MOTION 6 / DENSITY 4`. Adjust by context:

| Context | V | M | D |
|---------|---|---|---|
| Minimal / Linear | 5–6 | 3–4 | 2–3 |
| Premium consumer | 7–8 | 5–7 | 3–4 |
| Experimental | 9–10 | 8–10 | 3–4 |
| Analytics dashboard | 3–4 | 2–3 | 6–8 |

**Source.** design-lab/anti-slop.md — Dials

## Hard bans — do not ship these looks
**Principle.** Certain patterns are overused AI defaults; they are banned, not "options".
**Apply when.** Generating or reviewing marketing UI.
**The move.** Refuse / rewrite if you see:
- Purple→indigo gradients / AI glow
- Cream `#F4F1EA` + terracotta + generic editorial serif
- Centered hero + three equal feature cards
- Cards inside cards; stickers on the hero
- `transition: all`; loops without `prefers-reduced-motion`
- Inter/Roboto/Arial as the only display choice for new marketing
**Source.** design-lab/anti-slop.md — Bans

## Marketing composition: one job, brand-first, full-bleed
**Principle.** The first viewport is one composition, not a dashboard of promos.
**Apply when.** Landing or promotional heroes.
**The move.** One job in the first viewport; brand-first; full-bleed hero; `min-h-[100dvh]`. No hero overlays (detached labels, floating badges, promo stickers). Default: no cards in the hero.
**Source.** design-lab/anti-slop.md — Composition (marketing)

## Product shells keep the kit
**Principle.** Authenticated apps already have a design system; anti-slop is not a license to restyle everything.
**Apply when.** Working inside product UI (dashboards, settings, app chrome).
**The move.** Keep the project design system. Apply anti-slop to **new** surfaces or **explicit redesigns** only.
**Source.** design-lab/anti-slop.md — Product shells
