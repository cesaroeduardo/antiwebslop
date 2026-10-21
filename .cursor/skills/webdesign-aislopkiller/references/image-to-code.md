# Image → code workflow

Credit: [Leonxlnx image-to-code-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill).

## When to use it (conditional, not mandatory)

Use image-first when **any** of these hold:
- the user provided a reference image, screenshot, or mockup, or
- you are designing a **new page or a full redesign** (not a component tweak) **and** an image-generation tool is available.

Skip it for small edits, single components, product-UI work inside an existing kit, or when no image tool exists. Say in one line which path you took.

## Order

1. **Get the reference.** Use the user's image, or generate section-scale images (hero + key sections as separate images, not one compressed board). The hero must be readable at small-laptop size; regenerate if text or spacing is unreadable.
2. **Extract the system** and write it down before coding: palette (hex), type families and scale, spacing steps, grid and column splits, radius and border rules, button styles, what to **avoid** (check against [anti-patterns](anti-patterns.md); a generated image can contain slop too).
3. **Implement to match.** Match the reference exactly; do not "improve" it into a template. Map extracted values to the project's tokens (project tokens win over the image when they conflict).
4. **Compare** screenshot vs. reference at the same viewport; fix drift.
5. **Record** the extracted system in the project's `DESIGN.md` if it becomes the look.

Dials: use the surface's preset from [dials](dials.md). There are no separate image dials.
