'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { Inline } from './Inline';

export type CatalogItem = {
  n: number;
  title: string;
  lints: { id: string; severity: string }[];
  review: string | null;
  detect: string;
  instead: string;
};
export type CatalogGroup = { title: string; items: CatalogItem[] };

const sevLabel = (s: string) => (s === 'error|warn' ? 'error or warn' : s);

export function Catalog({ groups }: { groups: CatalogGroup[] }) {
  return (
    <div className="flex flex-col gap-12">
      {groups.map((g) => (
        <div key={g.title} data-reveal>
          <h3 className="mb-3 font-mono text-sm text-muted">{g.title}</h3>
          <Accordion.Root type="multiple" className="flex flex-col gap-2">
            {g.items.map((it) => (
              <Accordion.Item
                key={it.n}
                value={String(it.n)}
                className="rounded-card border border-border bg-surface data-[state=open]:border-border-strong"
              >
                <Accordion.Header asChild>
                  <h4>
                    <Accordion.Trigger className="group flex w-full items-center gap-4 rounded-card px-4 py-3 text-left transition-colors duration-150 hover:bg-surface-2 sm:px-5">
                      <span className="w-7 shrink-0 font-mono text-cap text-muted tabular-nums">{it.n}</span>
                      <span className="min-w-0 flex-1 text-body leading-snug text-fg">{it.title}</span>
                      <span className="hidden shrink-0 font-mono text-cap text-muted md:inline">
                        {it.lints.length ? it.lints.map((l) => l.id).join(' · ') : it.review ?? 'no rule, by eye'}
                      </span>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-[color,border-color,transform] duration-200 group-hover:text-fg group-data-[state=open]:rotate-45 group-data-[state=open]:border-accent group-data-[state=open]:text-accent motion-reduce:transition-none">
                        <Plus aria-hidden size={14} strokeWidth={2} />
                      </span>
                    </Accordion.Trigger>
                  </h4>
                </Accordion.Header>
                <Accordion.Content className="acc-content">
                  <div className="grid gap-4 border-t border-border px-4 pb-5 pt-4 sm:grid-cols-2 sm:gap-8 sm:px-5 sm:pl-16">
                    <div>
                      <p className="mb-1 font-mono text-cap text-muted">Detect</p>
                      <p className="prose-inline text-base text-fg"><Inline text={it.detect} /></p>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-cap text-muted">Do instead</p>
                      <p className="prose-inline text-base text-fg"><Inline text={it.instead} /></p>
                    </div>
                    {it.lints.length > 0 && (
                      <p className="font-mono text-cap text-muted sm:col-span-2">
                        {it.lints.map((l) => `slop-lint ${l.id}: ${sevLabel(l.severity)}`).join('  ·  ')}
                      </p>
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      ))}
    </div>
  );
}
