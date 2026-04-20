import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const createdDirs: string[] = [];

afterEach(async () => {
  await Promise.all(createdDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("bootstrap install script", () => {
  it("installs a named skill from a raw GitHub-style source without npm package bootstrap", async () => {
    const targetDir = await mkdtemp(join(tmpdir(), "my-skills-bootstrap-install-"));
    createdDirs.push(targetDir);

    const server = createServer(async (request, response) => {
      const url = request.url ?? "/";

      if (url === "/ramiro-qq/my-skills/main/registry/index.json") {
        response.setHeader("content-type", "application/json");
        response.end(
          JSON.stringify({
            skills: [
              {
                name: "requirements-to-tech",
                version: "0.1.0",
                description: "Bootstrap fixture.",
                entry: "SKILL.md",
                files: ["SKILL.md", "references/tech-plan-template.md"],
                installPath: ".codex/skills/requirements-to-tech",
                path: "skills/requirements-to-tech"
              }
            ]
          })
        );
        return;
      }

      if (url === "/ramiro-qq/my-skills/main/skills/requirements-to-tech/SKILL.md") {
        response.setHeader("content-type", "text/markdown; charset=utf-8");
        response.end("# Requirements To Tech\n");
        return;
      }

      if (
        url === "/ramiro-qq/my-skills/main/skills/requirements-to-tech/references/tech-plan-template.md"
      ) {
        response.setHeader("content-type", "text/markdown; charset=utf-8");
        response.end("# 技术方案模板\n");
        return;
      }

      if (url === "/ramiro-qq/my-skills/main/skills/requirements-to-tech/skill.json") {
        response.setHeader("content-type", "application/json");
        response.end(
          JSON.stringify({
            name: "requirements-to-tech",
            version: "0.1.0",
            entry: "SKILL.md"
          })
        );
        return;
      }

      response.statusCode = 404;
      response.end("not found");
    });

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });

    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;

    try {
      const result = await execFileAsync("node", [
        "scripts/install-skill.mjs",
        "ramiro-qq/my-skills",
        "requirements-to-tech",
        targetDir
      ], {
        env: {
          ...process.env,
          MY_SKILLS_GITHUB_RAW_BASE: `http://127.0.0.1:${port}`
        }
      });

      const installedSkill = await readFile(
        join(targetDir, ".codex/skills/requirements-to-tech/SKILL.md"),
        "utf8"
      );
      const installedTemplate = await readFile(
        join(
          targetDir,
          ".codex/skills/requirements-to-tech/references/tech-plan-template.md"
        ),
        "utf8"
      );

      expect(result.stdout).toContain("installed requirements-to-tech@0.1.0");
      expect(installedSkill).toContain("Requirements To Tech");
      expect(installedTemplate).toContain("技术方案模板");
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  });
});
