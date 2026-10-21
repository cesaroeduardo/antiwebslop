# antiwebslop

**A small, readable agent skill that keeps AI-built web pages from looking AI-built, and a way to prove it.**

One skill folder, a zero-dependency lint, an optional Cursor hook, and a blind A/B eval kit.
No binary, no network calls, no telemetry. You can read every file in about twenty minutes.

Repo: <https://github.com/cesaroeduardo/antiwebslop>

## Results (before / after)

> **No measured runs yet.** This section is reserved for real numbers from
> [`eval/VALIDATION.md`](eval/VALIDATION.md). Nothing below will be filled in until a run
> has been scored with [`eval/rubric.md`](eval/rubric.md) under the
> [blind A/B protocol](eval/ab-protocol.md).

| Brief | Surface | Baseline (no skill) | With skill | Lint errors (before → after) | Blind pick |
|---|---|---|---|---|---|
| _pending_ | | | | | |

Scores are out of 42 (slop absence 20, craft 12, process 10) plus a pass/fail scope gate.
Until runs exist, the [slop gallery](gallery/index.html) shows what the lint catches on our test fixtures.

## What it does

- **Tells the agent what not to ship.** 35 anti-patterns, each with how to spot it and what to do
  instead: purple gradients, gradient text, glass, emoji bullets, "Unlock the power of", invented
  testimonials and metrics, labels above headlines, decorative 01/02/03, bouncy easing, and more.
- **Tells it what to do instead.** Type pairing and scale, a spacing scale, grid, color with one
  accent, hierarchy, real content. Four surface types (persuade, operate, read, showcase) set how
  hard to push.
- **Keeps each project consistent.** A per-project `DESIGN.md` with product truth and a
  machine-readable `design-tokens` block. The lint flags fonts, colors, and radii outside it.
- **Checks the result.** `slop-lint` (31 rules, `file:line` output, CI exit codes), optionally run
  after every agent write by a Cursor hook. Three-viewport visual QA and a pre-done checklist.
- **Measures itself.** A 0–2 scorecard and a blind A/B protocol, so changes to the skill are kept
  only when they win.

## Install

```bash
git clone https://github.com/cesaroeduardo/antiwebslop.git
cp -r antiwebslop/.cursor/skills/antiwebslop <your-project>/.cursor/skills/
# or for every project on this machine:
cp -r antiwebslop/.cursor/skills/antiwebslop ~/.cursor/skills/
```

Cursor discovers skills in `.cursor/skills/`. Other agents that read `SKILL.md` folders
(`~/.claude/skills/`, `~/.agents/skills/`) can use the same folder unchanged. The agent picks it
up on requests like "build a landing page", "this looks generic", or "make it look less AI".

Requirements: Node 18+ for the lint and hook. The skill text itself needs nothing.

## Run the lint

```bash
node .cursor/skills/antiwebslop/scripts/slop-lint.mjs src/ --quiet
node .cursor/skills/antiwebslop/scripts/slop-lint.mjs --list-rules
```

- Options: `--json`, `--quiet` (hide info), `--max-warnings N`, `--ext html,css,tsx`,
  `--design path/DESIGN.md` or `--no-design`.
- Token drift runs automatically when `DESIGN.md` or `docs/DESIGN.md` has a `design-tokens` block.
- Exit codes: 0 clean, 1 errors (or more warnings than `--max-warnings`), 2 usage error.
- Keep an intentional choice with a `slop-lint-disable-line` (or `-next-line` / `-file`) comment
  plus a reason. Directory walks skip `node_modules`, build output, and `fixtures/`.

## Optional: Cursor hook

Runs the lint on every UI file the agent writes and gives the findings back to the agent
(Cursor `postToolUse` hook, matcher `Write`, returned as `additional_context`). It is advisory:
it never blocks a write, and if anything goes wrong it stays silent.

```bash
# from your project root, after copying the skill in
node .cursor/skills/antiwebslop/scripts/install-cursor-hook.mjs            # add to .cursor/hooks.json
node .cursor/skills/antiwebslop/scripts/install-cursor-hook.mjs --dry-run  # preview
node .cursor/skills/antiwebslop/scripts/install-cursor-hook.mjs --uninstall
```

