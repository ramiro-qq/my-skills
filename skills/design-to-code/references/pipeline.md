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
11. Screenshot comparison
12. Iterative repair
13. Final report

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

## Pencil renderer notes
- split rendering by node type instead of using one generic branch for all nodes
- render icon nodes with a real icon component library when the source specifies icon font names
- preserve shell-level structure such as sidebar + main before deep child rendering
- treat text color as text color only
- scan the current project UI library first and reuse shared components wherever possible
- scan project conventions before coding so generated output follows the host app's structure and coding norms
