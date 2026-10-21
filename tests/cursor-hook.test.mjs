// slop-lint-disable-file  (test glue)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPTS = join(root, 'skills/antiwebslop/scripts');
const HOOK = join(SCRIPTS, 'cursor-hook.mjs');
const INSTALL = join(SCRIPTS, 'install-cursor-hook.mjs');

const project = () => { const d = mkdtempSync(join(tmpdir(), 'slophook-')); mkdirSync(join(d, 'src')); return d; };
const hook = (payload, env = {}) => {
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(payload), encoding: 'utf8', env: { ...process.env, ...env } });
  return { code: r.status, out: JSON.parse(r.stdout) };
};
const write = (d, rel) => ({ hook_event_name: 'postToolUse', tool_name: 'Write', tool_input: { file_path: rel }, cwd: d, workspace_roots: [d] });

test('hook returns findings as additional_context for a sloppy UI file', () => {
  const d = project();
  copyFileSync(join(root, 'tests/fixtures/slop/landing.html'), join(d, 'src/index.html'));
  const r = hook(write(d, 'src/index.html'));
  assert.equal(r.code, 0);
  assert.match(r.out.additional_context, /slop-lint \(design check\).*\d+ error/);
  assert.match(r.out.additional_context, /src\/index\.html:\d+ error purple-gradient/);
});

test('hook is silent for clean files, non-UI files, and unparseable input', () => {
  const d = project();
  copyFileSync(join(root, 'tests/fixtures/clean/landing.html'), join(d, 'src/index.html'));
  writeFileSync(join(d, 'src/data.json'), '{"title":"Unlock the power"}');
  assert.deepEqual(hook(write(d, 'src/index.html')).out, {});
  assert.deepEqual(hook(write(d, 'src/data.json')).out, {});
  const bad = spawnSync(process.execPath, [HOOK], { input: 'not json', encoding: 'utf8' });
  assert.equal(bad.status, 0);
  assert.deepEqual(JSON.parse(bad.stdout), {});
});

test('hook applies project DESIGN.md tokens and honors SLOP_LINT_HOOK=off', () => {
  const d = project();
  copyFileSync(join(root, 'tests/fixtures/tokens/DESIGN.md'), join(d, 'DESIGN.md'));
  copyFileSync(join(root, 'tests/fixtures/tokens/drift.css'), join(d, 'src/drift.css'));
  assert.match(hook(write(d, join(d, 'src/drift.css'))).out.additional_context, /token-color/);
  assert.deepEqual(hook(write(d, 'src/drift.css'), { SLOP_LINT_HOOK: 'off' }).out, {});
});

test('installer merges into hooks.json, is idempotent, and uninstalls cleanly', () => {
  const d = project();
  mkdirSync(join(d, '.cursor'));
  const file = join(d, '.cursor/hooks.json');
  writeFileSync(file, JSON.stringify({ version: 1, hooks: { postToolUse: [{ command: 'echo other' }], stop: [{ command: 'x' }] } }));
  const run = (...a) => spawnSync(process.execPath, [INSTALL, '--project', d, ...a], { encoding: 'utf8' });
  assert.match(run().stdout, /installed/);
  assert.match(run().stdout, /updated/);
  let cfg = JSON.parse(readFileSync(file, 'utf8'));
  assert.equal(cfg.hooks.postToolUse.length, 2);
  const ours = cfg.hooks.postToolUse.find((h) => /cursor-hook\.mjs/.test(h.command));
  assert.equal(ours.matcher, 'Write');
  assert.deepEqual(cfg.hooks.stop, [{ command: 'x' }]);
  assert.match(run('--uninstall').stdout, /removed/);
  cfg = JSON.parse(readFileSync(file, 'utf8'));
  assert.deepEqual(cfg.hooks.postToolUse, [{ command: 'echo other' }]);
});

test('installer uses a project-relative command when the skill lives inside the project', () => {
  const r = spawnSync(process.execPath, [INSTALL, '--project', root, '--dry-run'], { encoding: 'utf8' });
  assert.match(r.stdout, /"command": "node \\"skills\/antiwebslop\/scripts\/cursor-hook\.mjs\\""/);
});

test('installer and hook work from an installed copy (.agents/skills/antiwebslop)', () => {
  const d = project();
  const dest = join(d, '.agents/skills/antiwebslop');
  cpSync(join(root, 'skills/antiwebslop'), dest, { recursive: true });
  const r = spawnSync(process.execPath, [join(dest, 'scripts/install-cursor-hook.mjs'), '--project', d], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const cfg = JSON.parse(readFileSync(join(d, '.cursor/hooks.json'), 'utf8'));
  const cmd = cfg.hooks.postToolUse[0].command;
  assert.equal(cmd, 'node ".agents/skills/antiwebslop/scripts/cursor-hook.mjs"');
  writeFileSync(join(d, 'src/page.html'), '<h1 class="bg-gradient-to-r from-purple-500 to-indigo-600">Unlock the power of AI</h1>\n');
  const h = spawnSync(process.execPath, [join(dest, 'scripts/cursor-hook.mjs')], { cwd: d, input: JSON.stringify(write(d, 'src/page.html')), encoding: 'utf8' });
  assert.equal(h.status, 0);
  assert.match(JSON.parse(h.stdout).additional_context || '', /src\/page\.html:1/);
});
