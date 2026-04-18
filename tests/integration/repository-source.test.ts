import { describe, expect, it } from "vitest";

import { parseRepositorySource } from "../../packages/core/src/index.js";

describe("parseRepositorySource", () => {
  it("treats a local path as a local repository source", () => {
    const source = parseRepositorySource(".");

    expect(source).toEqual({
      type: "local",
      rootDir: "."
    });
  });

  it("parses a GitHub repository slug with an explicit ref", () => {
    const source = parseRepositorySource("openai/my-skills#release");

    expect(source).toEqual({
      type: "github",
      repo: "openai/my-skills",
      ref: "release"
    });
  });
});
