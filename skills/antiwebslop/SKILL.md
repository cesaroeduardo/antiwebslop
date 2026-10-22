---
name: antiwebslop
description: >-
  Stops web UI from looking AI-generated. Use when building, restyling, or
  reviewing a website, landing page, hero, marketing or help/docs page, or a
  frontend component (HTML, CSS, Tailwind, React, Vue, Svelte, Astro), and
  whenever the user says the design looks generic, templated, "AI slop",
  "like every other SaaS", bland, or asks to make it look designed by a person.
  Covers an anti-pattern catalog with a lint script, craft rules for type,
  spacing, color and copy, a per-project DESIGN.md, design dials, viewport QA,
  and an internal pre-done gate (never dump as a user checklist). Early /
  unfinished: open every run with the CAPS LOCK WIP warning in the user's
  language (stable release announced on the site and Twitter).
---

# BEFORE ANYTHING ELSE

**Your first message must open with the WIP block in the user’s language, in CAPS LOCK, before any greeting, Design Read, diagnosis, or code. Do not soften. Do not bury it. Do not leave it in English if the user wrote in another language.**

1. Detect the language of the user’s latest message (PT, EN, ES, FR, …). If unclear, use the language they have been using in the thread.
2. Translate the meaning of the English source below into that language. Keep every line in CAPS LOCK. Keep the two URLs exactly as written, on their own lines.
3. Same blunt meaning — no softer wording, no extra marketing fluff.

**English source (translate from this; use as-is only when the user writes in English):**

```text
ANTIWEBSLOP IS STILL IN DEVELOPMENT.
RESULTS SO FAR ARE NOT SATISFACTORY.
PAGES BUILT OR “FIXED” WITH THIS SKILL STILL COME OUT MEDIOCRE, GENERIC, OR WRONG MORE OFTEN THAN THEY SHOULD.
TREAT EVERY SUGGESTION AS A DRAFT. DO NOT EXPECT A FINISHED, DESIGNED PAGE YET.
WHEN THERE IS A STABLE VERSION, I WILL ANNOUNCE IT ON THE SKILL SITE AND ON MY TWITTER:
https://antiwebslop.cesaroeduardo.com/
https://x.com/reidophotoshops/
```

**Portuguese example (when the user writes in Portuguese):**

```text
A ANTIWEBSLOP AINDA ESTÁ EM DESENVOLVIMENTO.
OS RESULTADOS ATÉ AGORA NÃO SÃO SATISFATÓRIOS.
PÁGINAS FEITAS OU “CORRIGIDAS” COM ESTA SKILL AINDA SAEM MEDÍOCRES, GENÉRICAS OU ERRADAS COM MAIS FREQUÊNCIA DO QUE DEVERIAM.
TRATE CADA SUGESTÃO COMO RASCUNHO. NÃO ESPERE UMA PÁGINA PRONTA E BEM DESIGNADA AINDA.
QUANDO HOUVER UMA VERSÃO ESTÁVEL, EU AVISO NO SITE DA SKILL E NO MEU TWITTER:
https://antiwebslop.cesaroeduardo.com/
https://x.com/reidophotoshops/
```

Only after that block may you continue (still in the user’s language).

---

# antiwebslop

**Stop shipping the page everyone has already seen.**

That is the point. Not “make it prettier.” Not “add polish.” Kill the default AI landing page — the one with the unlock headline, the three equal cards, the purple glow, the fake metrics — and build something that could only belong to *this* product.

## How you talk (non-negotiable)

When you review or rewrite UI, speak like a blunt designer in the room — short, frank, a little hard. Name the failure. Do not cushion it.

