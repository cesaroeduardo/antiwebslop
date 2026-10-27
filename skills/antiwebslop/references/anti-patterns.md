# Anti-pattern catalog

Each entry: **Detect** (how to spot it in code or a screenshot), **Do instead**.
`lint:` gives the matching `slop-lint` rule id, if one exists. `error` = ship-blocker,
`warn` = fix or justify in one line, `info` = look at it.

When you tell the user about a hit, do not recite the catalog title. Say what’s wrong on
*their* page in plain language — same blunt register as the skill (“Stop shipping the page
everyone has already seen”). The rows below are evidence, not a script.

An anti-pattern is allowed only when the project's tokens or `DESIGN.md` document
it as the brand (e.g. a real purple brand color). Write that reason down; never assume it.

## Color and surface

### 1. Purple/indigo/violet gradient and "AI glow" (`lint: purple-gradient`, error)
- **Detect:** `from-purple-*`, `via-violet-*`, `to-indigo-*`, `linear-gradient(...)` with #6366f1 / #8b5cf6 / #7c3aed / #a855f7, colored `box-shadow` halos around buttons or cards.
- **Do instead:** Start from the brand's own color. Use flat fills; if a gradient is earned, keep it to two close stops of the same hue, used once.

### 2. Gradient-text headlines (`lint: gradient-text`, error)
- **Detect:** `bg-clip-text text-transparent`, `-webkit-background-clip: text`.
- **Do instead:** Solid ink color. Get emphasis from weight, size, or one highlighted word in the accent.

### 3. Glassmorphism as decoration (`lint: glassmorphism`, warn)
- **Detect:** `backdrop-blur*`, `backdrop-filter: blur()` on cards, navbars, and badges all at once; translucent white borders everywhere.
- **Do instead:** Opaque surfaces separated by value (lighter or darker step) or a 1px hairline. Use blur only where content really scrolls under something (a sticky nav over imagery).

### 4. Decorative blur blobs and orbs (`lint: blur-blob`, warn)
- **Detect:** absolutely positioned `rounded-full blur-3xl` divs, `filter: blur(80px)` circles behind the hero.
- **Do instead:** Real imagery, product UI, a typographic composition, or plain space.

### 5. Cream + terracotta "AI editorial" (`lint: cream-terracotta`, error)
- **Detect:** background #F4F1EA / #F5F0E8 / #FAF7F2 with #C2410C / #D97757 / #CC785C accents and a generic serif display face.
- **Do instead:** Derive warmth from the brand if it has any. If you want an editorial feel, commit to a specific typeface and grid, not the stock palette.

