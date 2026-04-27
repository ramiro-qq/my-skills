# design-to-code verification roadmap

## Goal
Move from manual visual tuning to measurable UI fidelity verification with a hard completion gate and mandatory chat-visible reporting.

## Minimum useful loop
1. render generated preview route
2. capture a screenshot of the preview
3. compare it with a reference design export
4. compute and record the current visual similarity score
5. summarize mismatches by region
6. post a chat-visible round report with the current score
7. repair the highest-impact mismatches first
8. rerun screenshot comparison after the repair
9. post the updated score and repair summary for that round in the conversation
10. repeat until score >= 0.95 or a documented blocking constraint prevents further progress

## Completion rule
- score >= 0.95 means the visual verification gate is satisfied
- score < 0.95 means the task is not complete yet
- if the task stops below 0.95, it must be labeled blocked, unfinished, or needs-human-review instead of successful
- if a repair round is not echoed in the conversation with its score report, that round does not count as completed

## Per-round reporting requirements
After every repair round, always report in the current conversation:
- current visual similarity score
- previous score
- score delta
- major mismatch regions
- repair actions taken in this round
- whether the task can continue automatically or is blocked

## Required chat-visible template
```text
[Visual Repair Round N]
Current score: <current_score>
Previous score: <previous_score>
Delta: <score_delta>
Mismatch regions: <region_1>, <region_2>, <region_3>
Changes made: <what_changed_this_round>
Status: <continue | passed | blocked>
```

## Why this matters
Without screenshot comparison and chat-visible per-round score reporting, the skill can improve directionally but cannot confidently claim high-fidelity reconstruction or prove progress to the user in real time.

## Current direction
- structured template mode works better than naive tree rendering for complex Pencil pages
- host component reuse improves consistency significantly
- automated visual verification must be treated as a mandatory gate rather than a nice-to-have
- per-round score reporting must be visible in the conversation rather than hidden in logs
