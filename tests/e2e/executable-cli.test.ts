import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("my-skills executable", () => {
  it("runs validate through the packaged bin entry", async () => {
    await execFileAsync("npm", ["run", "build"]);

    const result = await execFileAsync("node", ["bin/my-skills.js", "validate"]);

    expect(result.stdout).toContain("validated example-skill@0.1.0");
    expect(result.stdout).toContain("validated review-notes@0.1.0");
    expect(result.stdout).toContain("validated 2 skills");
  });
});
