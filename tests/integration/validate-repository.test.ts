import { describe, expect, it } from "vitest";

import { validateRepository } from "../../packages/core/src/index.js";

describe("validateRepository", () => {
  it("accepts the repository when docs and skills follow the new contract", async () => {
    const report = await validateRepository(".");

    expect(report.errors).toEqual([]);
    expect(report.skills.map((skill) => skill.name)).toEqual([
      "design-to-code",
      "example-skill",
      "integration-debug",
      "requirements-to-tech"
    ]);
  });
});
