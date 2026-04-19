import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("build-registry command", () => {
  it("writes a registry index for every formal skill", async () => {
    await execFileAsync("node", [
      "--import",
      "tsx",
      "packages/cli/src/index.ts",
      "build-registry"
    ]);

    const raw = await readFile("registry/index.json", "utf8");
    const index = JSON.parse(raw) as {
      skills: Array<{ name: string; version: string; path: string }>;
    };

    expect(index.skills).toEqual([
      {
        description: "A minimal example skill used to validate repository conventions.",
        entry: "SKILL.md",
        files: ["SKILL.md", "README.md"],
        installPath: ".codex/skills/example-skill",
        name: "example-skill",
        version: "0.1.0",
        path: "skills/example-skill"
      },
      {
        description:
          "Use when turning product requirements, feature briefs, or demand docs into a technical solution proposal that must compare options, align with existing architecture, inspect the current codebase, optionally analyze UI design inputs, and write a project-specific architecture document before any coding begins.",
        entry: "SKILL.md",
        files: ["SKILL.md", "references/tech-plan-template.md"],
        installPath: ".codex/skills/requirements-to-tech",
        name: "requirements-to-tech",
        version: "0.1.0",
        path: "skills/requirements-to-tech"
      }
    ]);
  });
});
