# Repair, don't remove

Some elements carry content: a funding badge, an avatar row, a logo strip, a testimonial, a
number, a label, a product shot. None of them is slop by nature. They read as slop when they are
**untrue, meaningless or badly made**. So the two halves of this skill treat them differently:

- **Detect (lint, review):** keep flagging them. The tell is real; most of the time the element
  is invented or careless.
- **Fix (rebuild, audit fix):** repair the element. Make it true, give it a job, and craft it into
  the page's type and color system. Do not delete it to make the warning go away.

**Remove only when there is no real data behind it.** Then say so in the reply and ask for the
real thing ("I took the 10k+ avatar row out: there is no source for the count. Send me the real
number or three customers who agreed to be shown and I will put it back"). In code, leave a
`TODO(content): …` where it was so the slot is visible. Never drop it silently, and never
replace one invention with another.

A repaired element passes three checks:

1. **True:** it points at something that exists (a person, a company, an article, a dataset) and
   the reader could check it.
2. **Meaningful:** it answers a question the reader has at that spot (is this real, who uses it,
   what does it do). If it answers nothing, it goes, and you say why.
3. **Crafted:** it uses the page's own type scale, colors and spacing. No glow pill, no gradient
   border, no sticker, no motion it does not need.

References cited below are ids from the "Reference inbox" in
[premium-patterns.md](premium-patterns.md). Anti-pattern numbers refer to
[anti-patterns.md](anti-patterns.md).

## Announcement and funding badges (#12, #24, #41)

**Done right:** the news is real and dated, it links to the announcement, and it sits quietly in
the type system: a small line of body text in the nav, under the primary action, or as a plain
text link above the headline set in the page's own text size and color. One per page.

**Slop:** a glowing or gradient pill above the headline, "✨ New", "🚀 v2.0", "Series A" with no
date or link, a version stamp that is not news, several badges stacked.

**Reference:** R9-mindcloud-home links an Inc. 5000 ranking ("Read more") as its proof line; keep
the checkable claim and its link, drop the pill shape and the glow. R3-rulebase-home puts a
small link to a dated report just above its primary action. R13-beew-home shows a funding
announcement as a press card with a real team photo and a funding headline; that form is right,
the typo in it ("as raised") is not.

## Avatar clusters and user counts (#12, #22)

**Done right:** the faces are real customers who agreed to be shown, or the count has a source
(an analytics figure, a public number) and a date. Avatars are large enough to recognize, and
each one, or the row, links to reviews, case studies or a public profile. A count is written
plainly ("2,310 clinics, March 2026") rather than rounded up to "10k+".

**Slop:** stock or generated faces, a tiny overlapping stack with "+10k users already joined", a
count with no source, numbers that never change.

**Reference:** none of today's references does this right yet; R10-incredible-home shows the slop
version.

## Logo strips and marquees (#22, #29)

**Done right:** real customers you have permission to name; one consistent optical size (match
visual weight, not box width); all monochrome in the page's ink, or all brand-faithful, never
mixed; each logo links to its case study when one exists. The row is static. It scrolls only when
there are genuinely many logos, and then it pauses on hover and stops under
`prefers-reduced-motion`.

**Slop:** famous logos that are not customers, mixed sizes and colors, logos faded at both edges
to hide that there are six of them, an endless ticker of a short list, "Trusted by the best teams"
with no link anywhere.

**Reference:** none done right yet; R8-stacker-home (faded logo strip) and R13-beew-home (client
logo marquee) show the slop version.

## Testimonials (#22)

**Done right:** a named person with role and company, a photo or link that proves they exist, a
quote that says something specific about the product (a number, a before/after, a feature), and a
link to the full case study when there is one.

**Slop:** "Jane Doe, CEO at Acme", quotes that would fit any product, five-star rows with no
source, a carousel of interchangeable praise.

**Fix:** if no real quotes exist, keep the section as `TODO(content): real testimonial` and ask
for them; do not ship placeholders.

## Stats and numbers (#22, #26)

**Done right:** a number that is real and explains the product, with its unit, date and source,
and one sentence of context. One meaningful number beats a row of three. A number inside real
product content (a report, a dashboard you can see) counts too.

**Slop:** "99.9%", "10x faster", "150+" with tiny captions, a row of three big numbers under the
hero, numbers no one could check.

**Reference:** R3-rulebase-home puts its numbers inside a real report screen (interaction
count, finding count, a High/Medium/Low bar), so the figures read as product, not as boasting.

## Eyebrows and labels (#24)

**Done right:** the label carries real information the heading does not: a category, a date, a
location, a status, a section in a real sequence. It is set in the page's type system (the text
size, a mono or small caps style used everywhere for metadata), not as a pill.

**Slop:** "INTRODUCING", "Features", "New" in a tiny tracked pill over every heading.

**Reference:** R4-arantxa-barcia-home sets role and city in small mono caps under the name;
R2-quantinium-home runs a short metadata line along the top of the hero. Both are facts, set as
metadata, not decoration.

## Product mockups (#42)

**Done right:** a real screenshot or a cropped piece of the real UI, with real or realistic
content, framed simply (the page's radius, a hairline or no frame), large enough to read. A
working embedded demo is better still.

**Slop:** dashboards, terminals and chat panes built from styled `div`s, floating UI cards with
invented numbers, a tilted mock with a play button.

**Fix:** replace the mock with the real thing; if no screenshot exists yet, leave the slot with
`TODO(content): product screenshot` and ask for one.

**Reference:** R3-rulebase-home uses a large real product screen as the hero stage.

## Similar elements

The same rule covers press mentions, awards, ratings, "as seen in" rows, security badges (SOC 2,
GDPR) and integration grids: real, linked, legible and quiet, or flagged and asked for.
