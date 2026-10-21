# Anti-pattern catalog

Each entry: **Detect** (how to spot it in code or a screenshot), **Do instead**.
`lint:` gives the matching `slop-lint` rule id, if one exists. `error` = ship-blocker,
`warn` = fix or justify in one line, `info` = look at it.

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
- **Detect:** `text-center` on most sections; long paragraphs centered.
- **Do instead:** Left-align body copy and most sections. Center only short, isolated statements.

### 9. Same rhythm for every section
- **Detect:** every section = eyebrow pill + H2 + gray subtitle + grid. Same padding, same width.
- **Do instead:** Vary density and width by section job (proof = dense, story = narrow and airy, pricing = tabular). See [craft § rhythm](craft.md#spacing-and-rhythm).

### 10. Cards inside cards; card stacks for everything
- **Detect:** bordered/shadowed containers nested 2+ deep; every piece of content boxed.
- **Do instead:** Group with space and alignment first, then a divider, then a card only if the thing is a separate, clickable object.

### 11. Default bento grid
- **Detect:** a 2×3 or 3×3 mosaic of rounded tiles with icons and one-line claims, used because it is fashionable.
- **Do instead:** Use a bento only when the tiles show real, different content (screenshots, data, quotes) of meaningfully different sizes.

### 12. Hero overlays and stickers
- **Detect:** floating badges ("✨ New", "🚀 v2.0"), detached labels, rotated stickers, avatars stacked with "Join 10k+".
- **Do instead:** One announcement link above the headline at most, set in plain text style.

## Typography

### 13. Inter/Roboto/Arial as the only display face (`lint: default-font`, info)
- **Detect:** one family for everything, all headings `font-bold` at roughly the same sizes.
- **Do instead:** Choose a display face with character that fits the Design Read and pair it with a readable text face (see [craft § typography](craft.md#typography)). Inter is fine for body and UI text.

### 14. No type scale
- **Detect:** arbitrary sizes (`text-[37px]`, 15 different sizes), headings that barely differ from body.
- **Do instead:** A ratio-based scale with 6–8 steps; headline at least 2.5× body on desktop.

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
- **Detect:** "Get Started", "Learn More", "Sign Up Now", "Try it free" as the only CTA text.
- **Do instead:** Name the action and object: "Open the build wheel", "Import my matches".

### 22. Fake social proof and metrics (`lint: fake-proof`, warn; `lint: placeholder-name`, warn)
- **Detect:** "Trusted by 10,000+ teams", "10x faster", "99.9% uptime", testimonials from "Jane Doe, CEO at Acme", logo walls of companies that are not customers.
- **Do instead:** Use only real, sourced proof. If none exists, leave the section out, or mark it `TODO(content): real testimonial` so it cannot ship by accident.

### 23. Stock filler content
- **Detect:** placeholder paragraphs that could describe any product; stock photos of people pointing at laptops; three-word feature titles ("Fast. Secure. Reliable.").
- **Do instead:** Use the project's real content: actual screenshots, data, names, prices, changelog items. Ask for content when it is missing rather than inventing it.
