'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

type Props = {
  command: string;
  /** What the command does, for the button's accessible name. */
  label: string;
  /** "primary" = the page's one accent button; "row" = compact icon button in a table row. */
  variant?: 'primary' | 'row';
  /** primary only: "inline" puts the command and the button on one line from sm up. */
  layout?: 'stack' | 'inline';
};

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export function CopyCommand({ command, label, variant = 'row', layout = 'stack' }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    if (await writeClipboard(command)) {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const Icon = copied ? Check : Copy;

  if (variant === 'primary') {
    return (
      <div className={layout === 'inline' ? 'flex flex-col gap-3 sm:flex-row sm:items-center' : 'flex flex-col gap-3'}>
        <code className="block whitespace-pre-wrap rounded-card border border-border bg-surface px-4 py-3 text-cap text-fg [overflow-wrap:anywhere] sm:text-sm">
          <span aria-hidden className="select-none text-muted">$ </span>
          {command}
        </code>
        <button
          type="button"
          onClick={onCopy}
          className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-control bg-accent px-4 font-mono text-sm font-medium text-accent-fg transition-[background-color,opacity] duration-150 hover:opacity-90 active:opacity-80 ${layout === 'inline' ? 'sm:self-center' : ''}`}
        >
          <Icon aria-hidden size={16} strokeWidth={2} />
          {copied ? 'Copied to clipboard' : 'Copy the install command'}
        </button>
        <span className="sr-only" role="status" aria-live="polite">{copied ? `${label} copied` : ''}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? `${label} copied` : `Copy: ${label}`}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-control border border-border text-muted transition-[color,border-color,background-color] duration-150 hover:border-border-strong hover:bg-surface-2 hover:text-fg data-[copied=true]:text-accent"
      data-copied={copied}
    >
      <Icon aria-hidden size={16} strokeWidth={2} />
    </button>
  );
}
