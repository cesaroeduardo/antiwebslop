#!/usr/bin/env node
// slop-lint-disable-file  (installer; no UI)
//
// Add (or remove) the slop-lint Cursor hook in a project's .cursor/hooks.json.
// Usage: node install-cursor-hook.mjs [--project DIR] [--uninstall] [--dry-run]
// Merges with existing hooks and is idempotent; other hooks are left untouched.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOK_SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'cursor-hook.mjs');
const isOurs = (h) => typeof h?.command === 'string' && /cursor-hook\.mjs/.test(h.command);

export function install(project, { uninstall = false, dryRun = false } = {}) {
  const file = join(project, '.cursor', 'hooks.json');
  let cfg = { version: 1, hooks: {} };
  if (existsSync(file)) cfg = JSON.parse(readFileSync(file, 'utf8'));
  cfg.version ??= 1;
  cfg.hooks ??= {};
  const list = (cfg.hooks.postToolUse ??= []);
  const rel = relative(project, HOOK_SCRIPT);
  const scriptPath = !rel.startsWith('..') && !isAbsolute(rel) ? rel.split('\\').join('/') : HOOK_SCRIPT;
  const entry = { command: `node ${JSON.stringify(scriptPath)}`, matcher: 'Write', timeout: 10 };
  const kept = list.filter((h) => !isOurs(h));
  let action;
  if (uninstall) {
    action = kept.length === list.length ? 'not installed' : 'removed';
    cfg.hooks.postToolUse = kept;
    if (!kept.length) delete cfg.hooks.postToolUse;
  } else {
    action = list.some(isOurs) ? 'updated' : 'installed';
    cfg.hooks.postToolUse = [...kept, entry];
  }
  if (!dryRun) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n'); }
  return { file, action, config: cfg };
}

if (process.argv[1] && process.argv[1].endsWith('install-cursor-hook.mjs')) {
  const argv = process.argv.slice(2);
  const i = argv.indexOf('--project');
  const project = resolve(i >= 0 ? argv[i + 1] : process.cwd());
  const r = install(project, { uninstall: argv.includes('--uninstall'), dryRun: argv.includes('--dry-run') });
  console.log(`slop-lint hook ${r.action}${argv.includes('--dry-run') ? ' (dry run)' : ''}: ${r.file}`);
  if (argv.includes('--dry-run')) console.log(JSON.stringify(r.config, null, 2));
}
