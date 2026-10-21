# Vision and work loop

> Distilled from Design Lab spec `design-lab/vision.md` (REVIEWED).

## Design Lab is a cross-project decision library
**Principle.** Strong web design decisions should live as shared knowledge for agents and humans — not reinvented per chat or per app.
**Apply when.** Starting any marketing/help UI, redesign, or design-system question in this workspace.
**The move.** Treat Design Lab (this skill + `ref/design-lab/*` + `design-knowledge/DESIGN.md`) as the library. Cross-project home: product **Webdesign Knowledge** inside workspace **General Knowledges**.
**Source.** design-lab/vision.md — Why it exists

## Absorb proven external tools; do not fork blindly
**Principle.** The Lab absorbs specific strengths from known tools instead of inventing a parallel stack.
**Apply when.** Choosing which workflow to run (taste, audit, brief, image-first, visual QA).
**The move.** Map the job to the absorbed source:

| Tool | What we absorbed |
|------|------------------|
| [Taste Skill](https://www.tasteskill.dev/) | Anti-slop, design read, dials, bans |
| [Vercel web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) | Fresh a11y/UX audit rules |
| [getdesign.md](https://getdesign.md/) | DESIGN.md as a reusable brief |
| [image-to-code-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill) | Image → analysis → code |
| [Playwright Agent CLI](https://playwright.dev/agent-cli/introduction) | Multi-viewport visual QA |

**Source.** design-lab/vision.md — External inspiration

## Repo artifacts stay in known paths
**Principle.** Agents find the brief and skills in fixed locations.
**Apply when.** Looking for DESIGN.md or related project skills.
**The move.** Prefer:

| Path | Role |
|------|------|
| `design-knowledge/DESIGN.md` | Living brief |
| `design-knowledge/README.md` | Index |
| This skill (`webdesign-knowledge`) | Unified Design Lab playbook |
| `ref/design-lab/*` | Exported Kstonebase specs (mirror) |

Legacy split skills (if present): `.cursor/skills/web-design-taste`, `web-interface-guidelines`, `design-md`, `image-to-code`, `visual-qa-playwright`.
**Source.** design-lab/vision.md — Repo artifacts

## Work loop is read → theme → act → log
**Principle.** Design work is a loop, not a one-shot prompt.
**Apply when.** Any Design Lab task.
**The move.**
1. Read Design Lab references + `DESIGN.md`
2. Open only the matching reference theme(s)
3. Implement / audit / capture viewports
4. Record durable decisions in the decision-log format
**Source.** design-lab/vision.md — Work loop

## Scope: marketing yes; product shells careful
**Principle.** Full playbook applies to promotional surfaces; authenticated shells keep their kit.
**Apply when.** Choosing how aggressively to restyle.
**The move.**
- **Yes:** landing, help/marketing, visual redesigns, UI QA
- **Careful:** authenticated product shells — preserve existing design systems (e.g. HeroUI) unless explicitly redesigning
**Source.** design-lab/vision.md — Scope
