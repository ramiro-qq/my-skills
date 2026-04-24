import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("skills CLI discovery", () => {
  it(
    "lists the repository skills through the public skills CLI",
    async () => {
      const result = await execFileAsync(
        "npx",
        ["--yes", "skills", "add", ".", "--list"],
        {
          cwd: process.cwd()
        }
      );

      expect(result.stdout).toContain("example-skill");
      expect(result.stdout).toContain("requirements-to-tech");
    },
    120000
  );
});
