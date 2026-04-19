import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { installSkill } from "../../packages/core/src/index.js";

const createdDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    createdDirs.splice(0).map(async (dir) => {
      await import("node:fs/promises").then(({ rm }) =>
        rm(dir, { recursive: true, force: true })
      );
    })
  );
});

describe("installSkill", () => {
  it("installs a skill from a local repository into the target project", async () => {
    const targetDir = await mkdtemp(join(tmpdir(), "my-skills-install-"));
    createdDirs.push(targetDir);

    const result = await installSkill({
      repository: ".",
      skillName: "requirements-to-tech",
      targetDir
    });

    const installedSkill = await readFile(
      join(targetDir, ".codex/skills/requirements-to-tech/SKILL.md"),
      "utf8"
    );
    const installedReference = await readFile(
      join(targetDir, ".codex/skills/requirements-to-tech/references/tech-plan-template.md"),
      "utf8"
    );
    const installedManifest = JSON.parse(
      await readFile(
        join(targetDir, ".codex/skills/requirements-to-tech/skill.json"),
        "utf8"
      )
    ) as { name: string; version: string };

    expect(result.name).toBe("requirements-to-tech");
    expect(result.version).toBe("0.1.0");
    expect(result.installedPath).toBe(join(targetDir, ".codex/skills/requirements-to-tech"));
    expect(installedSkill).toContain("Requirements To Tech Plan");
    expect(installedReference).toContain("技术方案模板");
    expect(installedManifest).toMatchObject({
      name: "requirements-to-tech",
      version: "0.1.0"
    });
  });
});
