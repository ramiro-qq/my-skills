---
name: requirements-to-tech
description: Use when converting 需求文档、PRD、feature brief、新功能说明 or an existing project context into a 技术方案/technical architecture proposal that must inspect current code and existing architecture docs, compare at least three solution options, optionally analyze UI design inputs, and produce a reviewable plan before any coding begins.
---

# Requirements To Tech Plan

## Overview

Turn a raw requirement into a project-specific technical solution document.

Treat the latest architecture doc and the current codebase as the baseline. Design only the increment required for the new requirement, then stop for review before any coding begins.

## Required Outputs

- Write one solution document to `docs/architectures/YYYY-MM-DD-vN.md`.
- Return a concise summary covering requirement source, baseline used, chosen stack, key impacts, and open questions.
- Explicitly stop after the document is ready. Do not implement code until the user approves the plan.

## Workflow

### 1. Confirm the requirement source

- If the user provides a requirement file, read it first.
- If the user provides only a topic, search the repo for likely requirement Markdown files and ask the user to confirm the source.
- If nothing usable exists, ask for a short written requirement before continuing.

### 2. Establish baseline context

- Scan `docs/architectures/*.md` and pick the newest baseline by date, then highest `vN` for the same date.
- Read project constraints before making recommendations: package manager, framework, scripts, repo rules, current modules, and any local instruction files.
- Compare the new requirement against the baseline docs and the current codebase. Define the increment explicitly.

### 3. Handle optional inputs

- If a UI design file or link exists, extract theme tokens, reusable components, layout rules, interaction patterns, and engineering implications.
- If the project needs a new frontend scaffold, include that work in the plan.
- Prefer `Next.js + shadcn/ui` for SSR work and `Vite + React Router + TypeScript + shadcn/ui` for SPA work unless the repo context strongly indicates another choice.

### 4. Research solution options

- Evaluate at least three realistic options.
- Use current primary sources when comparing technology choices.
- Compare learning curve, integration difficulty, ecosystem, maintenance health, adoption, migration cost, and fit for the existing repo.
- If current research is blocked, say so explicitly and base the comparison on the best available project-local evidence.
- Recommend one option and explain why the others lose in this specific context.

### 5. Write the solution document

- Follow `references/tech-plan-template.md`.
- Make the plan concrete: modules, directories, interfaces, API boundaries, shared components, shared logic, data flow, risks, rollout notes, and regression scope.
- Use Mermaid diagrams for architecture and flow when text alone is not enough.
- Add code snippets only when they clarify a difficult technical point. Do not pre-implement the feature.

### 6. Save and present

- Create `docs/architectures/` if it does not exist.
- Name the file `YYYY-MM-DD-vN.md`.
- Choose `vN` by incrementing the largest version already present for the same date. Start with `v1`.
- Return the file path plus a short review checklist.
- Stop and wait for approval before any coding.

## Increment Rules

- `新需求`: the requirement being solved now.
- `存量技术方案`: the latest document under `docs/architectures/`.
- `增量方案`: everything newly required after comparing the new requirement, baseline docs, and current code.
- Avoid rewriting the whole architecture unless the comparison shows the baseline is obsolete.

## Non-Negotiables

- Follow `先文档、后编码`.
- Respect project constraints and existing architecture before recommending a stack.
- Label assumptions instead of inventing product rules.
- Separate facts from inference when the codebase and docs disagree.

## Common Mistakes

- Treating the requirement doc as sufficient without reading the codebase.
- Producing a generic technology comparison that ignores the current repo.
- Skipping impact analysis or regression scope.
- Writing implementation-level detail where module-level design is enough.
- Overwriting old architecture docs instead of versioning a new one.

## Reference

- Use `references/tech-plan-template.md` for the document skeleton, comparison table, and diagram expectations.
