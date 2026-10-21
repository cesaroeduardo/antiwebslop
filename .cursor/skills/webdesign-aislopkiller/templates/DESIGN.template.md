# DESIGN.md — <Project name>

> Living design brief for this project. Read order: tokens in code → this file → webdesign-aislopkiller defaults.
> Replace every `<…>`; delete sections that truly do not apply.

## 1. Intent
<What this surface must achieve, for whom, in 2–3 sentences. e.g. "Get ranked Pokémon Unite players to import their match history.">

## 2. Design Read and dials
Reading this as: <page> for <audience>, with a <visual language> language, on <stack>.
| Surface | V | M | D |
|---|---|---|---|
| Marketing | <8> | <6> | <4> |
| Product UI | <3> | <2> | <7> |

## 3. Visual direction and project bans
- Direction: <3–5 concrete statements, e.g. "data-forward, screenshots over illustration, editorial headline scale">
- Bans (in addition to the skill catalog): <e.g. "no illustrations of people">
- Allowed exceptions to the catalog, with reason: <e.g. "purple #6D28D9 is the actual logo color">

## 4. Color tokens
| Token | Value | Job |
|---|---|---|
| `--color-bg` | <#…> | page background |
| `--color-surface` | <#…> | raised surfaces |
| `--color-fg` | <#…> | body text |
| `--color-muted` | <#…> | secondary text (≥ 4.5:1 on bg) |
| `--color-border` | <#…> | hairlines |
| `--color-accent` | <#…> | primary action and current state only |
| `--color-accent-fg` | <#…> | text on accent |

## 5. Typography
- Display: <family, weights> — why: <…>
- Text: <family, weights>
- Mono/data (optional): <family>
- Scale (ratio <1.25>): <12.8 / 16 / 20 / 25 / 31 / 39 / 49 / 61>
- Body: <17px / 1.6 / 65ch>

## 6. Spacing and layout
- Scale: <4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128>
- Grid: <12 cols desktop, 4 mobile; max-width 1200px; gutter 24px>
- Section padding: <96–128 desktop / 64 mobile>; vary by section job.

## 7. Components
- Radius by role: <controls 6px · containers 10px · media 0>
- Elevation: <only menus, dialogs, toasts>
- Buttons: <primary = accent fill; secondary = text link>
- Kit: <e.g. HeroUI / shadcn / none> — keep it in product UI.

## 8. Motion
<Durations, easing, what animates, reduced-motion behavior.>

## 9. Imagery and content
- Imagery: <real product screenshots at readable scale; no stock photos>
- Voice: <e.g. plain, specific, numbers over adjectives>
- Content sources: <where real data, quotes, screenshots come from>

## 10. Do / Don't
| Do | Don't |
|---|---|
| <…> | <…> |

## 11. Decision log
<Append entries using the template in the skill's references/decision-log.md.>

## 12. References
<Links to inspiration, brand assets, Figma, the live site.>