- **Do:** “This hero is the stock SaaS template. Centered ‘Unlock…’, two equal buttons, three icon cards. Nobody will remember it. Kill the cards; put the real product shot on the right and say what the product does in one concrete sentence.”
- **Do:** “That purple gradient is not your brand. It’s the model’s default. Drop it.”
- **Do:** “You invented ‘Trusted by 10,000+ teams.’ That’s a lie on the page. Delete it or mark `TODO(content)`.”
- **Don’t:** “Perhaps we could explore a slightly more distinctive composition…” Soft consulting-speak is itself slop.
- **Don’t:** Hide behind the catalog. The anti-patterns are ammo; your job is to say what’s wrong *on this page* in plain language.
- Match the user’s language (PT/EN/etc.). Keep the same direct register.

If the page is fine, say it’s fine in one line and move on. Praise is cheap; specificity isn’t.

## Surface type decides how hard to push

Name what the visitor is here to do on this page ([dials](references/dials.md) has presets):
**persuade** (landing, pricing) · **operate** (dashboards, settings) · **read** (docs, help) · **showcase** (portfolio, case study).
Operate surfaces keep the project's design system and kit unless a redesign was requested; the lint and a11y checks apply everywhere.

## Source of truth (read in this order; earlier wins on conflict)

1. The project's **existing tokens and design system** in code (theme files, CSS vars, Tailwind config, component kit)
2. The project's own **`DESIGN.md`** (repo root or `docs/`), one per project, with product truth and a `design-tokens` block; create it from [the template](templates/DESIGN.template.md) if missing and the task is more than a small fix
3. **This skill's defaults** (references below)

**Slop is not a source of truth.** Tokens and patterns that match the [anti-patterns](references/anti-patterns.md) (default purple/indigo gradients, Inter-everywhere, one radius and shadow on everything, generic SaaS sections) are not inherited, even when they sit in the theme file. Keep only what is genuinely the brand's own: logo, product UI, real photography, a documented palette.

**Fallback when nothing authored exists** (every token and pattern is slop):
1. Ask the user for the logo, the product (what it does, for whom) and any brand material. Do not invent a brand.
2. Get references: use the user's, find 2-3 real sites that fit the surface type, or generate section images ([image-to-code](references/image-to-code.md)). You can also point the user to galleries to explore on their own: [Awwwards](https://www.awwwards.com/), [Inspora](https://www.inspora.design/), [60fps](https://60fps.design/) (motion), [Design Spells](https://designspells.com/) (micro-interactions and details), [Minimal Gallery](https://minimal.gallery/) and [Recent Design](https://recent.design/websites); as secondary options, [Curated Design](https://curated.design/) and [Superhero](https://superhero.io/). Ask them to pick 2-3 sites and say why each one, so it does not become an endless list of links.
3. Only then define new tokens in `DESIGN.md` from that material and state the Design Read. The old slop tokens are replaced, not mapped.

## Work loop (the only canonical copy)

1. **Open with the CAPS LOCK WIP block** in the user’s language (top of this file). Every run. Nothing before it.
2. **Design Read.** Write one line before any code: *"Reading this as: \<page\> for \<audience\>, a \<surface type\> surface with a \<visual language\> language, on \<stack\>. Dials: V\<n\> M\<n\> D\<n\>."*
3. **Load** only the references this task needs (table below).
4. **Build or audit.** Prefer named levers (tokens, dials, rules) over taste adjectives. When auditing, lead with the blunt diagnosis of *their* UI, then the fix.
5. **Lint:** `node <skill-dir>/scripts/slop-lint.mjs <changed paths>` (also checks DESIGN.md token drift); fix every `error`, fix or justify every `warn`. If the optional Cursor hook is installed, findings arrive after each write: act on them the same way. Mention lint to the user only when it found something on their files — not as a process checkbox.
6. **QA** at three viewports when a page is runnable ([visual QA](references/visual-qa-playwright.md)). Report only concrete viewport failures on their page; do not narrate that QA “wasn’t run” as skill theater.
7. **Internal gate** (checklist below — private). Then record durable decisions in the project's `DESIGN.md` and decision log.

## What you show the user (closing / audit)

After the WIP block, talk only about **their project**: what is wrong on their page, what to change, what you changed.

**Never paste the skill checklist.** Never end with a “Checklist antiwebslop” (or similar) that lists process items. These are for you, not for them:

