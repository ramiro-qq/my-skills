import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

describe("package metadata", () => {
  it("exposes a publishable CLI package", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      private?: boolean;
      version?: string;
      bin?: Record<string, string>;
      files?: string[];
      scripts?: Record<string, string>;
    };

    expect(packageJson.private).toBe(false);
    expect(packageJson.version).toBe("0.1.0");
    expect(packageJson.bin).toEqual({
      "my-skills": "./bin/my-skills.js"
    });
    expect(packageJson.files).toEqual(["bin", "dist", "skills", "registry", "README.md"]);
    expect(packageJson.scripts?.prepack).toBe("npm run build");
  });
});
