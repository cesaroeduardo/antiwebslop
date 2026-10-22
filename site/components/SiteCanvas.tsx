'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CanvasSite } from '@/lib/canvas-sites';

/*
 * Infinite canvas, after the second section of useplanes.com: cards on a wide surface that pans
 * with mouse drag, touch drag (horizontal; vertical touch stays page scroll), horizontal wheel or
 * shift + wheel. Each card wraps around on its own (position modulo the tile), so the surface has
 * no edge. A slow drift runs while idle, never under prefers-reduced-motion.
 * A press that moves less than DRAG_PX opens the lightbox (native <dialog>: Esc, backdrop and the
 * close button close it; focus returns to the card). The lightbox can copy the screenshot (as PNG) and a
 * reference prompt for an image-to-code chat; results are announced in a polite live region.
 */

type CopyState = { kind: 'image' | 'prompt'; ok: boolean } | null;

/** Browsers only take image/png on the clipboard: decode the webp and re-encode it through a canvas. */
async function pngBlob(src: string): Promise<Blob> {
  const res = await fetch(src);
  if (!res.ok) throw new Error(String(res.status));
  const bitmap = await createImageBitmap(await res.blob());
  const c = document.createElement('canvas');
  c.width = bitmap.width;
  c.height = bitmap.height;
  c.getContext('2d')!.drawImage(bitmap, 0, 0);
  return new Promise((ok, fail) => c.toBlob((b) => (b ? ok(b) : fail(new Error('toBlob'))), 'image/png'));
}

const CW = 360; // card width, canvas px
const CH = 268; // card height incl. caption
const COL = 392; // column pitch
const ROW = 320; // row pitch
const COLS = 7;
const ROWS = 4; // two copies of the 14 sites; the second is decorative (aria-hidden)
const TW = COLS * COL;
const TH = ROWS * ROW;
const DRAG_PX = 6;
const DRIFT = 0.25; // canvas px per frame while idle

const mod = (n: number, m: number) => ((n % m) + m) % m;

type Slot = { site: CanvasSite; cx: number; cy: number; copy: boolean };

function layout(sites: CanvasSite[]): Slot[] {
  const n = sites.length;
  const slots: Slot[] = [];
  for (let k = 0; k < COLS * ROWS; k++) {
    const col = k % COLS;
    const row = Math.floor(k / COLS);
    const copy = k >= n;
    // the copy starts 3 sites later so a site never sits right below itself
    const site = sites[copy ? (k + 3) % n : k];
    slots.push({ site, cx: col * COL, cy: row * ROW + (col % 2 ? ROW / 2 : 0), copy });
  }
  return slots;
}

const X0 = -120;
const Y0 = -60;
const place = (s: Slot, x: number, y: number) =>
  `translate3d(${mod(s.cx + x + CW, TW) - CW}px, ${mod(s.cy + y + CH, TH) - CH}px, 0)`;

