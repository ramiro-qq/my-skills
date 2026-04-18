import { describe, expect, it } from "vitest";

import { parseSkillManifest } from "../../packages/schema/src/index.js";

describe("parseSkillManifest", () => {
  it("accepts a minimal valid skill manifest", () => {
    const manifest = parseSkillManifest({
      name: "example-skill",
      version: "0.1.0",
      entry: "SKILL.md"
    });

    expect(manifest.name).toBe("example-skill");
    expect(manifest.version).toBe("0.1.0");
    expect(manifest.entry).toBe("SKILL.md");
    expect(manifest.installPath).toBe(".codex/skills");
  });

  it("rejects a manifest with an invalid version", () => {
    expect(() =>
      parseSkillManifest({
        name: "example-skill",
        version: "latest",
        entry: "SKILL.md"
      })
    ).toThrow(/version/i);
  });
});
