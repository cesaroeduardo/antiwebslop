// slop-lint-disable-file  (this test lists rule ids, which look like the patterns)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readdirSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LINT = join(root, 'skills/antiwebslop/scripts/slop-lint.mjs');
const run = (...args) => {
  const r = spawnSync(process.execPath, [LINT, ...args], { cwd: root, encoding: 'utf8' });
  return { code: r.status, out: r.stdout, err: r.stderr };
};
const json = (...args) => { const r = run('--json', ...args); return { code: r.code, ...JSON.parse(r.out) }; };

test('slop fixtures trigger every rule', () => {
  const r = json('tests/fixtures/slop/landing.html', 'tests/fixtures/slop/Features.tsx');
  assert.equal(r.code, 1, 'exits 1 when errors are found');
  const expected = ['purple-gradient', 'gradient-text', 'glassmorphism', 'blur-blob', 'cream-terracotta', 'transition-all',
    'outline-none', 'slop-copy', 'generic-cta', 'fake-proof', 'placeholder-name', 'emoji-decoration', 'default-font',
    'three-col-grid', 'uniform-radius-shadow', 'icon-soup', 'motion-no-reduce', 'centered-everything'];
  for (const id of expected) assert.ok(r.summary.byRule[id] > 0, `rule ${id} should fire`);
  assert.ok(r.summary.errors >= 10);
});

test('v2 rules fire on the v2 slop fixture', () => {
  const r = json('tests/fixtures/slop/v2-landing.html');
  for (const id of ['side-tab-border', 'hard-offset-shadow', 'bounce-easing', 'attention-loop', 'eyebrow-kicker',
    'not-x-a-y', 'section-number', 'em-dash-overuse', 'hero-metric', 'gray-on-color'])
    assert.ok(r.summary.byRule[id] > 0, `rule ${id} should fire`);
});

test('token drift: fonts, colors, radii outside DESIGN.md tokens', () => {
  const r = json('tests/fixtures/tokens', '--design', 'tests/fixtures/tokens/DESIGN.md');
  assert.deepEqual(r.summary.byRule, { 'token-font': 2, 'token-color': 3, 'token-radius': 2 });
  assert.equal(r.summary.design, 'tests/fixtures/tokens/DESIGN.md');
  const lines = r.results.map((h) => `${h.file.split('/').pop()}:${h.line}:${h.rule}`);
  assert.ok(!lines.some((l) => l.startsWith('drift.css:1:') || l.startsWith('drift.css:2:') || l.startsWith('drift.css:3:')), 'documented tokens pass');
  const off = json('tests/fixtures/tokens', '--no-design');
  assert.equal(off.summary.warnings, 0, '--no-design disables drift checks');
});

test('clean fixtures stay clean with their own DESIGN.md tokens', () => {
  const r = json('tests/fixtures/clean', '--design', 'tests/fixtures/clean/DESIGN.md');
  assert.equal(r.summary.errors + r.summary.warnings, 0, JSON.stringify(r.results, null, 2));
});

test('--list-rules prints every rule', () => {
  const r = run('--list-rules');
  assert.equal(r.code, 0);
  assert.match(r.out, /^31 rules$/m);
});

test('clean fixtures produce no errors or warnings', () => {
  const r = json('tests/fixtures/clean');
  assert.equal(r.code, 0);
  assert.equal(r.summary.errors, 0, JSON.stringify(r.results, null, 2));
  assert.equal(r.summary.warnings, 0, JSON.stringify(r.results, null, 2));
});

test('disable comments suppress hits', () => {
  const r = json('tests/fixtures/slop/suppressed.html');
  assert.equal(r.summary.errors + r.summary.warnings, 0, JSON.stringify(r.results, null, 2));
});

test('text output has file:line hits and a summary line', () => {
  const r = run('tests/fixtures/slop/Features.tsx');
  assert.match(r.out, /tests\/fixtures\/slop\/Features\.tsx:\d+ +error +purple-gradient/);
  assert.match(r.out, /slop-lint: \d+ hits \(\d+ error, \d+ warn, \d+ info\) in 1 files/);
});

test('directory walk skips fixtures/ and node_modules/ unless passed explicitly', () => {
  const r = json('tests');
  const own = readdirSync(join(root, 'tests')).filter((f) => f.endsWith('.mjs')).length;
  assert.equal(r.summary.files, own, 'only the test files themselves are scanned');
});

test('--max-warnings and usage errors', () => {
  assert.equal(run('tests/fixtures/clean', '--max-warnings', '0').code, 0);
  assert.equal(run('--nope').code, 2);
  assert.equal(run('does/not/exist').code, 2);
  assert.equal(run('.', '--design', 'nope/DESIGN.md').code, 2);
});

test('the repo itself lints clean (fixtures are skipped on walk)', () => {
  const r = json('.');
  assert.equal(r.code, 0, JSON.stringify(r.results, null, 2));
});
