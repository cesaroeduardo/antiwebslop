# webdesign-aislopkiller

An agent skill, a lint script, and an eval kit that keep AI-built web design from
looking like AI slop: no purple gradients, no emoji bullets, no "Unlock the power of",
no three identical cards. Instead it gives the agent concrete craft rules and a
project-specific brief, and checks the result.

## What's here

| Path | What it is |
|---|---|
| [`.cursor/skills/webdesign-aislopkiller/SKILL.md`](.cursor/skills/webdesign-aislopkiller/SKILL.md) | The skill entry point: scope, source-of-truth order, work loop, pre-done checklist |
| `.cursor/skills/webdesign-aislopkiller/references/` | Loaded on demand: anti-patterns, craft, examples, dials, DESIGN.md contract, image-to-code, visual QA, a11y audit, decision log, sources |
| `.cursor/skills/webdesign-aislopkiller/templates/DESIGN.template.md` | Starting point for a project's own `DESIGN.md` |
| `.cursor/skills/webdesign-aislopkiller/scripts/slop-lint.mjs` | Zero-dependency lint for slop patterns (`file:line` output) |
| [`eval/`](eval/README.md) | Rubric, brief template, A/B protocol, validation log |
| `tests/` | Fixtures and tests for slop-lint |
| `archive/kstonebase-export-2026-10-21/` | Frozen original export the skill was distilled from. **Not authoritative**; kept for provenance |

## Install the skill in a project

Copy the skill folder into the project:

```bash
cp -r .cursor/skills/webdesign-aislopkiller <your-project>/.cursor/skills/
# or for all projects on this machine:
cp -r .cursor/skills/webdesign-aislopkiller ~/.cursor/skills/
```

Cursor discovers project skills in `.cursor/skills/`. Other agents that read `SKILL.md`
folders (e.g. `~/.claude/skills/`, `~/.agents/skills/`) can use the same folder unchanged.
The agent triggers it on requests like "build a landing page", "this looks generic", or "make it look less AI".

## Run the lint

```bash
node .cursor/skills/webdesign-aislopkiller/scripts/slop-lint.mjs src/ app/ --quiet
# options: --json  --quiet (hide info)  --max-warnings N  --ext html,css,tsx
```

Exits 1 on any error (or more warnings than `--max-warnings`), so it can run in CI.
Suppress a justified hit with a `slop-lint-disable-line` (or `-next-line` / `-file`) comment and a reason.
Directory walks skip `node_modules`, build output, and `fixtures/`.

## Develop

```bash
npm test          # node:test suite for slop-lint (Node >= 18, no dependencies)
```

Changes to the skill should be validated with [`eval/`](eval/README.md) and logged in `eval/VALIDATION.md`.

## Name

The repo and the skill are both `webdesign-aislopkiller`. The skill used to be called
`webdesign-knowledge`; it was renamed so the name you install matches the repo.

## License

No license file yet, so default copyright applies: others can read the code but have no
permission to reuse it. Add a `LICENSE` if you want people to copy the skill.

## Credits

Ideas absorbed from [Taste Skill](https://www.tasteskill.dev/), [Vercel web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines),
[getdesign.md](https://getdesign.md/), [image-to-code-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill),
and [Playwright CLI](https://playwright.dev/agent-cli/introduction). See `references/sources-and-scope.md`.
