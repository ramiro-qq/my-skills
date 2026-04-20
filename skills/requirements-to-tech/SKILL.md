---
name: requirements-to-tech
description: Use when converting 需求文档、PRD、feature brief、新功能说明 or an existing project context into a 技术方案/technical architecture proposal that must inspect current code and existing architecture docs, compare at least three solution options, optionally analyze UI design inputs, and produce a reviewable plan before any coding begins.
---

# Requirements To Tech Plan

## Overview

Turn a raw requirement into a project-specific technical solution document.

Treat the latest architecture doc and the current codebase as the baseline. Design the increment required for the new requirement, but always include a concise current architecture snapshot so the new document can be read independently before any coding begins.

## Required Outputs

- Write one solution document to `docs/architectures/YYYY-MM-DD-[中文需求简称].md`.
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
- Build two views in parallel:
  - `增量方案`: what changes for this requirement.
  - `当前完整架构快照`: a concise merged view of the baseline plus this increment, so the new file stands on its own.

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
- Make the plan concrete: modules, directories, interfaces, API boundaries, shared components, shared logic, data flow, risks, rollout notes, regression scope, and a concise current architecture snapshot.
- Use Mermaid diagrams for architecture and flow when text alone is not enough.
- Add code snippets only when they clarify a difficult technical point. Do not pre-implement the feature.

### 6. Save and present

- Create `docs/architectures/` if it does not exist.
- Name the file `YYYY-MM-DD-[中文需求简称].md`.
- Derive `[中文需求简称]` from the new requirement itself, keep it short and readable, and prefer 4-12 Chinese characters.
- Remove punctuation, slashes, and generic suffixes such as `需求`, `方案`, or `设计` unless they are needed to disambiguate.
- If the user explicitly gives a Chinese short name, use it as-is unless it would create an invalid filename.
- Return the file path plus a short review checklist.
- Stop and wait for approval before any coding.

## Increment Rules

- `新需求`: the requirement being solved now.
- `存量技术方案`: the latest document under `docs/architectures/`.
- `增量方案`: everything newly required after comparing the new requirement, baseline docs, and current code.
- `当前完整架构快照`: a concise merged summary of the baseline architecture plus the approved increment, written into the new document for standalone reading.
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
- Writing only delta notes and forgetting the standalone architecture snapshot.
- Writing implementation-level detail where module-level design is enough.
- Using opaque filenames such as `v2`, `final`, or `新版方案` instead of a Chinese requirement short name.

## Reference

- Use `references/tech-plan-template.md` for the document skeleton, comparison table, and diagram expectations.
