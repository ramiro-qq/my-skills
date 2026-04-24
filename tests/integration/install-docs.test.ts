import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

describe("install docs", () => {
  it("documents skills.sh source formats and Codex install presets", async () => {
    const doc = await readFile("docs/install.md", "utf8");

    expect(doc).toContain("npx skills add ramiro-qq/my-skills");
    expect(doc).toContain("npx skills add https://github.com/ramiro-qq/my-skills");
    expect(doc).toContain("npx skills add . --list");
    expect(doc).toContain("--agent codex --copy -y");
    expect(doc).toContain("npx skills list -a codex");
    expect(doc).toContain("remove --agent codex");
    expect(doc).toContain("返回 success，但实际文件和 `skills-lock.json` 记录仍然保留");
  });
});
