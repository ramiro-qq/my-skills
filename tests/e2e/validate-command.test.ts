import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("validate command", () => {
  it("validates every skill in the skills directory", async () => {
    const result = await execFileAsync("node", [
      "--import",
      "tsx",
      "packages/cli/src/index.ts",
      "validate"
    ]);

    expect(result.stdout).toContain("validated example-skill@0.1.0");
    expect(result.stdout).toContain("validated review-notes@0.1.0");
    expect(result.stdout).toContain("validated 2 skills");
  });
});
