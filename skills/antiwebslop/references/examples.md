# Before / after examples

Short, real-shaped examples. "Before" is what agents produce by default; "after" applies
[anti-patterns](anti-patterns.md) and [craft](craft.md). The products are hypothetical.

## 1. Hero (landing page for a match-history tracker)

**Before:** purple gradient, gradient text, emoji badge, slop copy, generic CTAs, fake proof.

```html
<section class="min-h-screen bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-center">
  <span class="rounded-full bg-white/10 backdrop-blur px-3 py-1">✨ New: AI insights</span>
  <h1 class="text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
    Unlock the power of your gameplay
  </h1>
  <p>Supercharge your skills with seamless, cutting-edge analytics.</p>
  <button class="rounded-2xl shadow-lg transition-all">Get Started</button>
  <button class="rounded-2xl shadow-lg transition-all">Learn More</button>
  <p>Trusted by 10,000+ players</p>
</section>
```

**After:** Design Read: *"Reading this as: a landing page for ranked Pokémon Unite players, a persuade surface with a dense, data-forward language, on Next.js + Tailwind. Dials: V7 M4 D5."*

```html
<section class="grid gap-12 px-6 py-24 lg:grid-cols-12 lg:items-end">
  <div class="lg:col-span-7">
    <h1 class="font-display text-5xl leading-[1.05] tracking-tight lg:text-6xl">
      Every ranked Pokémon Unite match you play, with win rates per hero and per lane.
    </h1>
    <p class="mt-6 max-w-[60ch] text-lg text-muted">
      Paste your trainer ID. We pull your last 200 games from unite-api and show where you actually win.
    </p>
    <div class="mt-8 flex gap-4">
      <a href="/import" class="rounded-md bg-accent px-5 py-3 text-accent-fg transition-colors focus-visible:ring-2">Import my matches</a>
      <a href="/demo" class="px-2 py-3 underline underline-offset-4">See a sample profile</a>
    </div>
  </div>
  <img class="lg:col-span-5 rounded-sm border border-border" src="/shots/profile.png" width="1200" height="900" alt="Win rate by hero table for a sample trainer">
</section>
```

What changed: a specific headline and CTA (no label above it; the product name lives in the headline), a 7/5 asymmetric split matching V7 (a low-V centered hero would also be fine when dials ask for it),
a real product screenshot instead of a gradient, a single accent, no unverifiable proof,
and named transitions.

## 2. Feature section

**Before:** three equal cards with emoji and icon soup.

```jsx
<div className="grid md:grid-cols-3 gap-8 text-center">
  <Card className="rounded-2xl shadow-lg"><Zap />🚀 <h3>Lightning Fast</h3><p>Blazing performance.</p></Card>
  <Card className="rounded-2xl shadow-lg"><Shield />🔒 <h3>Secure</h3><p>Enterprise-grade security.</p></Card>
  <Card className="rounded-2xl shadow-lg"><Sparkles />✨ <h3>AI-Powered</h3><p>Next-level insights.</p></Card>
</div>
```

**After:** one lead feature with a real visual, two secondary features as plain text, no boxes.

```jsx
<section className="grid gap-16 lg:grid-cols-12">
  <div className="lg:col-span-7">
    <h2 className="font-display text-4xl">Spot the hero you should stop picking</h2>
    <p className="mt-4 max-w-[60ch] text-muted">Win rate, average damage and lane, sorted by how much each hero costs you.</p>
    <img src="/shots/hero-table.png" width="1400" height="900" alt="Table of heroes sorted by win rate" className="mt-8 border border-border" />
  </div>
  <dl className="space-y-10 lg:col-span-4 lg:col-start-9 lg:pt-24">
    <div><dt className="font-medium">Updates after every match</dt><dd className="text-muted">Synced from unite-api within a minute of the result screen.</dd></div>
    <div><dt className="font-medium">Exports to CSV</dt><dd className="text-muted">Take your history into a spreadsheet or your coach's tools.</dd></div>
  </dl>
</section>
```

## 3. Testimonial / social proof

**Before:** invented proof.

```html
<blockquote>"This tool 10x'd our productivity!" — Jane Doe, CEO at Acme</blockquote>
```

**After:** real proof, or an explicit gap that cannot ship by accident.

```html
<!-- TODO(content): real quote from a beta user, with permission. Leave the section out until it exists. -->
```

Or real, verifiable usage from the project's own data: `<p>4,312 matches imported this week</p>`, rendered from the API, not hard-coded.
