// slop-lint-disable-file  (test glue)
// One canonical skill folder, consistent manifests, and a valid claude.ai upload zip.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { buildZip, crc32, SKILL_DIR } from '../tools/pack-skill.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const pkg = json('package.json');

function findAll(dir, name, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) findAll(p, name, out); else if (e.name === name) out.push(p);
  }
  return out;
}

test('exactly one SKILL.md, at skills/antiwebslop/, with matching frontmatter name', () => {
  const found = findAll(root, 'SKILL.md').map((p) => p.slice(root.length + 1));
  assert.deepEqual(found, ['skills/antiwebslop/SKILL.md']);
  const fm = readFileSync(join(SKILL_DIR, 'SKILL.md'), 'utf8').match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fm, 'frontmatter');
  assert.match(fm[1], /^name: antiwebslop$/m);
  assert.match(fm[1], /^description: /m);
});

test('every manifest names antiwebslop, shares the package version, and points at real paths', () => {
  const manifests = {
    'plugin.json': json('plugin.json'),
    '.claude-plugin/plugin.json': json('.claude-plugin/plugin.json'),
    '.cursor-plugin/plugin.json': json('.cursor-plugin/plugin.json'),
  };
  for (const [file, m] of Object.entries(manifests)) {
    assert.equal(m.name, 'antiwebslop', file);
    assert.equal(m.version, pkg.version, `${file} version`);
  }
  assert.ok(existsSync(join(root, manifests['.claude-plugin/plugin.json'].icon)));
  assert.ok(existsSync(join(root, manifests['.cursor-plugin/plugin.json'].logo)));
  assert.ok(existsSync(join(root, manifests['.cursor-plugin/plugin.json'].skills, 'antiwebslop/SKILL.md')));
  const ui = manifests['plugin.json'].extensions['com.openai'].interface;
  for (const k of ['composerIcon', 'logo']) assert.ok(existsSync(join(root, ui[k])), k);

  const markets = [
    ['.claude-plugin/marketplace.json', (p) => p.source],
    ['.cursor-plugin/marketplace.json', (p) => p.source],
    ['.agents/plugins/marketplace.json', (p) => p.source.path],
  ];
  for (const [file, src] of markets) {
    const m = json(file);
    assert.equal(m.name, 'antiwebslop', file);
    assert.equal(m.plugins.length, 1, file);
    assert.equal(m.plugins[0].name, 'antiwebslop', file);
    const dir = resolve(root, src(m.plugins[0]));
    assert.equal(dir, resolve(root), `${file} source resolves to repo root`);
    assert.ok(!src(m.plugins[0]).includes('..'), `${file} source has no ..`);
  }
});

test('assets referenced by README exist', () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  for (const [, p] of readme.matchAll(/(?:src|\]\()=?"?\(?\.?\/?(assets\/[\w.-]+)/g)) assert.ok(existsSync(join(root, p)), p);
  assert.match(readme, /assets\/cover\.png/);
});

test('pack-skill builds a zip with one antiwebslop/ folder whose files match the skill exactly', () => {
  const zip = buildZip();
  const eocd = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const count = zip.readUInt16LE(eocd + 10);
  let p = zip.readUInt32LE(eocd + 16);
  const names = [];
  for (let i = 0; i < count; i++) {
    assert.equal(zip.readUInt32LE(p), 0x02014b50);
    const csize = zip.readUInt32LE(p + 20), crc = zip.readUInt32LE(p + 16);
    const nlen = zip.readUInt16LE(p + 28), off = zip.readUInt32LE(p + 42);
    const name = zip.subarray(p + 46, p + 46 + nlen).toString();
    const lnlen = zip.readUInt16LE(off + 26), lxlen = zip.readUInt16LE(off + 28);
    const data = inflateRawSync(zip.subarray(off + 30 + lnlen + lxlen, off + 30 + lnlen + lxlen + csize));
    assert.equal(crc32(data), crc, name);
    assert.ok(name.startsWith('antiwebslop/'), name);
    assert.deepEqual(data, readFileSync(join(SKILL_DIR, name.slice('antiwebslop/'.length))), name);
    names.push(name);
    p += 46 + nlen + zip.readUInt16LE(p + 30) + zip.readUInt16LE(p + 32);
  }
  assert.ok(names.includes('antiwebslop/SKILL.md'));
  const onDisk = (function walk(d) { return readdirSync(d).flatMap((n) => statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [n]); })(SKILL_DIR);
  assert.equal(names.length, onDisk.length);
  assert.deepEqual(buildZip(), zip, 'deterministic');
});