### 6. Neon-on-black dark mode
- **Detect:** #000 canvas with saturated cyan/magenta/lime glows and glowing borders.
- **Do instead:** An off-black canvas (#0E0F11 to #16171A), 2–3 surface steps, one accent at reduced chroma, `color-scheme: dark`.

## Layout and composition

### 7. Centered hero + three equal feature cards (`lint: three-col-grid`, info)
- **Detect:** centered H1/sub/two buttons, then `grid-cols-3` of icon + title + two lines, repeated down the page.
- **Do instead:** Pick a composition from the content: left-aligned headline with product visual, split layout, a single strong statement with proof underneath, a feature list with unequal emphasis (one lead feature, smaller secondary ones).

### 8. Centered everything (`lint: centered-everything`, info)
- **Detect:** `text-center` (or equivalent) applied as a default across most sections, especially long body paragraphs, with no Design Read or dial reason — the lazy “everything centered” template.
- **Do instead:** Treat alignment as a composition choice, not a habit. Left-align body copy when the page is reading-heavy or VARIANCE is mid/high. **Centered layouts are fine** when they are intentional: low VARIANCE (V1–3: symmetric / single column — see [dials](dials.md)), short statements and CTAs, quotes, splash / invite / manifesto pages, or when `DESIGN.md` / the Design Read calls for a centered composition. Flag the default, not every centered page.

### 9. Same rhythm for every section
- **Detect:** every section = small label + H2 + gray subtitle + grid. Same padding, same width.
- **Do instead:** Vary density and width by section job (proof = dense, story = narrow and airy, pricing = tabular). See [craft § rhythm](craft.md#spacing-and-rhythm).

### 10. Cards inside cards; card stacks for everything
- **Detect:** bordered/shadowed containers nested 2+ deep; every piece of content boxed.
- **Do instead:** Group with space and alignment first, then a divider, then a card only if the thing is a separate, clickable object.

### 11. Default bento grid
- **Detect:** a 2×3 or 3×3 mosaic of rounded tiles with icons and one-line claims, used because it is fashionable.
- **Do instead:** Use a bento only when the tiles show real, different content (screenshots, data, quotes) of meaningfully different sizes.

### 12. Hero overlays and stickers
- **Detect:** floating badges ("✨ New", "🚀 v2.0"), detached labels, rotated stickers, avatars stacked with "Join 10k+".
- **Do instead:** Put announcements in the nav or under the primary action as a plain text link. Nothing sits above the headline (see 24).

## Typography

### 13. Inter/Roboto/Arial as the only display face (`lint: default-font`, info)
- **Detect:** one family for everything, all headings `font-bold` at roughly the same sizes.
- **Do instead:** Choose a display face with character that fits the Design Read and pair it with a readable text face (see [craft § typography](craft.md#typography)). Inter is fine for body and UI text.

### 14. No type scale
- **Detect:** arbitrary sizes (`text-[37px]`, 15 different sizes), headings that barely differ from body in size or optical weight (same weight, near-same size).
- **Do instead:** A ratio-based scale with 6–8 steps; headline at least 2.5× body on desktop.

### 62. Crushed display tracking (`lint: crushed-tracking`, warn)
- **Detect:** `tracking-tighter`, `tracking-[-0.05em]` (or tighter), or `letter-spacing` ≤ −0.05em on display type — glyphs colliding because “modern” means crushed.
- **Do instead:** Slight negative tracking on large sizes only (−0.01 to −0.03em); never tighter than −0.04em (see [craft § typography](craft.md#typography)).

### 63. Wide tracking on body (`lint: wide-body-tracking`, warn)
- **Detect:** `tracking-wide` / `wider` / `widest` or `letter-spacing` ≥ ~0.05em on body-sized paragraphs.
- **Do instead:** Default tracking for body. Reserve wide tracking for short labels and eyebrows.

### 64. Weightless display headline (`lint: weightless-display`, warn)
- **Detect:** `font-thin` / `extralight` / `light` or `font-weight: 100–300` at display size (`text-4xl` and up).
- **Do instead:** Medium or semibold for display. A real light cut is fine when the brand loads that face on purpose — not as the default “airy” hero.

### 65. Mono as body copy (`lint: mono-body`, warn)
- **Detect:** `font-mono` / `font-family: …monospace` on paragraphs or body-sized prose (not `code` / `pre` / tiny labels).
- **Do instead:** Mono for data, labels, and code. Body copy stays in the text face (see [craft § typography](craft.md#typography)).

### 66. Body measure too wide (design review)
- **Detect:** continuous body copy past ~75 characters per line with no `max-w-prose` / `max-width: …ch`.
- **Do instead:** Cap measure at 60–75 characters (`max-width: 65ch`).

### 67. Widow lines (`lint: missing-wrap`, info)
- **Detect:** a multi-line title or description with a single word alone on the last line; or a display `h1`–`h3` / lead paragraph without wrap utilities when the file has no global `text-wrap` rule.
- **Do instead:** Titles: `text-balance` / `text-wrap: balance`. Descriptions: `text-pretty` / `text-wrap: pretty`. Confirm at 1440 and 390 in visual QA.

## Components and decoration

### 15. Uniform radius + shadow on everything (`lint: uniform-radius-shadow`, warn)
- **Detect:** the same `rounded-2xl shadow-lg` (or `rounded-xl shadow-md`) on cards, buttons, inputs, images.
- **Do instead:** A radius scale by role (controls small, containers medium, media square or large) and elevation only for things that float (menus, dialogs).

### 16. Icon soup (`lint: icon-soup`, warn)
- **Detect:** a lucide/heroicons icon in every card, bullet, button, and heading; many icons imported in one file.
- **Do instead:** Icons only where they speed up recognition (nav, controls, status). Feature lists can use numbers, typography, or real screenshots.

### 17. Emoji as bullets, icons, or badges (`lint: emoji-decoration`, error)
- **Detect:** emoji at the start of list items, headings, buttons, or badges (🚀 ✨ ⚡ 🔥 ✅).
- **Do instead:** Real list markers, an icon from the project set, or nothing.

### 18. `transition: all` and unguarded motion (`lint: transition-all`, error; `lint: motion-no-reduce`, warn)
- **Detect:** `transition-all`, `transition: all`; keyframes or `animate-*` with no `prefers-reduced-motion` / `motion-safe:` / `motion-reduce:`.
- **Do instead:** Transition named properties (`opacity, transform`), 150–300ms, and guard non-essential motion.

### 19. Removed focus outline (`lint: outline-none`, warn)
- **Detect:** `outline-none` / `outline: none` without a `focus-visible` replacement.
- **Do instead:** `focus-visible:` ring in the accent color, offset 2px.

## Copy and content

### 20. Generic hero and marketing copy (`lint: slop-copy`, error)
- **Detect:** "Unlock the power of", "Supercharge", "Seamless", "Elevate your", "Revolutionize", "Next-level", "Cutting-edge", "Harness", "Empower", "Effortless", "In today's fast-paced world", "Built for the future", "lorem ipsum".
- **Do instead:** Say what the product does, for whom, with a concrete noun and number: *"Track every Pokémon Unite match you play, with per-hero win rates."*

### 21. Generic CTAs (`lint: generic-cta`, warn)
- **Detect:** "Get Started", "Learn More", "View more", "Sign Up Now", "Try it free" as the only CTA text; the same link or button label under every card in a grid (six "View more" links weigh the whole block).
- **Do instead:** Name the action and object: "Open the build wheel", "Import my matches". In lists, use one section-level action, an icon-only control with a tooltip, or reveal the control on row hover — do not repeat the same CTA label on every card.

### 22. Fake social proof and metrics (`lint: fake-proof`, warn; `lint: placeholder-name`, warn)
- **Detect:** "Trusted by 10,000+ teams", "10x faster", "99.9% uptime", testimonials from "Jane Doe, CEO at Acme", logo walls of companies that are not customers.
- **Do instead:** Use only real, sourced proof. If none exists, leave the section out, or mark it `TODO(content): real testimonial` so it cannot ship by accident.

### 23. Stock filler content
- **Detect:** placeholder paragraphs that could describe any product; stock photos of people pointing at laptops; three-word feature titles ("Fast. Secure. Reliable.").
- **Do instead:** Use the project's real content: actual screenshots, data, names, prices, changelog items. Ask for content when it is missing rather than inventing it.

## Newer tells

### 24. Eyebrow / kicker above a heading (`lint: eyebrow-kicker`, warn)
- **Detect:** a tiny uppercase, letter-spaced or pill-shaped label ("INTRODUCING", "Features", "New") on the line right before an H1–H3.
- **Do instead:** Delete it, or put its useful words into the heading. If the page needs wayfinding, use breadcrumbs or the nav.

### 25. Decorative section numbers (`lint: section-number`, warn)
- **Detect:** "01 — Discover", "02", "03" labels on sections that are not steps.
- **Do instead:** Number only things the reader must do or read in order (setup steps, a process). Otherwise the heading is enough.

### 26. Hero-metric row (`lint: hero-metric`, warn)
- **Detect:** three or more huge numbers with tiny captions ("99%", "2.4M", "150+"), usually right under the hero.
- **Do instead:** Use a number only when it is real, sourced, and explains the product; give it a sentence of context. One meaningful number beats a row of vague ones.

### 27. Colored side-tab borders (`lint: side-tab-border`, warn)
- **Detect:** `border-left: 4px solid <color>` or `border-l-4 border-<color>` on ordinary cards, list items, or quotes.
- **Do instead:** Keep side stripes for real status (an error or warning callout). Elsewhere separate with space or a full 1px hairline.

### 28. Bounce, elastic, or overshoot easing (`lint: bounce-easing`, warn)
- **Detect:** `animate-bounce`, `easeOutBack`/`elastic`, `cubic-bezier()` with a y value below 0 or above 1.
- **Do instead:** A short ease-out that settles once. Playful springs only where the brand is explicitly playful, and never on routine UI like dialogs.

### 29. Endless attention loops (`lint: attention-loop`, warn)
- **Detect:** a small `rounded-full` dot with `animate-ping`/`animate-pulse`, `<marquee>`, logo tickers that scroll forever.
- **Do instead:** Static status stays static; animate only a real change. Logo rows sit still and can be scanned at the reader's pace.

### 30. Hard offset shadows (`lint: hard-offset-shadow`, warn)
- **Detect:** `box-shadow: 6px 6px 0 #000`, `shadow-[4px_4px_0_...]` on a site that is not neobrutalist anywhere else.
- **Do instead:** Elevation from soft, offset shadows on floating UI only, or no shadow at all. Use the hard block shadow only if the whole visual language is built on it.

### 31. Gray text on colored surfaces (`lint: gray-on-color`, warn)
- **Detect:** `bg-indigo-600 text-gray-400`, or neutral gray copy on any saturated panel.
- **Do instead:** Use a light ink, or a tint of the surface's own hue for secondary text, and check contrast against the real background.

### 32. Em-dash overuse (`lint: em-dash-overuse`, warn)
- **Detect:** em dashes on four or more lines of one file's visible copy ("Fast — reliable — secure").
- **Do instead:** Most dashes want to be a full stop. Keep a dash only where an aside really interrupts the sentence.

### 33. "Not X. A Y." slogan contrast (`lint: not-x-a-y`, warn)
- **Detect:** "Not just another dashboard. A command center.", "It's not a tool. It's a platform."
- **Do instead:** Say what it does in one plain sentence. If the difference from alternatives matters, name the alternative and the concrete difference.

### 34. Oversized hero headline (design review)
- **Detect:** the headline alone fills the first viewport; more than 3 lines at 1440px or more than 5 at 390px; the CTA falls below the fold.
- **Do instead:** Shorten the headline first, then cap the size (see [craft § typography](craft.md#typography)).

### 35. Off-system values (`lint: token-font`, `token-color`, `token-radius`, warn)
- **Detect:** fonts, hex colors, or radii in code that are not in the project's DESIGN.md `design-tokens` block.
- **Do instead:** Use a documented token. If the new value is intentional, add it to DESIGN.md first (and log why), then use it.

### 36. Trailing-period wordmark (`lint: period-logo`, warn)
- **Detect:** a brand or logo lockup that ends with a decorative period ("Acme.", "Linear.", "`<CYBER./>`"). Common in Claude/ChatGPT-invented marks.
- **Do instead:** Drop the trailing dot. Periods belong in sentences, not in the name of the product.

### 37. Hero decoration text strips (`lint: hero-text-strip`, warn)
- **Detect:** mono or all-caps strips along the hero edge naming abstract nouns joined by dots or slashes ("BRAND. MOTION. SPATIAL.", "TYPE / FORM / MOTION").
- **Do instead:** Leave the hero edge empty, or put one concrete product fact there. Atmosphere words are not a composition.

### 38. Locale / time / weather strips (`lint: locale-weather`, warn)
- **Detect:** atmospheric chips like "Lisbon 14:23 · 18°C", "NYC · Clear · 72°F", or a live clock + city that is not the product.
- **Do instead:** Drop it. Local time and weather belong only when the product is about place, travel, or weather.

### 39. Scroll cues (`lint: scroll-cue`, warn)
- **Detect:** "Scroll", "Scroll to explore", "Scroll down", bouncing chevrons or mouse icons that tell the visitor to scroll.
- **Do instead:** Delete them. The page already scrolls; the next section should make that obvious by content, not by a prompt.

### 40. Marketing version footers (`lint: version-footer`, warn)
- **Detect:** `v1.4.2`, `Build 0048`, `last sync 4s ago`, or similar build/devtool fixtures on a landing or portfolio page.
- **Do instead:** Keep version strings in changelogs, docs, or the product UI. Marketing pages do not need a build stamp.

### 41. Hero version labels (`lint: hero-version`, warn)
- **Detect:** `BETA`, `V0.6`, `INVITE-ONLY`, `EARLY ACCESS` pills in the hero when the brief is not a launch announcement.
- **Do instead:** Put release status in the nav or a changelog link. The hero sells the product, not the build channel.

### 42. Fake product UI mockups (design review)
- **Detect:** terminals, task lists, dashboards, or chat panes built from styled `div`s that do not show the real product.
- **Do instead:** Use a real screenshot, a cropped product UI, or leave the slot empty. Invented chrome reads as placeholder.

### 43. Icon tile above a heading (`lint: icon-tile`, warn)
- **Detect:** a large icon in a rounded square stacked above a feature heading (the standard "icon box + title + blurb" card).
- **Do instead:** Put a small icon beside the heading, use a number, or drop the icon and lead with the title. The tile should not outrank the words.

### 44. Italic serif display headline (`lint: italic-serif-display`, warn)
- **Detect:** an oversized italic serif (or `font-serif italic` at display size) used as the default "editorial" hero look.
- **Do instead:** Pick a display face that fits this product. Italics for emphasis inside a sentence, not as the whole brand voice by default.

### 45. Decorative blinking cursor (`lint: blink-cursor`, warn)
- **Detect:** a blinking caret or block cursor on static copy, fake terminals, or headlines that are not editable.
- **Do instead:** Keep a caret only where the user can type. Static text does not need to look like a prompt.

### 46. Decorative grid-line background (`lint: grid-bg`, warn)
- **Detect:** a full-bleed line grid or graph paper behind a marketing section that is not a canvas, map, or editor.
- **Do instead:** Plain surface, real imagery, or space. Grids belong to tools that measure or align.

### 47. Soft spotlight behind content (`lint: soft-spotlight`, warn)
- **Detect:** a faint radial glow or soft spotlight behind a card or section used only to "add depth".
- **Do instead:** Hierarchy from size, weight, and spacing. Glow when light is part of the brand language, not as default emphasis.

### 48. Hairline border with wide shadow (`lint: hairline-wide-shadow`, warn)
- **Detect:** a 1px border and a large soft shadow defining the same card at once.
- **Do instead:** Pick one edge treatment: a hairline *or* elevation. Two outlines make the surface muddy.

### 49. Extreme border-radius on cards (`lint: extreme-radius`, warn)
- **Detect:** small cards with huge radii (`rounded-3xl`, `rounded-[2rem+]`) that squeeze the content into a soft blob.
- **Do instead:** Match radius to size: controls small, cards medium. Large radii are for pills and media, not every tile.

### 50. Redundant copy in one container (design review)
- **Detect:** the same idea repeated as label, placeholder, helper, and button text inside one field or card.
- **Do instead:** Say it once, in the strongest slot. Extra lines that restate the same thing slow reading without helping.

### 51. Double borders on every list row (`lint: row-double-border`, warn)
- **Detect:** `border-t` plus `border-b` (or top and bottom hairlines) on every row of a long list or spec table.
- **Do instead:** One divider between rows, or a different component (cards, tabs, a compact table). Stacked double rules add noise.

### 52. Photo-credit captions as decoration
- **Detect:** invented studio captions under stock images ("Field study no. 12 · Ines Caetano") used as atmosphere.
- **Do instead:** Credit only real photographers and real shoots. If there is no credit, leave the caption out.

### 53. Mid-page theme flip (design review)
- **Detect:** a light page that drops into a full dark band (or the reverse) mid-scroll with no brand reason.
- **Do instead:** Pick light, dark, or system once for the page. A single contrasting band is fine for a real CTA or media break, not as a default section skin.

### 54. Repeating-gradient stripes (`lint: stripe-fill`, warn)
- **Detect:** `repeating-linear-gradient` stripes filling empty space as decoration.
- **Do instead:** A plain fill, or a texture that belongs to the brand. Stripes as wallpaper are visual noise.

### 55. All-caps body text (`lint: all-caps-body`, warn)
- **Detect:** paragraphs or long blocks set in `uppercase` / `text-transform: uppercase`.
- **Do instead:** Sentence case for body copy. Reserve all-caps for short labels and headings.

### 56. Jagged image masks (`lint: jagged-mask`, warn)
- **Detect:** CSS `clip-path` polygons that fake a torn or organic photo edge.
- **Do instead:** A clean crop, or a prepared cut-out asset. Procedural jagged masks look unfinished.

### 57. Images buried under overlays (design review)
- **Detect:** a near-opaque gradient or scrim that hides the image underneath until it might as well be a flat color.
- **Do instead:** Lighten or remove the overlay until the image contributes, or drop the image and use a solid surface.

### 58. Justified body text (`lint: justified-body`, warn)
- **Detect:** `text-align: justify` / `text-justify` on body paragraphs.
- **Do instead:** Start-aligned text. Justification on the web leaves uneven word gaps, especially on narrow screens.

### 59. One-word italic serif (`lint: italic-serif-word`, warn)
- **Detect:** one word (or a short phrase) inside a sans-serif headline set in italic serif — e.g. `Build <span class="font-serif italic">better</span> products` — as a stock “editorial accent”.
- **Do instead:** Keep the headline in one family. Emphasize with weight, color, or size. A mixed serif accent is earned only when the brand already pairs those faces on purpose.

### 60. Decorative dotted or faded grid (`lint: faded-dot-grid`, warn)
- **Detect:** a dotted or checkered background (often `radial-gradient` dots or a fine square grid) that fades out at the edges via `mask-image` / a soft radial wash — atmosphere behind a hero or section that is not a real canvas.
- **Do instead:** Plain surface, real imagery, or space. If a grid is needed for a tool UI, keep it sharp and full-bleed in the workspace, without a vignette fade.

### 61. Component-library monoculture (`lint: kit-monoculture`, warn)
- **Detect:** the same kit combo stamped everywhere — `Card` + `Badge` + `Button` + `Separator` + `Dialog` (or their shadcn/Radix cousins) — even when plain text, a list, or a single action would do.
- **Do instead:** Reach for the lightest structure that fits the job. Cards and dialogs earn their keep when the content is a separate, interactive object; otherwise use spacing, typography, and a link.

### 68. Generic AI hero assets (design review)
- **Detect:** the hero's footage, render or cut-out is stock generative material that could front any brand: neon rings around classical statues, chrome surrealism, NFT-style or mascot characters, rotating mandalas, vaporwave AI landscapes, glowing translucent flowers, an isolated object floating in a glass or chrome void, a silhouette walking toward a glowing portal. The technique around it (video hero, parallax, cut-out, crossfade) can be fine; the footage is the tell. Lint can't tell this from real footage, so check the rendered hero.
- **Do instead:** Show the real thing: the product, the people who make or use it, the place it happens. With none of those to hand, ship a type-only hero and ask for real media; don't fill the slot with atmosphere.
