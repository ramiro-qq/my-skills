# design-to-code pipeline

## Stages
1. Ingest source
2. Scan project conventions and agent expectations
3. Scan project component library
4. Resolve the correct target page/frame
5. Start execution log
6. Normalize to Design IR
7. Extract tokens
8. Generate code
9. Run preview
10. Wait for stable page state
11. Screenshot comparison with measurable score output
12. Chat-visible round report for the current score
13. Iterative repair
14. Repeat screenshot comparison and chat-visible round report after every repair
15. Completion gate or blocked status decision
16. Final report

## Input priorities
1. Figma URL / exported JSON
2. Screenshot image
3. Pencil export / project output

## Output expectations
- Maintainable React/Tailwind code
- Design IR
- Token extraction
- Screenshot diff report
- Repair summary
- conversation-scoped execution log
- per-round visual similarity score log
- chat-visible per-round score echo

## Required execution rules
- screenshot comparison must produce a measurable visual similarity score rather than only a qualitative judgment
- after each repair round, immediately output the current score, previous score, score delta, major mismatch regions, and the repair actions taken
- the per-round score report must be echoed visibly in the current conversation, not only written to logs, reports, or files
- if a repair round is missing the chat-visible score echo, that round is considered incomplete and must be reported immediately
- if the score is below 0.95, continue iterative repair and do not mark the task complete
- reaching a repair-round limit does not count as success by itself
- if the task cannot reach 0.95 because of external constraints, missing assets, broken source data, or host-project restrictions, mark it as blocked / unfinished / needs-human-review and document why
- only enter the completion path when the score is at least 0.95

## Chat-visible round report format
Use this format after every repair round:

```text
[Visual Repair Round N]
Current score: <current_score>
Previous score: <previous_score>
Delta: <score_delta>
Mismatch regions: <region_1>, <region_2>, <region_3>
Changes made: <what_changed_this_round>
Status: <continue | passed | blocked>
```

## Pencil renderer notes
- split rendering by node type instead of using one generic branch for all nodes
- render icon nodes with a real icon component library when the source specifies icon font names
- preserve shell-level structure such as sidebar + main before deep child rendering
- treat text color as text color only
- scan the current project UI library first and reuse shared components wherever possible
- scan project conventions before coding so generated output follows the host app's structure and coding norms
