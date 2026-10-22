![antiwebslop](assets/cover.png)

# antiwebslop

**A small, readable agent skill that keeps AI-built web pages from looking AI-built, and a way to prove it.**

One skill folder, a zero-dependency lint, an optional Cursor hook, and a blind A/B eval kit.
No binary, no network calls, no telemetry. You can read every file in about twenty minutes.

Site: <https://antiwebslop.cesaroeduardo.com> · Repo: <https://github.com/cesaroeduardo/antiwebslop>

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

- **Tells the agent what not to ship.** 67 anti-patterns, each with how to spot it and what to do
  instead: purple gradients, gradient text, glass, emoji bullets, "Unlock the power of", invented
  testimonials and metrics, labels above headlines, decorative 01/02/03, bouncy easing, and more.
- **Tells it what to do instead.** Type pairing and scale, a spacing scale, grid, color with one
  accent, hierarchy, real content. Four surface types (persuade, operate, read, showcase) set how
  hard to push.
- **Keeps each project consistent.** A per-project `DESIGN.md` with product truth and a
  machine-readable `design-tokens` block. The lint flags fonts, colors, and radii outside it.
- **Checks the result.** `slop-lint` (57 rules, `file:line` output, CI exit codes), optionally run
  after every agent write by a Cursor hook. Three-viewport visual QA and a pre-done checklist.
- **Measures itself.** A 0–2 scorecard and a blind A/B protocol, so changes to the skill are kept
  only when they win.

## Install

There is one skill folder, [`skills/antiwebslop/`](skills/antiwebslop/), and every route below
installs that same folder. Pick the line for your agent.

| Agent | Install | Verified |
|---|---|---|
| Any agent (Cursor, Codex, Claude Code, Grok Build, Gemini CLI, Copilot, OpenCode, and more) | `npx skills add cesaroeduardo/antiwebslop` | yes |
| Cursor | `npx skills add cesaroeduardo/antiwebslop -a cursor`, or Customize → From GitHub Repository → `cesaroeduardo/antiwebslop` (plugin) | CLI yes, plugin import no |
| OpenAI Codex (CLI, IDE, app) | `codex plugin marketplace add cesaroeduardo/antiwebslop && codex plugin add antiwebslop@antiwebslop` | yes |
| Claude Code | `claude plugin marketplace add cesaroeduardo/antiwebslop && claude plugin install antiwebslop@antiwebslop` | yes |
| claude.ai / Claude Desktop | `npm run pack`, then Customize → Skills → + → Upload a skill → `dist/antiwebslop.zip` | zip yes, upload no |
| Grok Bot | Send your bot: "Save the antiwebslop skill from https://github.com/cesaroeduardo/antiwebslop (folder skills/antiwebslop)" | no |
| Grok Build (CLI) | `grok plugin install cesaroeduardo/antiwebslop --trust`, or `npx skills add cesaroeduardo/antiwebslop -a grok` | npx yes, plugin no |

Notes:

