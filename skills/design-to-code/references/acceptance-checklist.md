# acceptance checklist

Use this checklist before calling the skill result acceptable.

- Visual similarity must be at least 0.95 for the final accepted result unless blocked by documented external constraints
- If visual similarity is below 0.95, the task must continue iterative repair and must not be marked complete
- After every repair round, output the current visual similarity score, the previous score, the main mismatch regions, and what changed in this round
- Typography is close to source design
- Spacing rhythm is preserved
- Components are reusable when repeated
- Output code remains readable and maintainable
- Any early stop below 0.95 must be marked as blocked, unfinished, or needs-human-review rather than success
- Final report lists unresolved mismatches, blocking reasons, and next repair actions if any
