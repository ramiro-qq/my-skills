import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { installSkill } from "../../packages/core/src/index.js";

const createdDirs: string[] = [];
const originalFetch = globalThis.fetch;

afterEach(async () => {
  globalThis.fetch = originalFetch;
  await Promise.all(createdDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("installSkill from GitHub source", () => {
  it("preserves remote asset bytes when installing from a GitHub repository", async () => {
    const targetDir = await mkdtemp(join(tmpdir(), "my-skills-github-install-"));
    createdDirs.push(targetDir);

    const binaryAsset = Uint8Array.from([0, 1, 2, 200, 255]);

    globalThis.fetch = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);

      if (url.endsWith("/registry/index.json")) {
        return new Response(
          JSON.stringify({
            skills: [
              {
                name: "github-skill",
                version: "0.2.0",
                description: "Remote skill fixture.",
                entry: "SKILL.md",
                files: ["SKILL.md", "README.md", "assets/logo.bin"],
                installPath: ".codex/skills/github-skill",
                path: "skills/github-skill"
              }
            ]
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json"
            }
          }
        );
      }

      if (url.endsWith("/skills/github-skill/SKILL.md")) {
        return new Response("# GitHub Skill\n", { status: 200 });
      }

      if (url.endsWith("/skills/github-skill/README.md")) {
        return new Response("# github-skill\n", { status: 200 });
      }

      if (url.endsWith("/skills/github-skill/skill.json")) {
        return new Response(
          JSON.stringify({
            name: "github-skill",
            version: "0.2.0",
            entry: "SKILL.md"
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json"
            }
          }
        );
      }

      if (url.endsWith("/skills/github-skill/assets/logo.bin")) {
        return new Response(binaryAsset, {
          status: 200,
          headers: {
            "content-type": "application/octet-stream"
          }
        });
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const result = await installSkill({
      repository: "openai/my-skills#main",
      skillName: "github-skill",
      targetDir
    });

    const installedAsset = await readFile(
      join(targetDir, ".codex/skills/github-skill/assets/logo.bin")
    );

    expect(result.name).toBe("github-skill");
    expect(result.version).toBe("0.2.0");
    expect(Array.from(installedAsset)).toEqual(Array.from(binaryAsset));
  });
});