- **`npx skills`** ([vercel-labs/skills](https://github.com/vercel-labs/skills), Node 22.20+) puts the
  skill in `.agents/skills/antiwebslop/` (read by Cursor, Codex, and other agents) and symlinks it into
  agent-specific folders such as `.claude/skills/`. Add `-g` for every project on the machine, `-a <agent>`
  to choose agents, `--copy` if you cannot use symlinks. That CLI sends anonymous usage data unless you
  set `DISABLE_TELEMETRY=1`. antiwebslop itself sends nothing.
- **Inside a Claude Code session** the same install is `/plugin marketplace add cesaroeduardo/antiwebslop`
  then `/plugin install antiwebslop@antiwebslop`. Plugin skills are namespaced: `/antiwebslop:antiwebslop`.
- **Codex** also takes the bare skill: ask `$skill-installer` for
  `https://github.com/cesaroeduardo/antiwebslop/tree/main/skills/antiwebslop`.
- **Manual copy** works everywhere: `git clone https://github.com/cesaroeduardo/antiwebslop.git` and copy
  `antiwebslop/skills/antiwebslop` into `.agents/skills/`, `.cursor/skills/`, `.claude/skills/`,
  `~/.codex/skills/`, or `~/.grok/skills/`.

The agent picks the skill up on requests like "build a landing page", "this looks generic", or
"make it look less AI". Requirements: Node 18+ for the lint and hook. The skill text needs nothing.

### Where the scripts end up

The lint and hook live in the skill's `scripts/` folder, wherever it was installed. The skill tells
the agent to call them relative to its own folder, so you only need the paths to run them yourself:

| Installed with | Scripts folder |
|---|---|
| `npx skills add` (project) | `.agents/skills/antiwebslop/scripts/` |
| Manual copy | `<skills dir>/antiwebslop/scripts/` |
| Claude Code plugin | `~/.claude/plugins/cache/antiwebslop/antiwebslop/<version>/skills/antiwebslop/scripts/` |
| Codex plugin | `~/.codex/plugins/cache/antiwebslop/antiwebslop/<version>/skills/antiwebslop/scripts/` |
| This repo | `skills/antiwebslop/scripts/` |

For the Cursor hook, install the skill into the project (`npx skills add` or a copy). Plugin caches
change path with every version, which would leave a stale path in `.cursor/hooks.json`.

## Run the lint

```bash
# paths for an `npx skills add` install; see the table above for others
node .agents/skills/antiwebslop/scripts/slop-lint.mjs src/ --quiet
node .agents/skills/antiwebslop/scripts/slop-lint.mjs --list-rules
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
# from your project root, after installing the skill into the project
node .agents/skills/antiwebslop/scripts/install-cursor-hook.mjs            # add to .cursor/hooks.json
node .agents/skills/antiwebslop/scripts/install-cursor-hook.mjs --dry-run  # preview
node .agents/skills/antiwebslop/scripts/install-cursor-hook.mjs --uninstall
```

The installer merges with existing hooks and is safe to run twice. Project hooks only run in a
trusted workspace; check Cursor's Hooks tab or Hooks output channel if nothing shows up.
To pause it without uninstalling, start Cursor with `SLOP_LINT_HOOK=off` in the environment.

## Trade-offs

antiwebslop stays small on purpose: one skill folder you can read in one sitting, and a lint with no
dependencies. Larger design tools add more commands, checks on rendered pages, browser extensions and
native installers for many agents. If you want the most coverage and automation, pair it with one of
those; expect overlapping findings if you do.

| | antiwebslop |
|---|---|
| Size | One skill folder, ~5 KB entry file, plain Markdown + ~375 lines of JS |
| Runtime | Node script, no downloads, no network |
| Telemetry | None |
| Detection | 57 source rules + DESIGN.md token drift |
| Agents | Plugin manifests for Claude Code, Codex, and Cursor; `npx skills` for the rest |
| Proof | Built-in blind A/B protocol and scorecard |
| Content honesty | Named rules against invented proof and placeholder people |

## Repository layout

| Path | What it is |
|---|---|
| `skills/antiwebslop/SKILL.md` | The skill (the only copy): surface types, source-of-truth order, work loop, pre-done checklist |
| `skills/antiwebslop/references/` | Loaded on demand: anti-patterns, craft, examples, dials, DESIGN.md contract, image-to-code, visual QA, a11y audit, decision log, sources |
| `skills/antiwebslop/templates/DESIGN.template.md` | A project's `DESIGN.md` starting point, with product truth and `design-tokens` |
| `skills/antiwebslop/scripts/` | `slop-lint.mjs`, `cursor-hook.mjs`, `install-cursor-hook.mjs` |
| `.claude-plugin/` | Claude Code plugin and marketplace manifests (the repo root is the plugin) |
| `.cursor-plugin/` | Cursor plugin and marketplace manifests |
| `plugin.json`, `.agents/plugins/marketplace.json` | Portable Agent Plugins manifest (Codex, Cursor) and the Codex marketplace entry |
| `tools/pack-skill.mjs` | Builds `dist/antiwebslop.zip` for claude.ai upload (no dependencies) |
| `assets/` | Cover, icon, and Open Graph image |
| [`site/`](site/DESIGN.md) | The project site (Next.js, its own package). Built with this skill; catalog, lint output and trade-offs are read from the repo at build time |
| [`eval/`](eval/README.md) | Scorecard, brief template, blind A/B protocol, validation log |
| [`gallery/`](gallery/README.md) | Static before/after pages with findings marked (era 2026-10) |
| `tests/` | Fixtures and `node:test` suites for the lint and the hook |

## Develop

```bash
npm test          # lint, hook, manifest, and zip tests (Node >= 18, no dependencies)
npm run gallery   # rebuild gallery/ from the fixtures
npm run pack      # dist/antiwebslop.zip for claude.ai
```

The site lives in `site/` (Node >= 20.9): `cd site && npm install && npm run dev`. `npm run lint:slop` there checks it against `site/DESIGN.md`. Deploy on Vercel with Root Directory `site`.

Bump `version` in `package.json` and the three `plugin.json` files together (a test checks they match).
Change the skill, run the eval, log the result in `eval/VALIDATION.md`, keep what wins.

## Name

The repo, the skill, and the plugin are all `antiwebslop` (skill folder `skills/antiwebslop/`).
Earlier names: `webdesign-knowledge`, then `webdesign-aislopkiller`. The GitHub repo moved from
`cesaroeduardo/webdesign-aislopkiller` to `cesaroeduardo/antiwebslop`.

## Prior art

- [Taste Skill](https://www.tasteskill.dev/): the Design Read, dials, and bans.
- [Vercel web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines): accessibility and UX audit rules.
- [getdesign.md](https://getdesign.md/): `DESIGN.md` as a reusable brief.
- [image-to-code-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill): reference → extract → implement.
- [Playwright CLI](https://playwright.dev/agent-cli/introduction): multi-viewport screenshots.

## License

[MIT](LICENSE) © 2026 Eduardo de Cesaro
