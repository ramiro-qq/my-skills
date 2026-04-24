import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

import { parseSkillFrontmatter, type SkillFrontmatter } from "../../schema/src/index.js";

export type LoadedSkill = SkillFrontmatter & {
  path: string;
  sourcePath: string;
};

export type ValidationReport = {
  errors: string[];
  skills: LoadedSkill[];
};

const requiredReadmeSnippets = [
  "npx skills add ramiro-qq/my-skills",
  "npx skills add ramiro-qq/my-skills --list",
  "npx skills add ramiro-qq/my-skills --skill requirements-to-tech",
  "npx skills add ramiro-qq/my-skills --agent codex --agent claude-code"
];

const legacyReadmePatterns = [
  "my-skills install",
  "install-skill.mjs",
  "registry/index.json",
  "skill.json"
];

function hasCompatibilityNotes(source: string): boolean {
  return /##\s+(Agent Notes|Compatibility)/i.test(source);
}

async function readRepositoryVersion(rootDir: string): Promise<string> {
  const packageJson = JSON.parse(await readFile(join(rootDir, "package.json"), "utf8")) as {
    version?: string;
  };

  return packageJson.version ?? "0.0.0";
}

export async function loadPublishedSkills(rootDir: string): Promise<LoadedSkill[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const skills: LoadedSkill[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) {
      continue;
    }

    const sourcePath = join(rootDir, entry.name, "SKILL.md");
    let source: string;

    try {
      source = await readFile(sourcePath, "utf8");
    } catch {
      continue;
    }

    const skill = parseSkillFrontmatter(source);

    if (skill.metadata?.internal) {
      continue;
    }

    skills.push({
      ...skill,
      path: join(rootDir, entry.name),
      sourcePath
    });
  }

  return skills.sort((left, right) => left.name.localeCompare(right.name));
}

async function collectLegacyFiles(rootDir: string): Promise<string[]> {
  const legacyFiles: string[] = [];
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = join(rootDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") {
        continue;
      }

      legacyFiles.push(...(await collectLegacyFiles(absolutePath)));
      continue;
    }

    if (
      entry.name === "skill.json" ||
      absolutePath.endsWith("registry/index.json") ||
      absolutePath.endsWith("scripts/install-skill.mjs")
    ) {
      legacyFiles.push(absolutePath);
    }
  }

  return legacyFiles;
}

export async function validateRepository(rootDir: string): Promise<ValidationReport> {
  const skillsRoot = join(rootDir, "skills");
  const skills = await loadPublishedSkills(skillsRoot);
  const errors: string[] = [];
  const readme = await readFile(join(rootDir, "README.md"), "utf8");

  for (const snippet of requiredReadmeSnippets) {
    if (!readme.includes(snippet)) {
      errors.push(`README is missing install example: ${snippet}`);
    }
  }

  for (const pattern of legacyReadmePatterns) {
    if (readme.includes(pattern)) {
      errors.push(`README still references legacy distribution detail: ${pattern}`);
    }
  }

  if (!readme.includes("| Agent |") || !readme.includes("Codex") || !readme.includes("Claude Code")) {
    errors.push("README is missing the multi-agent compatibility matrix");
  }

  for (const skill of skills) {
    const source = await readFile(skill.sourcePath, "utf8");

    if (!hasCompatibilityNotes(source)) {
      errors.push(`${skill.name} is missing Agent Notes / Compatibility guidance`);
    }
  }

  const legacyFiles = await collectLegacyFiles(rootDir);

  if (legacyFiles.length > 0) {
    errors.push(`Repository still contains legacy installer artifacts: ${legacyFiles.join(", ")}`);
  }

  return {
    errors,
    skills
  };
}

export async function loadRepositoryVersion(rootDir: string): Promise<string> {
  return readRepositoryVersion(rootDir);
}
