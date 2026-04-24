import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const createdDirs: string[] = [];

afterEach(async () => {
  await Promise.all(createdDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("skills CLI codex install", () => {
  it(
    "installs a published skill into the Codex project target using the public CLI flow",
    async () => {
      const targetDir = await mkdtemp(join(tmpdir(), "my-skills-codex-install-"));
      createdDirs.push(targetDir);

      const result = await execFileAsync(
        "npx",
        [
          "--yes",
          "skills",
          "add",
          "/Users/ramiroli/root/apps/github/my-skills",
          "--skill",
          "requirements-to-tech",
          "--agent",
          "codex",
          "--copy",
          "-y"
        ],
        {
          cwd: targetDir
        }
      );

      const installedSkill = await readFile(
        join(targetDir, ".agents/skills/requirements-to-tech/SKILL.md"),
        "utf8"
      );
      const installedReference = await readFile(
        join(targetDir, ".agents/skills/requirements-to-tech/references/tech-plan-template.md"),
        "utf8"
      );

      expect(result.stdout).toContain("requirements-to-tech");
      expect(installedSkill).toContain("# Requirements To Tech Plan");
      expect(installedReference).toContain("技术方案模板");
    },
    120000
  );
});
