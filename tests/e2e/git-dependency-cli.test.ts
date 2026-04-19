import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const createdDirs: string[] = [];

afterEach(async () => {
  await Promise.all(createdDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("git dependency cli", () => {
  it.skip(
    "runs my-skills after installing the repository as a git dependency",
    async () => {
      const tempDir = await mkdtemp(join(tmpdir(), "my-skills-gitdep-test-"));
      createdDirs.push(tempDir);

      await execFileAsync("npm", ["init", "-y"], {
        cwd: tempDir,
        env: {
          ...process.env,
          npm_config_cache: "/tmp/my-skills-test-gitdep-cache"
        }
      });

      await execFileAsync(
        "npm",
        ["install", "git+file:///Users/ramiroli/root/apps/github/my-skills"],
        {
          cwd: tempDir,
          env: {
            ...process.env,
            npm_config_cache: "/tmp/my-skills-test-gitdep-cache"
          }
        }
      );

      const result = await execFileAsync("npx", ["my-skills", "validate"], {
        cwd: tempDir
      });

      expect(result.stdout).toContain("validated 2 skills");
    },
    30000
  );
});
