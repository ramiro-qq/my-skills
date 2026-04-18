# External CLI Packaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn this repository into a distributable CLI package that exposes a real `my-skills` executable instead of requiring users to run TypeScript source files directly.

**Architecture:** Keep the current TypeScript source under `packages/cli`, compile it to `dist/`, and add a small root-level Node bin wrapper that loads the compiled CLI. Update root package metadata so the repository is packageable and test the wrapper end-to-end after a build.

**Tech Stack:** Node.js, TypeScript, Vitest, npm package metadata

---

### Task 1: Add packaging expectations as tests

**Files:**
- Create: `tests/integration/package-metadata.test.ts`
- Create: `tests/e2e/executable-cli.test.ts`

- [ ] **Step 1: Write the failing package metadata test**

```ts
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("package metadata", () => {
  it("exposes a publishable CLI package", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));

    expect(packageJson.private).toBe(false);
    expect(packageJson.bin).toEqual({
      "my-skills": "./bin/my-skills.js"
    });
  });
});
```

- [ ] **Step 2: Write the failing executable CLI test**

```ts
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("my-skills executable", () => {
  it("runs validate through the packaged bin entry", async () => {
    await execFileAsync("npm", ["run", "build"]);
    const result = await execFileAsync("node", ["bin/my-skills.js", "validate"]);
    expect(result.stdout).toContain("validated 2 skills");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `package.json` has no `bin` metadata and `bin/my-skills.js` does not exist yet.

### Task 2: Add the external executable wrapper

**Files:**
- Create: `bin/my-skills.js`
- Modify: `package.json`

- [ ] **Step 1: Add a Node bin wrapper**

```js
#!/usr/bin/env node
import "../dist/packages/cli/src/index.js";
```

- [ ] **Step 2: Update root package metadata**

```json
{
  "name": "my-skills",
  "version": "0.1.0",
  "private": false,
  "bin": {
    "my-skills": "./bin/my-skills.js"
  },
  "files": [
    "bin",
    "dist",
    "skills",
    "registry",
    "README.md"
  ],
  "scripts": {
    "prepack": "npm run build"
  }
}
```

- [ ] **Step 3: Mark the wrapper executable**

Run: `chmod +x bin/my-skills.js`
Expected: The file is executable for local runs and npm packaging.

### Task 3: Verify the packaged CLI flow

**Files:**
- Verify only

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS with packaging tests and existing CLI tests green.

- [ ] **Step 2: Run TypeScript compilation**

Run: `npm run build`
Expected: PASS with `dist/` generated.

- [ ] **Step 3: Execute the built CLI directly**

Run: `node bin/my-skills.js validate`
Expected: output includes `validated 2 skills`.
