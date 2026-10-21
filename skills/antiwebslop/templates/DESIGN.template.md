# DESIGN.md — <Project name>

> Living design brief for this project. Sections 1–2 are product truth and intent; 3–12 are the visual system.
> Read order: tokens in code → this file → antiwebslop skill defaults.
> Replace every `<…>`; delete sections that truly do not apply.

## 1. Product truth
Facts about the product and its people. These change rarely; visual choices below must serve them.
- **Users:** <who uses this, in what situation, on what device. e.g. "Ranked Pokémon Unite players checking stats on a phone between matches">
- **Purpose:** <what the product does for them, in one sentence>
- **Constraints:** <brand assets that must stay, accessibility needs, languages, performance budget, legal>
- **Success means:** <the observable outcome per surface. e.g. "Landing: visitor imports matches. Dashboard: finds a weak hero in < 10 s">
- **Real content available:** <screenshots, data, quotes, logos the agent may use; paths>

## 2. Design Read and surface types
Reading this as: <page> for <audience>, with a <visual language> language, on <stack>.
| Surface | Type (persuade / operate / read / showcase) | V | M | D |
|---|---|---|---|---|
| <Landing> | persuade | <8> | <6> | <4> |
| <App> | operate | <3> | <2> | <7> |

## 3. Visual direction and project bans
- Direction: <3–5 concrete statements, e.g. "data-forward, screenshots over illustration, editorial headline scale">
- Bans (in addition to the skill catalog): <e.g. "no illustrations of people">
- Allowed exceptions to the catalog, with reason: <e.g. "purple #6D28D9 is the actual logo color">

## 4. Color tokens

Machine-readable tokens. `slop-lint` reads this block and warns about fonts, hex colors, and radii
in code that are not listed. Keep it in sync with sections 4–7; one key per line, comma-separated.

```design-tokens
fonts: <Display family>, <Text family>, <Mono family>
colors: <#FBFBFA>, <#17181A>, <#5B5F66>, <#E4E4E1>, <#0F766E>, <#FFFFFF>
radii: 0, <6px>, <10px>, 9999px
```

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
