import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("publish command", () => {
  it("validates skills and rewrites the registry index", async () => {
    const result = await execFileAsync("node", [
      "--import",
      "tsx",
      "packages/cli/src/index.ts",
      "publish"
    ]);

    const registryIndex = JSON.parse(
      await readFile("registry/index.json", "utf8")
    ) as {
      skills: Array<{ name: string }>;
    };

    expect(result.stdout).toContain("published 2 skills");
    expect(result.stdout).toContain("registry/index.json");
    expect(registryIndex.skills.map((skill) => skill.name)).toEqual([
      "example-skill",
      "review-notes"
    ]);
  });
});
