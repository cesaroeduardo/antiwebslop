#!/usr/bin/env node
// slop-lint-disable-file  (packaging; no UI)
//
// Zip the canonical skill folder for upload to claude.ai (Customize > Skills > Upload a skill)
// or any agent that takes a skill as a .zip. Zero dependencies.
// Usage: node tools/pack-skill.mjs [--out dist/antiwebslop.zip]
// The archive holds one top-level folder, antiwebslop/, with SKILL.md directly inside it.

import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SKILL_DIR = join(ROOT, 'skills', 'antiwebslop');

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
export function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.') || e.name === '.gitkeep')
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
}

// Fixed timestamp (1980-01-01) so the same tree always yields the same bytes.
const DOS_TIME = 0, DOS_DATE = (0 << 9) | (1 << 5) | 1;

export function buildZip(skillDir = SKILL_DIR, prefix = 'antiwebslop') {
  const locals = [], centrals = [];
  let offset = 0;
  for (const file of walk(skillDir)) {
    const name = Buffer.from(`${prefix}/${relative(skillDir, file).split('\\').join('/')}`);
    const data = readFileSync(file);
    const comp = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8); local.writeUInt16LE(DOS_TIME, 10); local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(comp.length, 18); local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26); local.writeUInt16LE(0, 28);
    const mode = (statSync(file).mode & 0o111 ? 0o100755 : 0o100644);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE((3 << 8) | 20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(8, 10); central.writeUInt16LE(DOS_TIME, 12);
    central.writeUInt16LE(DOS_DATE, 14); central.writeUInt32LE(crc, 16); central.writeUInt32LE(comp.length, 20);
    central.writeUInt32LE(data.length, 24); central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE((mode << 16) >>> 0, 38); central.writeUInt32LE(offset, 42);
    locals.push(local, name, comp);
    centrals.push(central, name);
    offset += local.length + name.length + comp.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(centrals.length / 2, 8); end.writeUInt16LE(centrals.length / 2, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

if (process.argv[1] && process.argv[1].endsWith('pack-skill.mjs')) {
  const argv = process.argv.slice(2);
  const i = argv.indexOf('--out');
  const out = resolve(i >= 0 ? argv[i + 1] : join(ROOT, 'dist', 'antiwebslop.zip'));
  mkdirSync(dirname(out), { recursive: true });
  const zip = buildZip();
  writeFileSync(out, zip);
  console.log(`packed ${relative(process.cwd(), out) || out} (${(zip.length / 1024).toFixed(1)} KB)`);
}
