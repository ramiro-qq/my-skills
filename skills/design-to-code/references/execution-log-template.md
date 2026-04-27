# design-to-code execution log template

Use one log file per conversation or run context.

## Recommended filename
- `design-to-code-log-<thread-or-run-id>.md`

## Recommended location resolution
1. user-specified directory
2. `DESIGN_TO_CODE_LOG_DIR`
3. existing host-project agent/workflow log directory
4. fallback: `design-to-code-logs/` in the project root

## Step entry template

```md
## Step: <name>
- Status: pending | running | success | failed | skipped
- StartedAt: <ISO timestamp>
- FinishedAt: <ISO timestamp>
- Inputs:
  - ...
- Outputs:
  - ...
- Artifacts:
  - ...
- Notes:
  - ...
```

## Visual repair round template

Use this section for every screenshot-comparison and repair round. Every round must be logged individually, and the same key fields must also be echoed visibly in the current conversation.

```md
## Visual Repair Round <N>
- Status: continue | passed | blocked
- StartedAt: <ISO timestamp>
- FinishedAt: <ISO timestamp>
- CurrentScore: <current_score>
- PreviousScore: <previous_score>
- ScoreDelta: <score_delta>
- Threshold: 0.95
- MismatchRegions:
  - <region_1>
  - <region_2>
  - <region_3>
- ChangesMade:
  - <change_1>
  - <change_2>
- Artifacts:
  - reference screenshot: <path-or-url>
  - current screenshot: <path-or-url>
  - diff image/report: <path-or-url>
- NextAction:
  - continue repairing | finalize | wait for human decision
- BlockingReason:
  - <leave empty if none>
```

## Chat-visible echo template

After every visual repair round, immediately echo this in the conversation:

```text
[Visual Repair Round N]
Current score: <current_score>
Previous score: <previous_score>
Delta: <score_delta>
Mismatch regions: <region_1>, <region_2>, <region_3>
Changes made: <what_changed_this_round>
Status: <continue | passed | blocked>
```

## Minimum recorded steps
1. source ingestion
2. project convention scan
3. project component scan
4. target frame/page resolution
5. generation strategy decision
6. file generation
7. route integration
8. build/typecheck
9. screenshot capture
10. comparison summary
11. each visual repair round with score tracking

## Important
- append updates as they happen
- never rely only on end-of-run summaries
- record wrong turns too, such as selecting the wrong frame or over-generating UI details
- every repair round must have both a log entry and a chat-visible score echo
- if a round is missing the chat-visible echo, treat that round as incomplete and immediately补发该轮回显
- keep the format agent-platform-neutral so the same skill can run under Alma, Codex, Claude, or other hosts
