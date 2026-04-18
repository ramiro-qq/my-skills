# Skill Schema Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first executable foundation for this repository: a TypeScript workspace, `skill.json` schema validation, and a minimal example skill.

**Architecture:** Use a small Node.js + TypeScript workspace with three responsibilities: `packages/schema` owns `skill.json` parsing and validation, `packages/core` exposes file-based loading helpers, and `packages/cli` provides a thin `validate` command. Add one example skill under `skills/` and verify the red-green path with Vitest.

**Tech Stack:** Node.js, TypeScript, Vitest, Zod

---

### Task 1: Bootstrap the workspace

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `packages/cli/package.json`
- Create: `packages/core/package.json`
- Create: `packages/schema/package.json`

- [ ] **Step 1: Create root workspace metadata**

```json
{
  "name": "my-skills",
  "private": true,
  "type": "module",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "validate": "node ./dist/packages/cli/src/index.js validate"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "typescript": "^5.9.0",
    "vitest": "^3.0.0",
    "zod": "^4.0.0"
  }
}
```

- [ ] **Step 2: Add TypeScript config**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": ".",
    "outDir": "dist",
    "strict": true,
    "declaration": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "include": [
    "packages/**/*.ts",
    "tests/**/*.ts"
  ]
}
```

- [ ] **Step 3: Add Vitest config**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"]
  }
});
```

- [ ] **Step 4: Add package manifests for workspace packages**

```json
{
  "name": "@my-skills/schema",
  "version": "0.1.0",
  "type": "module",
  "main": "./src/index.ts"
}
```

Repeat for `@my-skills/core` and `@my-skills/cli`.

### Task 2: Define and test the `skill.json` schema

**Files:**
- Create: `packages/schema/src/index.ts`
- Test: `tests/integration/skill-schema.test.ts`

- [ ] **Step 1: Write the failing schema test**

```ts
import { describe, expect, it } from "vitest";
import { parseSkillManifest } from "../../packages/schema/src/index.js";

describe("parseSkillManifest", () => {
  it("accepts a minimal valid skill manifest", () => {
    const manifest = parseSkillManifest({
      name: "example-skill",
      version: "0.1.0",
      entry: "SKILL.md"
    });

    expect(manifest.name).toBe("example-skill");
    expect(manifest.version).toBe("0.1.0");
    expect(manifest.entry).toBe("SKILL.md");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/integration/skill-schema.test.ts`
Expected: FAIL because `parseSkillManifest` does not exist yet.

- [ ] **Step 3: Write the minimal schema implementation**

```ts
import { z } from "zod";

const skillManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  entry: z.string().min(1),
  description: z.string().min(1).optional(),
  files: z.array(z.string().min(1)).default([]),
  installPath: z.string().min(1).default(".codex/skills")
});

export type SkillManifest = z.infer<typeof skillManifestSchema>;

export function parseSkillManifest(input: unknown): SkillManifest {
  return skillManifestSchema.parse(input);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/integration/skill-schema.test.ts`
Expected: PASS with 1 test passed.

### Task 3: Add file loading in `core`

**Files:**
- Create: `packages/core/src/index.ts`
- Test: `tests/integration/load-skill.test.ts`

- [ ] **Step 1: Write the failing loader test**

```ts
import { describe, expect, it } from "vitest";
import { loadSkillManifest } from "../../packages/core/src/index.js";

describe("loadSkillManifest", () => {
  it("loads and parses a skill manifest from disk", async () => {
    const manifest = await loadSkillManifest("skills/example-skill/skill.json");

    expect(manifest.name).toBe("example-skill");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/integration/load-skill.test.ts`
Expected: FAIL because loader does not exist and fixture file is not present yet.

- [ ] **Step 3: Implement the minimal loader**

```ts
import { readFile } from "node:fs/promises";
import { parseSkillManifest } from "../../schema/src/index.js";

export async function loadSkillManifest(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  return parseSkillManifest(JSON.parse(raw));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/integration/load-skill.test.ts`
Expected: PASS with 1 test passed.

### Task 4: Add the first example skill

**Files:**
- Create: `skills/example-skill/SKILL.md`
- Create: `skills/example-skill/skill.json`
- Create: `skills/example-skill/README.md`

- [ ] **Step 1: Create the example manifest**

```json
{
  "name": "example-skill",
  "version": "0.1.0",
  "description": "A minimal example skill used to validate repository conventions.",
  "entry": "SKILL.md",
  "files": [
    "SKILL.md",
    "README.md"
  ],
  "installPath": ".codex/skills/example-skill"
}
```

- [ ] **Step 2: Create the example skill body**

```md
# Example Skill

Use this skill as the canonical minimal template for new formal skills in this repository.
```

- [ ] **Step 3: Create the example skill README**

```md
# example-skill

This skill exists to show the minimum required structure for a formal skill.
```

### Task 5: Add the CLI validate command

**Files:**
- Create: `packages/cli/src/index.ts`
- Test: `tests/e2e/validate-command.test.ts`

- [ ] **Step 1: Write the failing CLI test**

```ts
import { describe, expect, it } from "vitest";
import { execa } from "execa";

describe("validate command", () => {
  it("validates the example skill", async () => {
    const result = await execa("node", ["packages/cli/src/index.ts", "validate"]);
    expect(result.stdout).toContain("example-skill");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/e2e/validate-command.test.ts`
Expected: FAIL because the CLI entry does not exist yet.

- [ ] **Step 3: Implement the minimal CLI**

```ts
import { loadSkillManifest } from "../../core/src/index.js";

const command = process.argv[2];

if (command === "validate") {
  const manifest = await loadSkillManifest("skills/example-skill/skill.json");
  console.log(`validated ${manifest.name}@${manifest.version}`);
} else {
  console.error("unknown command");
  process.exit(1);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/e2e/validate-command.test.ts`
Expected: PASS with output containing `validated example-skill@0.1.0`.

### Task 6: Final verification

**Files:**
- Verify only

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS with all integration and e2e tests green.

- [ ] **Step 2: Run TypeScript compilation**

Run: `npm run build`
Expected: PASS with `dist/` output generated and no type errors.
