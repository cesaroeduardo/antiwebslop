# A/B protocol

Goal: isolate the skill's effect. Everything except the skill stays fixed.

## Setup

1. Pick 3–5 briefs covering different surfaces: at least one landing page, one help/docs page, and one **product UI** task (scope-safety check).
2. For each brief, prepare two clean checkouts at the same commit: `run-a/` and `run-b/`.
3. In the skill run only, install the skill (`.cursor/skills/antiwebslop/`). In the baseline, make sure no copy of it (or any other design skill) is present.
4. Same agent, same model, same settings, same brief text, fresh chat each time. Record all of them in VALIDATION.md.

## Run

1. Paste the brief verbatim. Answer clarifying questions identically in both runs (keep a script of answers).
2. Let each run finish on its own; do not steer. One follow-up allowed per run: *"Finish and make it production-ready."*
3. Capture the 3 viewports for both (see the skill's visual-qa reference) and save them as `eval/runs/<date>-<brief>/{a,b}-{desktop,tablet,mobile}.png` (screenshots are optional to commit).
4. Run `npm run slop-lint -- <changed paths> --json` for both and save the JSON.

## Blind review

1. Randomly assign which run is shown as "Left" and which as "Right"; someone other than the reviewer keeps the key.
2. Reviewer (Eduardo) answers: *Which looks designed by a person for this product?* Left / Right / Tie, and one sentence why.
3. Then score both with `rubric.md` (the code-based items can be scored unblinded after the pick).

## Decide

- A skill change ships when it meets the pass bar in `rubric.md` across the brief set **and** wins or ties the blind pick in ≥ 2/3 of briefs.
- If a version regresses on any brief, log why before changing anything else.
- Repeat each brief twice if results look noisy; models vary run to run.
