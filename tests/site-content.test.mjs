// The site in site/ reads the catalog, lint output, hook reply and comparison
// from the repo at build time and commits the result so it also builds alone.
// This test fails when that committed copy drifts from the source files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

test('site/content/generated.json and copied assets match the repo', () => {
  try {
    execFileSync(process.execPath, ['site/scripts/build-content.mjs', '--check'], { cwd: root, stdio: 'pipe' });
  } catch (err) {
    assert.fail(`site content is stale; run "npm run content" in site/.\n${err.stdout}${err.stderr}`);
  }
});

test('site content has every catalog entry with a detect and a fix', () => {
  const data = JSON.parse(readFileSync(new URL('../site/content/generated.json', import.meta.url), 'utf8'));
  const items = data.catalog.flatMap((g) => g.items);
  assert.equal(items.length, data.catalogCount);
  assert.ok(items.every((it) => it.title && it.detect && it.instead));
});