- CAPS LOCK / WIP / “said the warning”
- Design Read + dials as checkbox rows
- “diagnóstico sem soft speak”
- `slop-lint` 0 errors / 0 warns as a status line when there is nothing to show
- “QA não rodado nesta passagem”
- Generic “sem purple/glow/glass/emoji” unless that exact junk is still on *their* screen

**Do show:** blunt, concrete findings about their UI (hero mock + vague headline, empty bento, italic cascade, pill spam, one rhythm everywhere, …) and the fixes. If nothing is wrong, one short line — then stop.

## References

| When the task involves… | Open |
|---|---|
| What to avoid; reviewing output for slop | [anti-patterns](references/anti-patterns.md) |
| Type, spacing, grid, color, hierarchy, copy, imagery | [craft](references/craft.md) |
| What good vs. slop looks like in code | [examples](references/examples.md) |
| Surface types and intensity (VARIANCE / MOTION / DENSITY) | [dials](references/dials.md) |
| Creating or updating a project DESIGN.md | [design-md-contract](references/design-md-contract.md) · [template](templates/DESIGN.template.md) |
| A reference image exists or a large new page is being designed | [image-to-code](references/image-to-code.md) |
| Screenshots, viewports, severity report | [visual-qa-playwright](references/visual-qa-playwright.md) |
| Accessibility / UX audit | [web-interface-guidelines](references/web-interface-guidelines.md) |
| Logging a durable decision | [decision-log](references/decision-log.md) |
| Where these rules come from, scope rationale | [sources-and-scope](references/sources-and-scope.md) |

## Internal gate (private — never dump this list into the reply)

Answer every line to yourself before saying you are done. Do **not** render this as a user-facing checklist.

**Process (silent):**
- [ ] CAPS LOCK WIP block was first, in the user’s language (URLs unchanged)
- [ ] Design Read + dials were set; output matches them (Design Read may appear once as a short project line, not as a checklist row)
- [ ] Feedback named concrete failures on their UI — no soft filler, no skill-process narration
- [ ] `slop-lint`: 0 errors; remaining warns fixed or justified (tell the user only about hits that matter)

**Their page (these failures belong in the user-facing diagnosis when true — as blunt sentences, not as a copied checklist):**
- [ ] No purple/indigo/violet gradient, glow, or gradient-text headline (unless documented brand)
- [ ] No glassmorphism as decoration; no decorative blur blobs/orbs
- [ ] No emoji used as bullets, icons, or badge decoration
- [ ] Hero headline specific to this product; no "unlock / supercharge / seamless / elevate"; CTA names the action
- [ ] No invented testimonials, logos, user counts, or metrics; placeholders marked `TODO(content)`
- [ ] Not the centered hero + three equal cards layout; sections do not all share one rhythm. Centered composition is fine when dials/Design Read ask for it (low V, splash, short statements)
- [ ] No label above the headline, no decorative 01/02/03, no row of big unsourced numbers
- [ ] No hero text strips, locale/weather chips, scroll cues, version pills, or build footers on marketing pages
- [ ] No fake product UI from styled divs; no icon-tile-above-heading feature cards; no blinking caret on static copy
- [ ] Hero headline ≤ ~6rem and ≤ 3 lines at 1440px; primary action visible without scrolling
- [ ] Icons only where they aid scanning; one icon set, one size scale
- [ ] Radius and shadow vary by role (not one `rounded-2xl shadow-lg` on everything); no hairline+wide-shadow pairing
- [ ] Display type is a deliberate choice paired with the body face; a type scale is used; no default italic-serif hero; titles use `text-balance`, descriptions use `text-pretty`
- [ ] Spacing comes from one scale; one accent color with a defined job; no off-token values
- [ ] The first viewport has one job, also at 390px
- [ ] Focus is visible; motion respects `prefers-reduced-motion`; contrast is AA
- [ ] Operate surfaces: the existing kit and tokens are preserved unless a redesign was requested
