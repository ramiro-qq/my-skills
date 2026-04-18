import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("package contents", () => {
  it("does not include compiled test files in the published tarball", async () => {
    const result = await execFileAsync("npm", ["pack", "--dry-run"], {
      env: {
        ...process.env,
        npm_config_cache: "/tmp/my-skills-test-pack-cache"
      }
    });

    const output = `${result.stdout}\n${result.stderr}`;

    expect(output).not.toContain("dist/tests/");
  });
});
