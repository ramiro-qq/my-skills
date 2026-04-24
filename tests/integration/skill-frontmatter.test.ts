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

  it("supports published skills that use tags and richer metadata", async () => {
    const source = await readFile("skills/requirements-to-tech/SKILL.md", "utf8");

    const skill = parseSkillFrontmatter(source);

    expect(skill).toMatchObject({
      name: "requirements-to-tech",
      license: "MIT"
    });
    expect(skill.tags).toContain("requirements");
    expect(skill.metadata).toMatchObject({
      author: "ramiro.li",
      version: "0.0.4"
    });
  });

  it("loads the integration-debug skill metadata", async () => {
    const source = await readFile("skills/integration-debug/SKILL.md", "utf8");

    const skill = parseSkillFrontmatter(source);

    expect(skill).toMatchObject({
      name: "integration-debug",
      license: "MIT"
    });
    expect(skill.tags).toContain("integration");
    expect(skill.metadata).toMatchObject({
      author: "ramiro.li",
      version: "0.0.3"
    });
  });

  it("rejects a skill file without frontmatter metadata", () => {
    expect(() => parseSkillFrontmatter("# Missing metadata\n")).toThrow(/frontmatter/i);
  });
});
