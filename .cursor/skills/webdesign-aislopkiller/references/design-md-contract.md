# DESIGN.md contract

Credit: [getdesign.md](https://getdesign.md/).

## One DESIGN.md per project

- Location: repo root `DESIGN.md` (or `docs/DESIGN.md` if the project keeps docs there). In a monorepo, one per app that has its own brand; shared packages link to it.
- Create it from [the template](../templates/DESIGN.template.md) when it is missing and the task is a new page, a redesign, or a token change. Do not create one for a one-line fix.
- It describes **this project**. Cross-project defaults live in this skill, not in a project file.

## Required sections (in order)

1. Product truth (users, purpose, constraints, success) · 2. Design Read and surface types · 3. Visual direction and project bans · 4. Color tokens (with the `design-tokens` block) · 5. Typography · 6. Spacing and layout · 7. Components · 8. Motion · 9. Imagery and content · 10. Do / Don't · 11. Decision log · 12. References

## Rules

- Hex values or CSS variables, never adjectives alone ("warm gray" → `--color-muted: #8A857D`).
- One accent per surface, with its job written down.
- Every rule has a *why* in one line.
- Keep the `design-tokens` block current: `fonts:`, `colors:` (hex), `radii:`, comma-separated. `slop-lint` uses it to flag off-system values (`token-font`, `token-color`, `token-radius`); the lint skips the check when the block is missing.
- When code tokens and DESIGN.md disagree, code is the truth for what ships today: fix DESIGN.md or open a TODO; do not silently restyle.

## Read order (earlier wins on conflict)

1. Existing tokens and design system in code (theme, CSS vars, Tailwind config, component kit)
2. The project's `DESIGN.md`
3. This skill's defaults

## When to update

After a durable decision (a token, a ban, a composition rule, a dial change for a surface): update the relevant section **and** append an entry to the decision log (section 11). See [decision-log](decision-log.md).
