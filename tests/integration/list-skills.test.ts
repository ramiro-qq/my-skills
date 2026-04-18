import { describe, expect, it } from "vitest";

import { loadAllSkillManifests } from "../../packages/core/src/index.js";

describe("loadAllSkillManifests", () => {
  it("loads every formal skill from the skills directory", async () => {
    const manifests = await loadAllSkillManifests("skills");

    expect(manifests.map((item) => item.name)).toEqual([
      "example-skill",
      "review-notes"
    ]);
  });
});
