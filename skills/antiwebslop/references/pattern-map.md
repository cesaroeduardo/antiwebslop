# Anti-pattern → premium pattern map

Every [anti-pattern](anti-patterns.md) should end up with at least one correct alternative in
[premium-patterns.md](premium-patterns.md). This table shows where that is true today. Use it to
choose what to look for next: a new reference earns its place by filling a **gap**.

- **covered:** a candidate does the anti-pattern's "Do instead" as its main job.
- **partial:** a candidate helps in one case or one surface only; the note says which.
- **gap:** no candidate replaces it yet. The catalog's own "Do instead" still applies.
- **Fix: repair:** the element carries content (badge, avatars, logos, quotes, numbers, labels,
  product shots). Lint and review still flag it, but the fix makes it true and well made rather
  than deleting it; remove only when no real data exists, and then say so and ask. See
  [repair-not-remove.md](repair-not-remove.md).

A pattern counts only when it fixes the problem, not when its "Slop risk" line merely warns
against it. Candidate numbers refer to "Candidates" in premium-patterns.md; all are still
`candidate`, none `vetted`. Order follows the catalog file.

| # | Anti-pattern | Status | Premium patterns that replace it |
|---|---|---|---|
| 1 | Purple/indigo/violet gradient and "AI glow" | gap | None. Needs brand-derived color systems with flat fills. |
| 2 | Gradient-text headlines | partial | 3 Masked line rise (a solid-ink display moment that gets attention from motion, not a gradient fill); no static emphasis pattern yet |
| 3 | Glassmorphism as decoration | partial | 13 Media edge equals the page (text over media without frosted panels); nothing yet for opaque navs, cards or badges |
| 4 | Decorative blur blobs and orbs | covered | 11 Anchored hero composition, 12 Subject breaking the frame (real media or type carry the hero instead of an orb) |
| 5 | Cream + terracotta "AI editorial" | gap | None. Needs editorial palettes that are not the stock pair. |
| 6 | Neon-on-black dark mode | gap | None. Needs restrained dark themes. |
| 7 | Centered hero + three equal feature cards | covered | 11 Anchored hero composition (hero), 9 List-driven stage (variants instead of equal cards), 6 Sticky stacked cards (a real sequence instead of a grid) |
| 8 | Centered everything | partial | 11 Anchored hero composition (hero only); no section-level alignment pattern |
| 9 | Same rhythm for every section | partial | 4 Scroll-paced statement reveal, 5 Pinned scroll story, 6 Sticky stacked cards give sections different jobs; no pattern for density and width per section |
| 10 | Cards inside cards; card stacks for everything | gap | None. Needs grouping by space, alignment and dividers. |
| 11 | Default bento grid | partial | 9 List-driven stage (real items of different kinds, one at a time); no bento-with-real-content pattern |
| 12 | Hero overlays and stickers | covered | 11 Anchored hero composition (deliberate copy placement, one real secondary link, nothing above the headline) **Fix: repair** ([repair-not-remove](repair-not-remove.md)) |
| 13 | Inter/Roboto/Arial as the only display face | gap | None. Needs display + text face pairings. |
| 14 | No type scale | gap | None. Needs visible type scales. |
| 62 | Crushed display tracking | gap | None. |
| 63 | Wide tracking on body | partial | 14 Metadata label system (wide tracking moved to short labels) |
| 64 | Weightless display headline | gap | None. |
| 65 | Mono as body copy | partial | 14 Metadata label system (mono for real metadata, not prose) |
| 66 | Body measure too wide | gap | None. Needs long-form reading layouts. |
| 67 | Widow lines | gap | None. |
| 15 | Uniform radius + shadow on everything | gap | None. Needs a radius and elevation scale by role. |
| 16 | Icon soup | gap | None. |
| 17 | Emoji as bullets, icons, or badges | gap | None. |
| 18 | `transition: all` and unguarded motion | covered | 1 Ordered hero entrance, 2 Once-only in-view reveal, 10 Rolling label button (named properties, set durations, reduced-motion state) |
| 19 | Removed focus outline | gap | None. 10 only keeps focus parity for its own hover. |
| 20 | Generic hero and marketing copy | gap | None. Needs real copy examples. |
| 21 | Generic CTAs | gap | None. 10 requires an action-naming label but doesn't supply one. |
| 22 | Fake social proof and metrics | gap | None. Needs honest proof sections. **Fix: repair** ([repair-not-remove](repair-not-remove.md)) |
| 23 | Stock filler content | gap | None. |
| 24 | Eyebrow / kicker above a heading | covered | 14 Metadata label system (one label style for real metadata, never above a heading) **Fix: repair** ([repair-not-remove](repair-not-remove.md)) |
| 25 | Decorative section numbers | partial | 6 Sticky stacked cards (numbering earned by a real sequence) |
| 26 | Hero-metric row | gap | None. Needs a single number with context. **Fix: repair** ([repair-not-remove](repair-not-remove.md)) |
| 27 | Colored side-tab borders | gap | None. |
| 28 | Bounce, elastic, or overshoot easing | covered | 1 Ordered hero entrance, 2 Once-only in-view reveal, 10 Rolling label button (ease-out with control points in 0–1) |
| 29 | Endless attention loops | covered | 2 Once-only in-view reveal (motion runs once), 9 List-driven stage (user-driven, no auto-advance) **Fix: repair** ([repair-not-remove](repair-not-remove.md)) |
| 30 | Hard offset shadows | gap | None. |
| 31 | Gray text on colored surfaces | gap | None. |
| 32 | Em-dash overuse | gap | None. |
| 33 | "Not X. A Y." slogan contrast | gap | None. |
| 34 | Oversized hero headline | partial | 11 Anchored hero composition (short-viewport rule keeps the action above the fold); no headline sizing pattern |
| 35 | Off-system values | gap | Process rule (DESIGN.md tokens), not a visual move; no reference can fill it. |
| 36 | Trailing-period wordmark | gap | None. Needs wordmark and nav lockups. |
| 37 | Hero decoration text strips | partial | 11 Anchored hero composition (one concrete fact at the edge), 14 Metadata label system (real metadata only) |
| 38 | Locale / time / weather strips | partial | 14 Metadata label system (real metadata, e.g. the location of real work) |
| 39 | Scroll cues | gap | None. Needs heroes whose next section shows at the fold. |
| 40 | Marketing version footers | gap | None. Needs footers. |
| 41 | Hero version labels | gap | None. **Fix: repair** ([repair-not-remove](repair-not-remove.md)) |
| 42 | Fake product UI mockups | gap | None. 12 frames a physical product cut-out, not UI. Needs real screenshot presentation. **Fix: repair** ([repair-not-remove](repair-not-remove.md)) |
| 43 | Icon tile above a heading | gap | None. Needs feature lists led by type. |
| 44 | Italic serif display headline | gap | None. |
| 45 | Decorative blinking cursor | partial | 3 Masked line rise (the headline entrance that replaces the typewriter caret) |
| 46 | Decorative grid-line background | gap | None. |
| 47 | Soft spotlight behind content | partial | 12 Subject breaking the frame (depth from real layering instead of a glow) |
| 48 | Hairline border with wide shadow | gap | None. |
| 49 | Extreme border-radius on cards | gap | None. |
| 50 | Redundant copy in one container | gap | None. Needs forms and cards that say it once. |
| 51 | Double borders on every list row | gap | None. Needs lists and spec tables. |
| 52 | Photo-credit captions as decoration | partial | 14 Metadata label system (credits only for real shoots) |
| 53 | Mid-page theme flip | gap | None. |
| 54 | Repeating-gradient stripes | gap | None. |
| 55 | All-caps body text | partial | 14 Metadata label system (caps limited to short labels) |
| 56 | Jagged image masks | covered | 12 Subject breaking the frame (a prepared cut-out instead of a procedural edge) |
| 57 | Images buried under overlays | covered | 13 Media edge equals the page (lightest text protection, no scrim) |
| 58 | Justified body text | gap | None. |
| 59 | One-word italic serif | gap | None. Needs headline emphasis by weight, color or size. |
| 60 | Decorative dotted or faded grid | gap | None. |
| 61 | Component-library monoculture | gap | None. |
| 68 | Generic AI hero assets | partial | 11 Anchored hero composition (works as a type-led hero); 8, 12 and 13 are only right with real footage, which no entry supplies |