The installer merges with existing hooks and is safe to run twice. Project hooks only run in a
trusted workspace; check Cursor's Hooks tab or Hooks output channel if nothing shows up.
To pause it without uninstalling, start Cursor with `SLOP_LINT_HOOK=off` in the environment.

## How it compares

[Impeccable](https://impeccable.style) is the best-known tool in this space, and it is much bigger:
24 commands, a 61-rule detector that also checks rendered pages, hooks for many agents, a Chrome
extension, live in-browser iteration, and support for about 17 coding tools. If you want the most
coverage and automation, use it.

antiwebslop makes different trade-offs:

| | antiwebslop | Impeccable |
|---|---|---|
| Size | One skill folder, ~5 KB entry file, plain Markdown + ~375 lines of JS | Monorepo with a compiled engine and per-tool builds |
| Runtime | Node script, no downloads, no network | Self-contained engine binary, bundled or downloaded once on first run |
| Telemetry | None | Anonymous data about design-direction picks, on by default, opt-out |
| Detection | 31 source rules + DESIGN.md token drift | 61 rules on source and rendered pages, plus design-system checks |
| Agents | Cursor first; any tool that reads `SKILL.md` | About 17 tools with native installers |
| Proof | Built-in blind A/B protocol and scorecard | Demos, case study, community testimonials |
| Content honesty | Named rules against invented proof and placeholder people | Asks before adding claims |

The two can coexist in one project. If you run both, expect overlapping findings.

## Repository layout

| Path | What it is |
|---|---|
| `.cursor/skills/antiwebslop/SKILL.md` | Entry point: surface types, source-of-truth order, work loop, pre-done checklist |
| `.cursor/skills/antiwebslop/references/` | Loaded on demand: anti-patterns, craft, examples, dials, DESIGN.md contract, image-to-code, visual QA, a11y audit, decision log, sources |
| `.cursor/skills/antiwebslop/templates/DESIGN.template.md` | A project's `DESIGN.md` starting point, with product truth and `design-tokens` |
| `.cursor/skills/antiwebslop/scripts/` | `slop-lint.mjs`, `cursor-hook.mjs`, `install-cursor-hook.mjs` |
| [`eval/`](eval/README.md) | Scorecard, brief template, blind A/B protocol, validation log |
| [`gallery/`](gallery/README.md) | Static before/after pages with findings marked (era 2026-10) |
| `tests/` | Fixtures and `node:test` suites for the lint and the hook |
| `archive/kstonebase-export-2026-10-21/` | The original export the skill grew from. Not authoritative |

## Develop

```bash
npm test          # lint + hook tests (Node >= 18, no dependencies)
npm run gallery   # rebuild gallery/ from the fixtures
```

Change the skill, run the eval, log the result in `eval/VALIDATION.md`, keep what wins.

## Name

The repo and the skill are both `antiwebslop` (skill folder `.cursor/skills/antiwebslop/`).
Earlier names: `webdesign-knowledge`, then `webdesign-aislopkiller`. The GitHub repo moved from
`cesaroeduardo/webdesign-aislopkiller` to `cesaroeduardo/antiwebslop`.

## Prior art

- [Impeccable](https://impeccable.style) by Paul Bakaus (Apache-2.0): the ideas of grouping
  surfaces by what the visitor is there to do, checking code against the project's own design
  tokens, feeding detector results back to the agent through hooks, and dating slop by era.
  No text or code was copied.
- [Taste Skill](https://www.tasteskill.dev/): the Design Read, dials, and bans.
- [Vercel web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines): accessibility and UX audit rules.
- [getdesign.md](https://getdesign.md/): `DESIGN.md` as a reusable brief.
- [image-to-code-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill): reference → extract → implement.
- [Playwright CLI](https://playwright.dev/agent-cli/introduction): multi-viewport screenshots.

## License

No license file yet, so default copyright applies: people can read the code but have no
permission to reuse it. Add a `LICENSE` to let others copy the skill.
