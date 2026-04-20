#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

function usage() {
  console.error("usage: node scripts/install-skill.mjs <repository> <skill-name> [target-dir]");
  process.exitCode = 1;
}

function parseRepository(repository) {
  const match = repository.match(/^([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)(?:#([A-Za-z0-9_.\-/]+))?$/);

  if (!match) {
    throw new Error(`Invalid repository: ${repository}`);
  }

  return {
    repo: match[1],
    ref: match[2] ?? "main"
  };
}

function validateRelativeInstallFile(file) {
  if (!file || file.startsWith("/") || file.split("/").includes("..")) {
    throw new Error(`Invalid install file path: ${file}`);
  }

  return file;
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchBytes(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function main() {
  const repository = process.argv[2];
  const skillName = process.argv[3];
  const targetDir = process.argv[4] ?? ".";

  if (!repository || !skillName) {
    usage();
    return;
  }

  const { repo, ref } = parseRepository(repository);
  const rawBase = (process.env.MY_SKILLS_GITHUB_RAW_BASE ?? "https://raw.githubusercontent.com")
    .replace(/\/$/, "");
  const registryUrl = `${rawBase}/${repo}/${ref}/registry/index.json`;
  const registryIndex = await fetchJson(registryUrl);
  const registryEntry = registryIndex.skills.find((skill) => skill.name === skillName);

  if (!registryEntry) {
    throw new Error(`Skill not found in registry: ${skillName}`);
  }

  const installedPath = join(targetDir, registryEntry.installPath);
  const installFiles = Array.from(new Set(["skill.json", ...registryEntry.files]));
  const skillBaseUrl = `${rawBase}/${repo}/${ref}/${registryEntry.path}`;

  await mkdir(installedPath, { recursive: true });

  for (const file of installFiles) {
    const safeFile = validateRelativeInstallFile(file);
    const content = await fetchBytes(`${skillBaseUrl}/${safeFile}`);
    const targetPath = join(installedPath, safeFile);

    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, content);
  }

  console.log(`installed ${registryEntry.name}@${registryEntry.version} to ${installedPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
