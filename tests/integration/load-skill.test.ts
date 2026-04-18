import { describe, expect, it } from "vitest";

import { loadSkillManifest } from "../../packages/core/src/index.js";

describe("loadSkillManifest", () => {
  it("loads and parses a skill manifest from disk", async () => {
    const manifest = await loadSkillManifest("skills/example-skill/skill.json");

    expect(manifest.name).toBe("example-skill");
    expect(manifest.files).toEqual(["SKILL.md", "README.md"]);
  });
});