**Tally (68):** 9 covered, 16 partial, 43 gap. 25 have at least one pattern. #35 is a process
rule and stays a gap by design.

## Biggest gaps: what to hunt for

Motion and hero composition are well covered (MotionSites). Almost everything else is open.

1. **Color and surface:** sites with a brand-derived accent and flat fills (#1, #5), a restrained
   dark theme with off-black and surface steps (#6, #53), secondary text on colored panels (#31),
   opaque navs and cards that separate by value or a hairline (#3, #48).
2. **Typography:** a display face with character paired with a text face (#13, #44), a visible
   type scale (#14, #64, #62), headline emphasis without gradients or a serif accent (#2, #59), and
   long-form reading pages with a real measure and clean rag (#66, #67, #58).
3. **Components and lists:** feature lists led by type instead of icon tiles (#43, #16, #17), a
   radius and elevation scale by role (#15, #49, #30, #27), content grouped by space rather than
   nested cards (#10, #61), lists and spec tables with one divider (#51), forms that say it once
   (#50), visible focus states (#19).
4. **Copy and proof:** real testimonial and customer sections with named people (#22), one
   number with context (#26), specific CTAs and plain headlines (#20, #21, #33, #32), sites built
   on real content instead of filler (#23).
5. **Product presentation:** real screenshots framed or cropped well in place of div mockups
   (#42), and heroes with real footage of the product or people (#68), a bento that shows real,
   different content (#11).
6. **Small brand chrome:** wordmarks and nav lockups (#36), footers without build stamps (#40),
   release status outside the hero (#41), heroes whose next section shows at the fold (#39).
7. **Plain backgrounds:** sections that hold up on a plain surface or a brand texture, with no
   grid, dots or stripes (#46, #54, #60).

## References on file

References in premium-patterns.md's "Reference inbox" that show a move for a gap but are not
mined into candidates yet. They do not change the statuses above; a gap becomes partial or covered
only once a candidate exists.

| Gap | References | The move |
|---|---|---|
| #1, #5 | R1-beacon-home | Flat two-colour brand palette, one saturated accent, no glow |
| #13, #14 | R1-beacon-home, R3-rulebase-home | Serif display over a text face; visible step from display to body |
| #16, #43 | R2-quantinium-home | Feature cards drawn in one line-illustration style instead of icon tiles |
| #21, #22 | R9-mindcloud-home | Prompt box as the primary action; a checkable, linked ranking as proof |
| #23, #68 | R4-arantxa-barcia-home | A real portrait of the actual person as the hero image |
| #39 | R4-arantxa-barcia-home | Hero subject cropped by the fold so the next section is implied |
| #42 | R3-rulebase-home | A real product screen with believable content as the hero stage |
| #42, #68 | R5-metricra-agent-crew, R7-frostbreak-home | A concept illustration or asset that makes the product idea literal |
| #8 | R6-wegonorth-home | Headline split around a central visual |
