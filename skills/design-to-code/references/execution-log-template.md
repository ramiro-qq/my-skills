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

## Important
- append updates as they happen
- never rely only on end-of-run summaries
- record wrong turns too, such as selecting the wrong frame or over-generating UI details
- keep the format agent-platform-neutral so the same skill can run under Alma, Codex, Claude, or other hosts
