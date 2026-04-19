import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { afterEach, describe, expect, it, vi } from "vitest";

import { installSkill } from "../../packages/core/src/index.js";

const execFileAsync = promisify(execFile);
const createdDirs: string[] = [];
const originalFetch = globalThis.fetch;
const originalGitBase = process.env.MY_SKILLS_GITHUB_GIT_BASE;

afterEach(async () => {
  globalThis.fetch = originalFetch;
  if (originalGitBase === undefined) {
    delete process.env.MY_SKILLS_GITHUB_GIT_BASE;
  } else {
    process.env.MY_SKILLS_GITHUB_GIT_BASE = originalGitBase;
  }
  await Promise.all(createdDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("installSkill GitHub fallback", () => {
  it(
    "falls back to git clone when remote fetch fails",
    async () => {
      const targetDir = await mkdtemp(join(tmpdir(), "my-skills-github-fallback-target-"));
      const gitBaseDir = await mkdtemp(join(tmpdir(), "my-skills-github-fallback-base-"));
      const ownerDir = join(gitBaseDir, "ramiro-qq");
      const bareRepoDir = join(ownerDir, "my-skills.git");

      createdDirs.push(targetDir, gitBaseDir);

      await import("node:fs/promises").then(({ mkdir }) => mkdir(ownerDir, { recursive: true }));
      await execFileAsync("git", [
        "clone",
        "--bare",
        "/Users/ramiroli/root/apps/github/my-skills",
        bareRepoDir
      ]);

      process.env.MY_SKILLS_GITHUB_GIT_BASE = `file://${gitBaseDir}`;
      globalThis.fetch = vi.fn(async () => {
        throw new TypeError("fetch failed");
      }) as typeof fetch;

      const result = await installSkill({
        repository: "ramiro-qq/my-skills#main",
        skillName: "example-skill",
        targetDir
      });

      const installedSkill = await readFile(
        join(targetDir, ".codex/skills/example-skill/SKILL.md"),
        "utf8"
      );

      expect(result.name).toBe("example-skill");
      expect(result.version).toBe("0.1.0");
      expect(installedSkill).toContain("Example Skill");
    },
    30000
  );
});
