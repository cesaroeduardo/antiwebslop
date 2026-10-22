'use client';

import { useId, useRef, useState, type CSSProperties } from 'react';

/**
 * Cropped footer wordmark after useplanes.com: SVG text as a mask over a
 * vertical fade + grain, melting into a strong blur at the bottom, with a
 * primary spotlight that follows the pointer.
 */
export function FooterMark() {
  const id = useId().replace(/:/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const [spot, setSpot] = useState({ x: 500, y: 160, on: false });

  const toSvg = (clientX: number, clientY: number) => {
    const el = svg.current;
    if (!el) return null;
    const pt = el.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = el.getScreenCTM()?.inverse();
    if (!ctm) return null;
    return pt.matrixTransform(ctm);
  };

  /** Soft cut at the bottom so the word dissolves into the page edge. */
  const meltMask: CSSProperties = {
    maskImage: 'linear-gradient(to bottom, #000 0%, #000 42%, transparent 96%)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 42%, transparent 96%)',
  };

  const mark = (interactive: boolean) => (
    <svg
      ref={interactive ? svg : undefined}
      viewBox="0 0 1000 212"
      className="block w-full text-fg"
      style={{ color: 'var(--color-fg)' }}
      aria-hidden={!interactive || undefined}
    >
      <defs>
        {/* Visible toward the top, transparent at the bottom (the “end”). */}
        <linearGradient id={`${id}-fill${interactive ? '' : '-b'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="0.4" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="0.72" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id={`${id}-spot${interactive ? '' : '-b'}`}
          gradientUnits="userSpaceOnUse"
          cx={spot.x}
          cy={spot.y}
          r="230"
          fx={spot.x}
          fy={spot.y}
        >
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-grain${interactive ? '' : '-b'}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
        </filter>
        <mask id={`${id}-word${interactive ? '' : '-b'}`}>
          <text
            x="500"
            y="200"
            textAnchor="middle"
            textLength="980"
            lengthAdjust="spacingAndGlyphs"
            fill="#fff"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '148px', letterSpacing: '-0.04em' }}
          >
            antiwebslop
          </text>
        </mask>
      </defs>
      <g mask={`url(#${id}-word${interactive ? '' : '-b'})`}>
        <rect width="1000" height="232" fill={`url(#${id}-fill${interactive ? '' : '-b'})`} />
        <rect
          width="1000"
          height="232"
          filter={`url(#${id}-grain${interactive ? '' : '-b'})`}
          style={{ mixBlendMode: 'multiply', opacity: 0.55 }}
        />
        {interactive ? (
          <rect
            width="1000"
            height="232"
            fill={`url(#${id}-spot)`}
            style={{
              opacity: spot.on ? 1 : 0,
              transition: 'opacity 300ms ease-out',
              mixBlendMode: 'screen',
            }}
          />
        ) : null}
      </g>
    </svg>
  );

  return (
    <div
      aria-hidden
      className="relative select-none overflow-hidden"
      onPointerEnter={(e) => {
        const p = toSvg(e.clientX, e.clientY);
        if (p) setSpot({ x: p.x, y: p.y, on: true });
      }}
      onPointerMove={(e) => {
        const p = toSvg(e.clientX, e.clientY);
        if (p) setSpot({ x: p.x, y: p.y, on: true });
      }}
      onPointerLeave={() => setSpot((s) => ({ ...s, on: false }))}
    >
      {/* Soft blur bloom under the letters — strongest at the bottom edge. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[18%] scale-105 blur-2xl sm:blur-3xl"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 45%, #000 100%)',
          opacity: 0.85,
        }}
      >
        {mark(false)}
      </div>
      {/* Sharp layer, fading out toward the bottom. */}
      <div style={meltMask}>{mark(true)}</div>
    </div>
  );
}
