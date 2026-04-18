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
      "example-skill",
      targetDir
    ]);

    const installedSkill = await readFile(
      join(targetDir, ".codex/skills/example-skill/SKILL.md"),
      "utf8"
    );

    expect(result.stdout).toContain("installed example-skill@0.1.0");
    expect(installedSkill).toContain("Example Skill");
  });
});
