# DESIGN.md contract

> Distilled from Design Lab spec `design-lab/design-md-contract.md` (REVIEWED).

## One living brief, ten required sections
**Principle.** DESIGN.md is the reusable library brief — not a dump of adjectives.
**Apply when.** Creating or updating `design-knowledge/DESIGN.md`.
**The move.** Keep these sections, in order:
1. Intent
2. Visual direction (+ bans)
3. Color (concrete tokens)
4. Typography
5. Spacing & layout
6. Components
7. Motion
8. Imagery
9. Do / Don't
10. References
**Source.** design-lab/design-md-contract.md — Required sections

## Tokens over adjectives; one accent; document why
**Principle.** Vague color talk drifts; locked tokens and rationale do not.
**Apply when.** Writing color, type, or component rules.
**The move.**
- Prefer hex / CSS vars over adjectives
- One accent per surface, locked
- Document the *why*
**Source.** design-lab/design-md-contract.md — Rules

## Strong decisions update DESIGN.md and the decision log
**Principle.** A decision that should survive the next chat must be written twice.
**Apply when.** You lock a look, token, ban, or composition rule.
**The move.** Update `design-knowledge/DESIGN.md` **and** append an entry in decision-log format. Do **not** proliferate a DESIGN.md per app — one library brief.
**Source.** design-lab/design-md-contract.md — Rules

## Read order is fixed
**Principle.** Agents must not invent a competing source of truth order.
**Apply when.** Resolving conflict between docs, specs, and code.
**The move.** Read in this order:
1. Design Lab (`ref/design-lab/*` / this skill) — and `design/system` when relevant
2. `design-knowledge/DESIGN.md`
3. Legacy `docs/DESIGN.md` if present
4. Tokens in code
**Source.** design-lab/design-md-contract.md — Read order