export function SiteCanvas({ sites }: { sites: CanvasSite[] }) {
  const t = useTranslations('references');
  const slots = useRef(layout(sites)).current;
  const viewport = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const pos = useRef({ x: X0, y: Y0, vx: 0, vy: 0 });
  const scale = useRef(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const moved = useRef(0);
  const [open, setOpen] = useState<CanvasSite | null>(null);
  // copied: the short label swap inside the button (~1.5s); imageFailed keeps the Open the image fallback until close.
  const [copied, setCopiedState] = useState<CopyState>(null);
  const [announce, setAnnounce] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const flashTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(flashTimer.current), []);
  const setCopied = (state: CopyState) => {
    setCopiedState(state);
    window.clearTimeout(flashTimer.current);
    if (!state) return;
    setAnnounce(state.ok ? (state.kind === 'image' ? t('copiedImage') : t('copiedPrompt')) : t('copyFailed'));
    if (state.kind === 'image' && !state.ok) setImageFailed(true);
    flashTimer.current = window.setTimeout(() => setCopiedState(null), 1500);
  };

  const paint = useCallback(() => {
    const { x, y } = pos.current;
    slots.forEach((s, i) => {
      const el = cards.current[i];
      if (el) el.style.transform = place(s, x, y);
    });
  }, [slots]);

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const p = pos.current;
    let raf = 0;
    let visible = false;
    let hover = false;
    let dragging = false;
    let pointer: { id: number; x: number; y: number; t: number } | null = null;

    const readScale = () => {
      const s = parseFloat(getComputedStyle(vp).getPropertyValue('--s')) || 1;
      // very wide screens: grow the cards so the tile still covers the width
      scale.current = Math.max(s, vp.clientWidth / (TW - CW));
      vp.style.setProperty('--k', String(scale.current));
    };
    readScale();

    const loop = () => {
      raf = 0;
      if (!dragging) {
        const coasting = Math.abs(p.vx) > 0.05 || Math.abs(p.vy) > 0.05;
        if (coasting) {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.94; p.vy *= 0.94;
        } else {
          p.vx = 0; p.vy = 0;
          const focusInside = vp.contains(document.activeElement);
          if (!reduce.matches && !hover && !focusInside && !document.hidden) p.x -= DRIFT;
        }
      }
      paint();
      if (visible) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(loop); };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
    io.observe(vp);

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() };
      moved.current = 0;
      p.vx = 0; p.vy = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!pointer || e.pointerId !== pointer.id) return;
      const dx = (e.clientX - pointer.x) / scale.current;
      const dy = (e.clientY - pointer.y) / scale.current;
      moved.current += Math.hypot(dx, dy) * scale.current;
      if (!dragging && moved.current > DRAG_PX) {
        dragging = true;
        vp.setPointerCapture(e.pointerId);
        vp.dataset.dragging = '';
      }
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - pointer.t) / 16.7;
      p.x += dx; p.y += e.pointerType === 'touch' ? 0 : dy;
      p.vx = dx / dt; p.vy = e.pointerType === 'touch' ? 0 : dy / dt;
      pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, t: now };
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!pointer || e.pointerId !== pointer.id) return;
      if (performance.now() - pointer.t > 80) { p.vx = 0; p.vy = 0; }
      pointer = null;
      dragging = false;
      delete vp.dataset.dragging;
      if (reduce.matches) { p.vx = 0; p.vy = 0; }
      kick();
    };
    const onWheel = (e: WheelEvent) => {
      // horizontal intent only; vertical wheel keeps scrolling the page
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      if (Math.abs(dx) <= Math.abs(e.shiftKey ? 0 : e.deltaY)) return;
      e.preventDefault();
      e.stopPropagation();
      p.x -= dx / scale.current;
      p.vx = 0;
      kick();
    };
    const onEnter = () => { hover = true; };
    const onLeave = () => { hover = false; };
    const onResize = () => { readScale(); kick(); };
    // focus can scroll an overflow-hidden box; the canvas moves by transform only
    const onScroll = () => { vp.scrollLeft = 0; vp.scrollTop = 0; };
    vp.addEventListener('scroll', onScroll);

    vp.addEventListener('pointerdown', onDown);
    vp.addEventListener('pointermove', onMove);
    vp.addEventListener('pointerup', onUp);
    vp.addEventListener('pointercancel', onUp);
    vp.addEventListener('wheel', onWheel, { passive: false });
    vp.addEventListener('pointerenter', onEnter);
    vp.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      vp.removeEventListener('pointerdown', onDown);
      vp.removeEventListener('pointermove', onMove);
      vp.removeEventListener('pointerup', onUp);
      vp.removeEventListener('pointercancel', onUp);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('pointerenter', onEnter);
      vp.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      vp.removeEventListener('scroll', onScroll);
    };
  }, [paint]);

  // Keyboard: focusing a card brings it to the middle of the canvas.
  const onFocusCard = (s: Slot, el: HTMLElement) => {
    const vp = viewport.current;
    if (!vp || !el.matches(':focus-visible')) return; // mouse presses focus too; only keyboard focus recenters
    const k = scale.current;
    const p = pos.current;
    p.vx = 0; p.vy = 0;
    vp.scrollLeft = 0; vp.scrollTop = 0;
    p.x = (vp.clientWidth / k - CW) / 2 - s.cx;
    p.y = (vp.clientHeight / k - CH) / 2 - s.cy;
    paint();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = 160;
    const d: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const v = d[e.key];
    if (!v) return;
    e.preventDefault();
    pos.current.x += v[0];
    pos.current.y += v[1];
    paint();
  };

  const show = (site: CanvasSite, e: React.MouseEvent<HTMLButtonElement>) => {
    const keyboard = e.detail === 0;
    if (!keyboard && moved.current > DRAG_PX) return; // that press was a drag
    const el = e.currentTarget;
    opener.current = el;
    setOpen(site);
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.querySelector<HTMLButtonElement>('[data-close]')?.focus();
      document.documentElement.style.overflow = 'hidden';
    }
  }, [open]);

  const close = () => dialog.current?.close();

  const use = (site: CanvasSite) => t(`use.${site.slug}` as 'use.augen');
  const copyImage = async (site: CanvasSite) => {
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('unsupported');
      // The item takes a promise so Safari still counts the click as the user gesture.
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob(`/canvas/${site.slug}.webp`) })]);
      setCopied({ kind: 'image', ok: true });
    } catch {
      setCopied({ kind: 'image', ok: false });
    }
  };
  const copyPrompt = async (site: CanvasSite) => {
    const text = t('prompt', { name: site.name, host: site.url.replace('https://', ''), use: use(site) });
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ kind: 'prompt', ok: true });
    } catch {
      setCopied({ kind: 'prompt', ok: false });
    }
  };
  const onClosed = () => {
    document.documentElement.style.overflow = '';
    setOpen(null);
    setCopied(null);
    setAnnounce('');
    setImageFailed(false);
    opener.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <div
        ref={viewport}
        onKeyDown={onKey}
        role="region"
        aria-label={t('region')}
        className="canvas-viewport relative h-[64svh] max-h-[560px] min-h-[420px] w-full cursor-grab touch-pan-y select-none overflow-hidden overscroll-x-contain border-y border-border data-[dragging]:cursor-grabbing md:h-[88vh] md:max-h-[960px] md:min-h-[640px] [--s:0.62] md:[--s:1]"
      >
        <div className="absolute left-0 top-0 origin-top-left" style={{ transform: 'scale(var(--k, var(--s)))' }}>
          {slots.map((s, i) => (
            <button
              key={i}
              ref={(el) => { cards.current[i] = el; }}
              type="button"
              tabIndex={s.copy ? -1 : 0}
              aria-hidden={s.copy || undefined}
              aria-label={s.copy ? undefined : t('card', { name: s.site.name, gallery: s.site.gallery })}
              onClick={(e) => show(s.site, e)}
              onFocus={(e) => onFocusCard(s, e.currentTarget)}
              className="group absolute left-0 top-0 block rounded-card border border-border bg-surface p-2 text-left transition-colors duration-150 will-change-transform hover:border-border-strong"
              style={{ width: CW, transform: place(s, X0, Y0) }}
            >
              <span className="relative block overflow-hidden bg-bg" style={{ aspectRatio: '16 / 10' }}>
                <Image
                  src={`/canvas/${s.site.slug}-thumb.webp`}
                  alt=""
                  fill
                  sizes="360px"
                  draggable={false}
                  className="pointer-events-none object-cover object-top"
                />
              </span>
              <span className="flex items-baseline justify-between gap-3 px-1 pb-1 pt-3 font-mono text-cap">
                <span className="truncate text-fg">{s.site.name}</span>
                <span className="shrink-0 text-muted">{s.site.gallery}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialog}
        data-lenis-prevent
        onClose={onClosed}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        aria-label={open ? t('dialog', { name: open.name }) : t('dialogEmpty')}
        className="lightbox m-auto w-[min(92vw,1280px)] max-w-none overflow-visible bg-transparent p-0 text-fg backdrop:bg-bg/90"
      >
        {open ? (
          <figure className="relative rounded-card border border-border bg-surface p-2 sm:p-3">
            <div className="flex flex-col gap-3 px-1 pb-3 pt-1 md:flex-row md:items-center md:justify-between md:gap-4">
              <figcaption className="min-w-0 pr-10 font-mono text-sm md:pr-0">
                <a href={open.url} target="_blank" rel="noopener noreferrer" className="group/site inline-flex items-center gap-1 text-fg underline decoration-transparent underline-offset-[0.2em] transition-colors duration-150 hover:text-accent hover:decoration-accent focus-visible:text-accent focus-visible:decoration-accent">
                  {open.name}
                  <ArrowUpRight aria-hidden size={14} className="opacity-0 transition-opacity duration-150 group-hover/site:opacity-100 group-focus-visible/site:opacity-100" />
                  <span className="sr-only">{t('newTab')}</span>
                </a>
                <span className="text-muted"> {t('foundOn')} <a className="link" href={open.galleryUrl}>{open.gallery}</a></span>
              </figcaption>
              <div className="flex shrink-0 flex-wrap items-center gap-1 md:justify-end">
                {(['image', 'prompt'] as const).map((kind) => {
                  const state = copied?.kind === kind ? copied : null;
                  const Icon = state?.ok ? Check : Copy;
                  return (
                    <button key={kind} type="button" onClick={() => (kind === 'image' ? copyImage(open) : copyPrompt(open))} className="inline-flex items-center gap-1.5 rounded-control border border-border px-2 py-1.5 font-mono text-sm text-fg transition-colors duration-150 hover:border-border-strong hover:bg-surface-2">
                      <Icon aria-hidden size={14} /> {state ? (state.ok ? t('copied') : t('copyFailedShort')) : kind === 'image' ? t('copyImage') : t('copyPrompt')}
                    </button>
                  );
                })}
                {imageFailed ? (
                  <a className="link px-1 font-mono text-cap text-muted" href={`/canvas/${open.slug}.webp`} target="_blank" rel="noopener noreferrer">{t('openImage')}</a>
                ) : null}
                <button type="button" data-close onClick={close} aria-label={t('close')} className="absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-control text-fg transition-colors duration-150 hover:bg-surface-2 md:static">
                  <X aria-hidden size={18} />
                </button>
              </div>
            </div>
            <p role="status" aria-live="polite" className="sr-only">{announce}</p>
            <div className="relative overflow-hidden bg-bg" style={{ aspectRatio: '16 / 10' }}>
              <Image
                src={`/canvas/${open.slug}.webp`}
                alt={t('alt', { name: open.name, host: open.url.replace('https://', '') })}
                fill
                sizes="(min-width: 1400px) 1280px, 92vw"
                className="object-cover object-top"
              />
            </div>
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
