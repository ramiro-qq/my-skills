# design-to-code verification roadmap

## Goal
Move from manual visual tuning to measurable UI fidelity verification.

## Minimum useful loop
1. render generated preview route
2. capture a screenshot of the preview
3. compare it with a reference design export
4. summarize mismatches by region
5. repair the highest-impact mismatches first

## Why this matters
Without screenshot comparison, the skill can improve directionally but cannot confidently claim high-fidelity reconstruction.

## Current state from QMorph testing
- structured template mode works better than naive tree rendering for complex Pencil pages
- host component reuse improves consistency significantly
- the missing piece is automated visual verification
