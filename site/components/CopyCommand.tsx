'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
  command: string;
  /** What the command does, for the button's accessible name. */
  label: string;
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

export function CopyCommand({ command, label }: Props) {
  const t = useTranslations('copy');
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
  const tip = copied ? t('copied') : t('button');

  return (
    <div className="flex w-full max-w-[640px] items-stretch gap-2 rounded-card border border-border bg-surface py-2 pl-4 pr-2">
      <code className="min-w-0 flex-1 self-center whitespace-pre-wrap py-1 font-mono text-cap text-fg [overflow-wrap:anywhere] sm:text-sm">
        <span aria-hidden className="select-none text-muted">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? t('ariaCopied', { label }) : t('aria', { label })}
        className="group/copy relative inline-flex size-9 shrink-0 items-center justify-center self-center rounded-control border border-border bg-surface-2 text-fg transition-[background-color,border-color,opacity] duration-150 hover:border-border-strong hover:opacity-90 active:opacity-80"
      >
        <Icon aria-hidden size={16} strokeWidth={2} />
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-control border border-border bg-surface-2 px-2 py-1 font-mono text-cap text-fg opacity-0 shadow-none transition-opacity duration-150 group-hover/copy:opacity-100 group-focus-visible/copy:opacity-100"
        >
          {tip}
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">{copied ? t('status', { label }) : ''}</span>
    </div>
  );
}
