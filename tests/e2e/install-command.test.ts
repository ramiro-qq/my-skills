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

describe("install command", () => {
  it("installs a named skill into a target project", async () => {
    const targetDir = await mkdtemp(join(tmpdir(), "my-skills-cli-install-"));
    createdDirs.push(targetDir);

    const result = await execFileAsync("node", [
      "--import",
      "tsx",
      "packages/cli/src/index.ts",
      "install",
      ".",
      "requirements-to-tech",
      targetDir
    ]);

    const installedSkill = await readFile(
      join(targetDir, ".codex/skills/requirements-to-tech/SKILL.md"),
      "utf8"
    );
    const installedReference = await readFile(
      join(targetDir, ".codex/skills/requirements-to-tech/references/tech-plan-template.md"),
      "utf8"
    );

    expect(result.stdout).toContain("installed requirements-to-tech@0.1.0");
    expect(installedSkill).toContain("Requirements To Tech Plan");
    expect(installedReference).toContain("技术可行性分析");
  });
});
