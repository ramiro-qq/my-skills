import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

describe("package metadata", () => {
  it("keeps npm metadata private and scoped to local validation tooling", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      private?: boolean;
      version?: string;
      bin?: Record<string, string>;
      files?: string[];
      dependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };

    expect(packageJson.private).toBe(true);
    expect(packageJson.bin).toBeUndefined();
    expect(packageJson.files).toBeUndefined();
    expect(packageJson.dependencies?.zod).toBe("^4.1.12");
    expect(packageJson.scripts?.validate).toBe("node --import tsx packages/cli/src/index.ts validate");
    expect(packageJson.scripts?.prepare).toBeUndefined();
    expect(packageJson.scripts?.prepack).toBeUndefined();
  });
});
