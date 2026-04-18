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
      skillName: "review-notes",
      targetDir
    });

    const installedSkill = await readFile(
      join(targetDir, ".codex/skills/review-notes/SKILL.md"),
      "utf8"
    );
    const installedManifest = JSON.parse(
      await readFile(join(targetDir, ".codex/skills/review-notes/skill.json"), "utf8")
    ) as { name: string; version: string };

    expect(result.name).toBe("review-notes");
    expect(result.version).toBe("0.1.0");
    expect(result.installedPath).toBe(join(targetDir, ".codex/skills/review-notes"));
    expect(installedSkill).toContain("Review Notes");
    expect(installedManifest).toMatchObject({
      name: "review-notes",
      version: "0.1.0"
    });
  });
});
