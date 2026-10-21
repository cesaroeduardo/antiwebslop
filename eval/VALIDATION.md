# Validation log

Append one block per run pair. Newest at the bottom. Keep it factual.

## Format

```markdown
### YYYY-MM-DD — <brief file> — skill @ <commit sha>
- **Agent / model / settings:** <e.g. Cursor agent, <model>, default>
- **Baseline (no skill):** A <n>/20 · B <n>/12 · C <n>/10 · total <n>/42 · D pass|fail · lint <E>/<W>/<I>
- **With skill:** A <n>/20 · B <n>/12 · C <n>/10 · total <n>/42 · D pass|fail · lint <E>/<W>/<I>
- **Blind pick:** with-skill | baseline | tie — "<reviewer's one-sentence reason>"
- **Failures seen (with skill):** <rubric ids + what happened>
- **Skill change proposed:** <catalog entry / lint rule / checklist line / none>
- **Artifacts:** <paths to screenshots, lint JSON>
```

## Runs

_None yet._
