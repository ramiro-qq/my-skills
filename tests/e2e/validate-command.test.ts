import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("validate command", () => {
  it("validates skills, compatibility notes, and README install guidance", async () => {
    const result = await execFileAsync("node", [
      "--import",
      "tsx",
      "packages/cli/src/index.ts",
      "validate"
    ]);

    expect(result.stdout).toContain("validated example-skill@0.1.0");
    expect(result.stdout).toContain("validated integration-debug@0.1.0");
    expect(result.stdout).toContain("validated requirements-to-tech@0.1.0");
    expect(result.stdout).toContain("validated README install examples");
    expect(result.stdout).toContain("validated installation docs");
    expect(result.stdout).toContain("validated compatibility notes");
    expect(result.stdout).toContain("validated 3 skills");
  });
});
