# Premium patterns

The [anti-pattern catalog](anti-patterns.md) says what not to ship. This file is the other half:
patterns worth reaching for. Each one is stated inside this skill's own rules
([craft](craft.md), [dials](dials.md), anti-patterns). Where a source's version breaks one of
those rules, the entry keeps the idea and drops or restates the parameter; if the idea itself
breaks a rule, it goes to "Considered and rejected" below.

Pick **one signature pattern per page plus 2–4 quiet supporting ones**, and never let two compete
for the same viewport. Check every entry's **Slop risk** line before shipping it.

## Vetting

Patterns move through five states. Only an eval run (see the repo's `eval/`) promotes a candidate;
taste debates do not.

1. **saved:** a source is logged in the inbox below, with link, date, license and why it's here.
2. **analyzed:** the source has been read in full; its license and claims are checked.
3. **mined:** its patterns were extracted, checked against anti-patterns and craft, and either
   written up as candidates or listed under "Considered and rejected".
4. **candidate:** an entry exists here, paraphrased (never copied), citing the source file.
5. **vetted:** an eval run used the pattern, the output cleared `slop-lint` and visual QA, and the
   rubric did not score it as slop. Record the run in the entry.

## Entry template

```markdown
### N. Name (candidate | vetted)
- **What:** one or two sentences.
- **Use when:** surface type and dial range (e.g. persuade/showcase, M7+).
- **Build:** stack-agnostic steps with values inside craft and dials; a GSAP/CSS line if useful.
- **Guard:** performance, accessibility, `prefers-reduced-motion` behavior.
- **Slop risk:** the point where it tips into slop, with anti-pattern numbers.
- **Allowed exceptions:** none, or the exact rule it may bend and only when `DESIGN.md` logs why.
- **Source:** source name and file; vetting run if vetted.
```

## Sources (inbox)

### MotionSites skill (Viktor Oddy): `mined`

- Post: [x.com/viktoroddy/status/2114684257109254434](https://x.com/viktoroddy/status/2114684257109254434) (2026-10-26), with a 13 s demo video of 11 sites.
- Repo: [github.com/Motionsites-AI/claude-skill](https://github.com/Motionsites-AI/claude-skill), read at commit `faa30d5`.
- License split: the skill instructions, `references/` and `scripts/` are MIT (© 2026 MotionSites).
  The `examples/` prompts and `media/` assets are © MotionSites: usable to build sites, not to
  redistribute as a collection. This file paraphrases MIT reference material only; it copies no
  example prompt, media URL or code.
- Scale: the post says "700+ designs". The repo holds 40 example prompts, 58 technique recipes and a
  media shelf; the README calls this a free sample of a paid library (500+ prompts).
- What it teaches well: one signature per page, a precise spec before code, real media, and a
  screenshot-and-fix loop. What clashes with this skill: liquid glass, serif-italic accents, gradient
  and shimmer text, springy easing, attention loops, social-proof and stat micro-components, and
  generic AI hero footage (see [anti-pattern 68](anti-patterns.md)).
- Paths below are relative to `plugins/motionsites-web-builder/skills/motionsites-web-builder/`.

## Candidates

### 1. Ordered hero entrance (candidate)
- **What:** The hero arrives in reading order (nav, headline, sub, primary action, then anything secondary), each piece a short rise and fade, so the eye is led instead of hit all at once.
- **Use when:** Persuade or showcase heroes, M5+.
- **Build:** `opacity 0 → 1` plus `translateY` of 16px or less; 300–500ms each with an ease-out curve whose control points stay within 0–1 (e.g. `cubic-bezier(.22,1,.36,1)`); siblings 80–120ms apart; the whole sequence done by about 1.2s so the primary action is usable early. Hero media may settle from `scale(1.03)` to 1 inside the same 500ms. Wait for `document.fonts.ready` so lines don't reflow mid-entrance. GSAP: one `timeline` with `from(..., {opacity:0, y:16, stagger:.1})`.
- **Guard:** The rest state is visible: hide only via `animation-fill-mode: both` or a class added by JS, and force the final state if the animation never starts. After the entrance, clear the transform so hover transforms still work. Reduced motion: final state, no movement.
- **Slop risk:** No label above the headline in the sequence (#24). Applying the same entrance to every section turns a hero move into a page-wide tic; sections use pattern 2.
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/type-and-text-motion.md` §1–2, `references/craft.md` § Motion. Their blur-in and 0.8–1.8s durations are dropped (craft: opacity/transform only, ≤ 500ms).

### 2. Once-only in-view reveal (candidate)
- **What:** Blocks below the fold rise and fade once as they enter the viewport; a small group cascades.
- **Use when:** Sections after the hero, M4+.
- **Build:** `opacity` plus `translateY` of 16px or less, 200–300ms at M4–6 (up to 500ms for a large block at M7+), at most 3 staggered items per group. Trigger with IntersectionObserver around `threshold: .15` and a bottom `rootMargin` of about -10%; for blocks taller than several viewports use `threshold: 0`. GSAP: `ScrollTrigger.batch` with `once: true`.
- **Guard:** Hide targets only when JS has run (a class on `<html>`). Reduced motion: nothing is hidden or moved.
- **Slop risk:** Animating every paragraph, footer and list row makes reading wait on motion. Fade plus scale plus slide on the same card is too much; pick one move.
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/scroll.md` §1. Their 0.7s / 30px default is restated inside the MOTION dial.

### 3. Masked line rise (candidate)
- **What:** Display lines (or words) rise out of a clipped slot, so type looks set rather than faded in.
- **Use when:** One display statement per page, M6+. One headline treatment per page.
- **Build:** Each line in an `overflow: hidden` wrapper; the inner span goes `translateY(110%) → 0`, 400–500ms ease-out, lines 100–140ms apart. Pad the clip box slightly (with an equal negative margin) so descenders are not cut. Keep each word `nowrap`. GSAP: SplitText with line masks, `from(lines, {yPercent:110, stagger:.12})`.
- **Guard:** Without JS the heading is plain text. Give the parent the full string as `aria-label` and hide the split spans from assistive tech. Reduced motion: no rise.
- **Slop risk:** Stacking it with character cascades, scramble or a typewriter. Type must stay within the hero cap (#34) and tracking no tighter than -0.04em (#62).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/type-and-text-motion.md` §4. Their 0.7–1.2s durations are restated to ≤ 500ms.

### 4. Scroll-paced statement reveal (candidate)
- **What:** One short statement in large type goes from a muted ink to full ink word by word as the reader scrolls through it, so reading pace and scroll pace match. Also the mechanism for marking slop words in a sample at scroll pace.
- **Use when:** One block per page, a manifesto line or a statement, never body copy. Persuade or showcase, M7+.
- **Build:** Split into inline word spans. Map the block's scroll progress (top of block at 80% of the viewport to bottom at 20%) onto each word's window around `i / N`, animating `opacity` only. The muted start state must still be readable: large text at 3:1 or more against the background. GSAP: `scrollTrigger: { start: 'top 80%', end: 'bottom 20%', scrub: true }` on a staggered opacity tween.
- **Guard:** Opacity only, so no layout shift. Reduced motion and no-JS: full ink from the start.
- **Slop risk:** More than one block per page, or using it on text people need to read in full. A start state below 3:1 fails contrast while it's on screen.
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/type-and-text-motion.md` §10. Their 15–20% start opacity is replaced by a readable muted ink.

### 5. Pinned scroll story (candidate)
- **What:** One sticky viewport carries a short sequence: real layered photography (background, subject, foreground) moves at different rates as the user scrolls a longer runway, with copy panels entering and leaving on cue.
- **Use when:** Showcase or launch pages with real layered imagery, M8+. The page's one heavy pattern.
- **Build:** A tall runway section with a `position: sticky; top: 0; height: 100vh` stage. Compute scroll progress in pixels, smooth it lightly, and write it to CSS custom properties; CSS maps those to `transform` and `opacity` only. Write the story as a table of scroll ranges before coding. GSAP: `ScrollTrigger` with `pin` and `scrub`.
- **Guard:** Never `overflow: hidden` on a sticky ancestor (use `overflow-x: clip`). Reduced motion: no smoothing, no pointer parallax; the user-driven mapping can stay, or show the end frame. Check 390px: planes must still cover.
- **Slop risk:** Movement without a story table. Using it on a persuade page whose job is a fast decision. The source's depth-of-field blur and tint filters are out (opacity/transform only), and so is any layer made of generic AI assets (#68).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/scroll.md` §2.

### 6. Sticky stacked cards (candidate)
- **What:** 3–5 sequential items (case studies, process steps) pin one after another; each new one slides over the previous, which shrinks slightly with its top edge still showing.
- **Use when:** A real sequence of 3–5 items, showcase or persuade, M6+.
- **Build:** Each item in its own sticky slot, offset by about 28px per index; scale earlier items down by about 3% per step over section progress, `transform-origin: top center`. Radius by role (#49), one edge treatment (#48), no cards inside cards (#10).
- **Guard:** Transform only. Reduced motion: a plain stack.
- **Slop risk:** More than five items, or items that are not a sequence.
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/scroll.md` §5. Their 40–60px card radii and nested image grids are dropped.

### 7. Pointer depth on a layered hero (candidate)
- **What:** Layers of a real layered image drift by different amounts with the pointer, so a still hero gains depth. This is the page's one signature interaction.
- **Use when:** Showcase or product-object heroes with genuinely separate layers, M7+ (it is the "one signature interaction" MOTION High allows), fine pointers only.
- **Build:** Normalize the pointer to -0.5 to 0.5 and lerp it each frame; move far layers against the pointer and near layers with it, a few pixels to a couple dozen at most, vertical movement about 0.4 of horizontal. Overscan each layer so edges never show. `transform` only. GSAP: `gsap.quickTo(layer, 'x')`.
- **Guard:** Only under `(hover: hover) and (pointer: fine)` and no reduced-motion preference; touch gets the static composition. Measure an untransformed wrapper and move an inner element.
- **Slop risk:** Parallax on a flat stock photo, or on a mascot or generic 3D asset (#68).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/depth-and-interaction.md` §3.

### 8. Fixed type over a cut (candidate)
- **What:** The footage changes (a cut, a crossfade between clips or shots) while the typography stays anchored. The type is the constant; the media is the variable.
- **Use when:** Video-led showcase heroes with real footage, M6+.
- **Build:** Turn the native `loop` off and fade the clip out just before its end and back in from the page color, so the loop reads as a cut rather than a jump; switch between clips with an `opacity` crossfade of 500ms or less, locking input for the same time and pausing the outgoing clip. Any text-tone change between bright and dark clips is a color state change of 300ms or less. The page background equals the footage's edge color.
- **Guard:** No CSS transitions on the `<video>` element itself; fade a wrapper. Pause off-screen clips. Reduced motion: poster frame, no switching. Contrast checked on the brightest frame.
- **Slop risk:** Cuts with no reason, and footage that is generic AI material (#68). The source's masked backdrop blur for text protection is out (#3).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/video-and-media.md` §2 and §9. Their 1s crossfade and 700ms tone shift are restated within craft limits.

### 9. List-driven stage (candidate)
- **What:** An index of items next to one stage; choosing an item swaps what the stage shows (a product variant, a chapter, a model).
- **Use when:** Collections or variants of 3–6 real items, showcase or persuade, M5+.
- **Build:** The list is real buttons. Hover and focus both preview; click or Enter commits. The stage swaps with `opacity` and a small `transform`, 300ms or less, with one shared easing and a lock against overlapping swaps. Mark the active item with `aria-current` or `aria-pressed`.
- **Guard:** Keyboard reaches every item. Reduced motion: instant swap. No auto-advance.
- **Slop risk:** A sci-fi HUD costume around the list, or an auto-cycling list (#29). The source's blurred side items and multi-property 650ms carousel are dropped.
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/depth-and-interaction.md` §1 and §8.

### 10. Rolling label button (candidate)
- **What:** On hover the button label rolls up and a fresh copy rolls in from below; an arrow beside it turns to point up-right.
- **Use when:** The primary CTA and the nav CTA on studio or agency pages, M4+.
- **Build:** The label sits twice in a clipped window one line tall; hover moves the stack `translateY(-50%)` in 200–300ms ease-out, and the arrow rotates in the same time. The label names the action (#21).
- **Guard:** The duplicate label is hidden from assistive tech. Reduced motion: a color change only. Focus-visible gets the same state.
- **Slop risk:** Rolling every link on the page.
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/surfaces-and-buttons.md` §4. Their 500ms roll is restated to ≤ 300ms.

### 11. Anchored hero composition (candidate)
- **What:** Put the hero copy somewhere deliberate so the media stays clean: bottom-left editorial, split top and bottom like a magazine cover, or labels in the four corners around the image.
- **Use when:** Persuade or showcase heroes with real media, V6+.
- **Build:** Bottom-left: copy pinned to the bottom-left with a measure cap and generous bottom padding. Split: headline top-left, sub and action bottom-left, `justify-content: space-between` over the viewport minus the nav. Four corners: nav top, headline in the upper third, sub and action bottom-left, one real secondary link bottom-right. Text never sits over the subject; reposition the media (`object-position`, a slight oversize) before shrinking type. `100dvh` with a `100vh` fallback, and a short-viewport rule so the action stays above the fold.
- **Guard:** Contrast against the media; check at 1440 and 390.
- **Slop risk:** Filling the corners with unsourced stats (#26, #22), atmosphere strips (#37), local time or weather (#38), or a scroll cue (#39).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/layout-and-ui.md` §1, `references/craft.md` § Composition.

### 12. Subject breaking the frame (candidate)
- **What:** Depth from layering: the hero image sits in an inset frame, and a real cut-out of the subject (the product, the person) overlaps the frame's edge or the headline.
- **Use when:** Product or portrait heroes with a real cut-out, V7+.
- **Build:** The frame is one layer; the cut-out is a sibling above it, anchored to the bottom (`object-fit: contain; object-position: bottom`), overlapping the frame by a set amount. Order: frame, then text, then cut-out where the overlap is wanted, with UI on top. Headline within the hero cap.
- **Guard:** The cut-out never covers words needed to read the headline. `overflow-x: clip` on the root. Decorative overlap layers are `aria-hidden`; the image itself keeps its alt text.
- **Slop risk:** The cut-out is a mascot, NFT-style character or chrome object in a void (#68). Procedural torn edges instead of a prepared cut-out (#56).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/craft.md` § Composition ("Depth comes from layering").

### 13. Media edge equals the page (candidate)
- **What:** The page background is the color the footage or photo falls off to at its edges, so the hero needs no overlay, has no seam and never flashes.
- **Use when:** Any hero with full-bleed media.
- **Build:** The first CSS rule sets the background on `html, body`. Protect text with the lightest tool that works, in this order: footage with a calm empty zone, a soft text shadow, a late multi-stop fade at the bottom edge only. Fade media in once it has loaded.
- **Guard:** Contrast on the busiest frame of a loop (check the start, middle and end).
- **Slop risk:** A near-opaque scrim that buries the image (#57).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/craft.md` § Colour and § Text over media, `references/techniques/video-and-media.md` §4.

### 14. Metadata label system (candidate)
- **What:** One quiet label style for real metadata (dates, locations of real work, file sizes, credits) that sets off a single large display moment.
- **Use when:** Editorial, showcase or technical pages with real metadata.
- **Build:** 11–13px, short, uppercase or small caps with wide tracking (labels are where wide tracking belongs, #63), in mono or the text face, at a contrast of 4.5:1 or more. Never above a heading.
- **Guard:** Contrast checked; labels are text, not images.
- **Slop risk:** Labels above headings (#24), decorative numbering (#25), atmosphere strips (#37), all-caps body copy (#55).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/craft.md` § Typography (mono or micro-label archetype). Their 40–60% opacity is dropped for contrast.

### 15. Grain over real footage (candidate)
- **What:** A static, barely visible noise layer over video or photography that removes compression banding.
- **Use when:** Only over real video or large photographic fields that show banding.
- **Build:** A small SVG fractal-noise tile, fixed, `pointer-events: none`, a few percent effective opacity, blended `overlay` over the media. Static, not animated.
- **Guard:** Cheap as a static tile. No SVG filters inside type.
- **Slop risk:** Grain as a "vibe" on flat UI, or combined with dot grids or halftone (#60, #46).
- **Allowed exceptions:** none.
- **Source:** MotionSites `references/techniques/surfaces-and-buttons.md` §8.

## Considered and rejected

From MotionSites; each hits a rule as written, so no restated version survives.

- Blur-in headlines and blur-rise entrances (`filter: blur`): craft § Motion (opacity/transform only). The rise survives as pattern 1.
- Serif-italic accent words: #59, #44.
- Liquid-glass and frosted surfaces, progressive backdrop blur: #3.
- Gradient-clipped metallic text and the shine sweep on a word: #2; the endless sweep also #29.
- Sweep-shine, halo-glow and jewel-gradient buttons: #1 (glow halos, violet stops).
- Animated conic gradient border ring: #1, #29.
- Sliding-fill buttons with a hard offset shadow: #30.
- Spring and overshoot easing (capsule menu, chip check): #28.
- Typewriter with a blinking caret: #45.
- Scramble or decode text: craft § Motion (motion explains change; text substitution is not opacity/transform).
- Rotating word slot: #29.
- Infinite and scroll-linked marquees: #29.
- Count-up stat rows and corner stat grids: #26.
- Avatar trust cluster above the headline: #12, #22.
- Announcement badge and eyebrow chip: #24, #12.
- In-page product UI mockup: #42.
- Dot grid and halftone backgrounds: #60, #46.
- Ambient radial light and cursor spotlight reveal: #47; the mask animation also breaks craft § Motion.
- Ghost word or viewport-wide wordmark (14–28vw, -0.07em): #34, #62.
- Magnetic hover: craft § Motion (decoration, not a state change).
- Light sweep on a CTA: #1 with a decorative glow; craft § Motion.
- Scroll-scrubbed and cursor-scrubbed video, boomerang loops: craft § Motion (frame seeking and canvas drawing, not opacity/transform); the source's stated use is abstract transformation footage (#68).
- Orbit rings with glowing avatars: #29, #1.
- Sand-dissolve SVG transition, cursor image trail, 3D tilted text crawl, shader backdrop: craft § Motion; the shader backdrop also #4.
- Live local time and the pulsing "available" dot: #38, #29.
- Generic AI hero footage and cut-outs from the media shelf: #68.
