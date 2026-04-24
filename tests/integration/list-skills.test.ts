import { describe, expect, it } from "vitest";

import { loadPublishedSkills } from "../../packages/core/src/index.js";

describe("loadPublishedSkills", () => {
  it("loads every published skill from SKILL.md metadata", async () => {
    const skills = await loadPublishedSkills("skills");

    expect(skills.map((item) => item.name)).toEqual([
      "example-skill",
      "integration-debug",
      "requirements-to-tech"
    ]);
  });
});
