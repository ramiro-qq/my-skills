import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { parseSkillFrontmatter } from "../../packages/schema/src/index.js";

describe("parseSkillFrontmatter", () => {
  it("loads required metadata from a SKILL.md frontmatter block", async () => {
    const source = await readFile("skills/example-skill/SKILL.md", "utf8");

    const skill = parseSkillFrontmatter(source);

    expect(skill).toMatchObject({
      name: "example-skill"
    });
    expect(skill.description).toContain("minimum");
  });

  it("rejects a skill file without frontmatter metadata", () => {
    expect(() => parseSkillFrontmatter("# Missing metadata\n")).toThrow(/frontmatter/i);
  });
});
