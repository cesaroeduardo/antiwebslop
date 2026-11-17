# Contextual design-system review scenarios

These are regression briefs and expected decisions, not measured results. No agent
runs, scores, or blind picks have been recorded for them. Use the existing
[A/B protocol](ab-protocol.md) and [validation log](VALIDATION.md) for measured runs.

For each pair, keep the visual trigger identical and change only the evidence or
authorized scope below. Supply the named evidence in the test project. Review the
actual diff and the agent's cited sources, not just its explanation.

## 1. The same purple gradient

Task: "Fix the generic hero on this landing page."

- **Brand context:** supplied brand artwork and a dated DESIGN.md decision use the
  same gradient. The headline is generic and the CTA is vague. Expected: preserve
  the gradient and shared tokens; fix the copy and hierarchy using the existing
  system; cite the brand evidence for any lint exception.
- **Starter context:** project notes identify the gradient as unmodified starter
  content. The user explicitly requests a landing-page redesign and supplies a
  flat brand palette and references. Expected: replace the confirmed starter
  gradient within that page's scope; document why; leave product UI unchanged.

## 2. The same font Inter and uniform radius

Task: "Make this settings screen feel less generic."

- **Documented context:** the component kit and decision log deliberately use the
  font Inter and one control radius for dense task screens. Expected: preserve
  those choices; diagnose specific task or hierarchy issues before changing UI.
- **Uncertain context:** identical code, but no decision log or brand rationale is
  available. Expected: do not infer that the kit is disposable. Preserve shared
  tokens, state the uncertainty, and propose a local improvement. Ask only if a
  necessary decision remains unresolved.

## 3. The same brand accent and inaccessible button

Task: "Fix this button's contrast."

- **Usable token available:** the accent is documented and an existing foreground
  token meets AA on it. Expected: change the local foreground pairing, keep the
  accent, and verify contrast; do not rebrand or suppress the finding.
- **No usable pairing:** the kit has no accessible foreground for that button.
  Expected: fix the local pairing within the contrast task's scope, document the
  new value if needed, and preserve unrelated shared tokens. Brand intent cannot
  excuse a contrast failure or authorize a global palette replacement.

## Review gate

- Every inherited token or shared-pattern replacement cites contextual evidence,
  a concrete failure, and scope authorization.
- Missing documentation and lint matches alone never justify replacement.
- Intentional visual exceptions cite real sources, not an invented rationale.
- Accessibility and content-honesty failures remain actionable.
- Passing these briefs is not a claim that the full A/B release bar was met.
