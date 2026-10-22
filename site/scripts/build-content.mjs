#!/usr/bin/env node
// slop-lint-disable-file  (reads the slop catalog and fixtures on purpose)
//
// Builds content/generated.json from the repo itself, so the site never drifts from the skill:
// the anti-pattern catalog, real slop-lint output on the fixtures, the hook's real reply, rule
// and catalog counts, and the README trade-offs table. Also copies brand assets into public/ and app/.
// When the rest of the repo is not present (e.g. a deploy that only has site/), it keeps the
// committed files and exits 0.
// Usage: node scripts/build-content.mjs [--check]   (--check: exit 1 if the committed JSON is stale)

import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(site, '..');
const skill = join(repo, 'skills/antiwebslop');
const OUT = join(site, 'content/generated.json');

export async function buildContent() {
  const lint = await import(pathToFileURL(join(skill, 'scripts/slop-lint.mjs')).href);
  const hook = await import(pathToFileURL(join(skill, 'scripts/cursor-hook.mjs')).href);
  const read = (p) => readFileSync(join(repo, p), 'utf8');

  // Anti-pattern catalog: "## Group" → "### N. Title (`lint: id`, sev; `lint: id2`, sev)" → Detect / Do instead.
  const md = read('skills/antiwebslop/references/anti-patterns.md');
  const groups = [];
  let g = null, item = null;
  // Normalize CRLF so `$`-anchored heading regexes match on Windows checkouts.
  for (const line of md.split(/\r?\n/)) {
    let m;
    if ((m = line.match(/^## (.+)$/))) { g = { title: m[1].trim(), items: [] }; groups.push(g); item = null; continue; }
    if ((m = line.match(/^### (\d+)\. (.+?)\s*(?:\((.+)\))?\s*$/)) && g) {
      const lints = [...(m[3] || '').matchAll(/`lint: ([a-z0-9-]+)`,?\s*([a-z|]+)?/g)].map((x) => ({ id: x[1], severity: x[2] || 'info' }));
      const review = !m[3] ? null : /design review/.test(m[3]) ? 'design review' : null;
      item = { n: Number(m[1]), title: m[2].replace(/`/g, ''), lints, review, detect: '', instead: '' };
      g.items.push(item);
      continue;
    }
    if (item && (m = line.match(/^- \*\*Detect:\*\*\s*(.+)$/))) item.detect = m[1].trim();
    if (item && (m = line.match(/^- \*\*Do instead:\*\*\s*(.+)$/))) item.instead = m[1].trim();
  }
  // Real lint output on the two slop fixtures (no source snippets, the way --quiet prints them).
  const fmt = (file, hits) => hits.filter((h) => h.severity !== 'info')
    .map((h) => ({ loc: `${file}:${h.line}`, severity: h.severity, rule: h.rule, msg: h.msg }));
  const lintRun = (rel) => lint.lintText(read(`tests/fixtures/${rel}`));
  const aHits = lintRun('slop/landing.html'), bHits = lintRun('slop/v2-landing.html');
  const cleanTokens = lint.parseDesignTokens(read('tests/fixtures/clean/DESIGN.md'));
  const cleanHits = lint.lintText(read('tests/fixtures/clean/landing.html'), { tokens: cleanTokens });
  const tally = (hits) => ({ errors: hits.filter((h) => h.severity === 'error').length, warnings: hits.filter((h) => h.severity === 'warn').length, info: hits.filter((h) => h.severity === 'info').length });

  // The hook's real reply for a write of the first fixture (copied out of fixtures/, which the hook skips).
  const tmp = mkdtempSync(join(tmpdir(), 'aws-site-'));
  mkdirSync(join(tmp, 'src'));
  writeFileSync(join(tmp, 'src/landing.html'), read('tests/fixtures/slop/landing.html'));
  const reply = hook.runHook({ hook_event_name: 'postToolUse', tool_name: 'Write', tool_input: { file_path: 'src/landing.html' }, workspace_roots: [tmp] }, {});
  rmSync(tmp, { recursive: true, force: true });

  // README trade-offs table and prior-art list.
  const readme = read('README.md');
  const cmpBlock = readme.split('## Trade-offs')[1].split('\n## ')[0];
  const rows = cmpBlock.split('\n').filter((l) => /^\| [^-|]/.test(l) && !/^\| \|/.test(l))
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
  const priorBlock = readme.split('## Prior art')[1].split('\n## ')[0];
  const prior = priorBlock.split(/\n- /).map((b) => b.replace(/^\s*-\s*/, '').replace(/\s+/g, ' ').trim()).filter(Boolean)
    .map((b) => b.match(/^\[([^\]]+)\]\(([^)]+)\)(?: by ([^(:]+?))?(?: \(([^)]+)\))?: (.+)$/)).filter(Boolean)
    .map((m) => ({ name: m[1], url: m[2], by: m[3]?.trim() || null, license: m[4] || null, note: m[5] }));
  const pkg = JSON.parse(read('package.json'));
  return {
    version: pkg.version,
    ruleCount: lint.RULES.length,
    catalogCount: groups.reduce((n, x) => n + x.items.length, 0),
    catalog: groups,
    lintSamples: {
      a: { file: 'landing.html', ...tally(aHits), lines: fmt('landing.html', aHits) },
      b: { file: 'v2-landing.html', ...tally(bHits), lines: fmt('v2-landing.html', bHits) },
      clean: { file: 'clean/landing.html', ...tally(cleanHits) },
    },
    hookReply: reply.additional_context || '',
    comparison: rows,
    priorArt: prior,
  };
}

const ASSETS = [
  ['assets/og.png', 'public/og.png'],
  ['assets/cover.png', 'public/cover.png'],
  ['assets/icon.png', 'app/icon.png'],
];

if (process.argv[1] && process.argv[1].endsWith('build-content.mjs')) {
  const check = process.argv.includes('--check');
  if (!existsSync(join(skill, 'SKILL.md'))) {
    console.log('build-content: repo sources not found; keeping committed content/generated.json');
    process.exit(0);
  }
  const json = JSON.stringify(await buildContent(), null, 2) + '\n';
  if (check) {
    const same = existsSync(OUT) && readFileSync(OUT, 'utf8') === json;
    const assetsSame = ASSETS.every(([a, b]) => existsSync(join(site, b)) && readFileSync(join(repo, a)).equals(readFileSync(join(site, b))));
    console.log(same && assetsSame ? 'build-content: up to date' : 'build-content: STALE (run npm run content in site/)');
    process.exit(same && assetsSame ? 0 : 1);
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, json);
  for (const [a, b] of ASSETS) { mkdirSync(dirname(join(site, b)), { recursive: true }); copyFileSync(join(repo, a), join(site, b)); }
  console.log(`build-content: wrote content/generated.json and ${ASSETS.length} assets`);
}
