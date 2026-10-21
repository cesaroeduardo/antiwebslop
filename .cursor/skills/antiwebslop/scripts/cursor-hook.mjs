#!/usr/bin/env node
// slop-lint-disable-file  (hook glue; no UI)
//
// Cursor `postToolUse` hook (matcher "Write"): after the agent writes a UI file, run slop-lint on
// it and hand the findings back to the agent as `additional_context`. Advisory only: it never
// blocks a write and always exits 0, so a crash can't stop the agent (fail-open).
// Install with install-cursor-hook.mjs. Disable for a session with SLOP_LINT_HOOK=off.

import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve, relative, extname } from 'node:path';
import { lintText, parseDesignTokens, findDesignMd } from './slop-lint.mjs';

const UI_EXT = new Set(['html', 'htm', 'css', 'scss', 'sass', 'less', 'js', 'jsx', 'mjs', 'ts', 'tsx', 'vue', 'svelte', 'astro', 'mdx']);
const SKIP = /(?:^|[\\/])(?:node_modules|\.git|dist|build|out|\.next|\.nuxt|\.svelte-kit|coverage|vendor|fixtures)(?:[\\/]|$)|\.min\./;
const MAX_LINES = 20;

const done = (obj = {}) => { process.stdout.write(JSON.stringify(obj) + '\n'); process.exit(0); };

function filePaths(payload) {
  const ti = payload.tool_input && typeof payload.tool_input === 'object' ? payload.tool_input : {};
  return [ti.file_path, ti.path, ti.target_file, ti.filePath, ti.filename, payload.file_path].filter((p) => typeof p === 'string' && p);
}

export function runHook(payload, env = process.env) {
  if (String(env.SLOP_LINT_HOOK || '').toLowerCase() === 'off') return {};
  const root = env.CURSOR_PROJECT_DIR || (payload.workspace_roots || [])[0] || payload.cwd || process.cwd();
  const files = [...new Set(filePaths(payload).map((p) => (isAbsolute(p) ? p : resolve(root, p))))]
    .filter((p) => UI_EXT.has(extname(p).slice(1).toLowerCase()) && !SKIP.test(p) && existsSync(p));
  if (!files.length) return {};
  const designPath = findDesignMd(root);
  const tokens = designPath ? parseDesignTokens(readFileSync(designPath, 'utf8')) : null;
  const out = [];
  let errors = 0, warns = 0;
  for (const f of files) {
    const hits = lintText(readFileSync(f, 'utf8'), { tokens }).filter((h) => h.severity !== 'info');
    for (const h of hits) {
      if (h.severity === 'error') errors++; else warns++;
      out.push(`${relative(root, f) || f}:${h.line} ${h.severity} ${h.rule}: ${h.msg}`);
    }
  }
  if (!out.length) return {};
  const shown = out.slice(0, MAX_LINES);
  if (out.length > MAX_LINES) shown.push(`… and ${out.length - MAX_LINES} more (run slop-lint on the file for the full list)`);
  return {
    additional_context: [
      `slop-lint (design check) on the file you just wrote: ${errors} error, ${warns} warn.`,
      ...shown,
      'Fix every error. For each warn, fix it or keep it with a one-line reason in a `slop-lint-disable-line` comment.',
    ].join('\n'),
  };
}

if (process.argv[1] && process.argv[1].endsWith('cursor-hook.mjs')) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => { raw += c; });
  process.stdin.on('end', () => {
    try { done(runHook(JSON.parse(raw || '{}'))); } catch { done({}); }
  });
}
