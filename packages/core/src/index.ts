import {
  access,
  copyFile,
  mkdir,
  readFile,
  readdir,
  writeFile
} from "node:fs/promises";
import { dirname, join } from "node:path";

import { parseSkillManifest, type SkillManifest } from "../../schema/src/index.js";

export type LoadedSkillManifest = SkillManifest & {
  manifestPath: string;
  path: string;
};

export type RegistryIndex = {
  skills: Array<{
    name: string;
    version: string;
    description?: string;
    entry: string;
    files: string[];
    installPath: string;
    path: string;
  }>;
};

export type RepositorySource =
  | {
      type: "local";
      rootDir: string;
    }
  | {
      type: "github";
      repo: string;
      ref: string;
    };

export type InstallSkillOptions = {
  repository: string;
  skillName: string;
  targetDir: string;
};

export type InstallSkillResult = {
  name: string;
  version: string;
  installedPath: string;
};

export type PublishRepositoryOptions = {
  skillsDir: string;
  registryPath: string;
};

export type PublishRepositoryResult = {
  registryPath: string;
  skillCount: number;
  skills: Array<{
    name: string;
    version: string;
  }>;
};

export async function loadSkillManifest(filePath: string): Promise<SkillManifest> {
  const raw = await readFile(filePath, "utf8");
  return parseSkillManifest(JSON.parse(raw));
}

export async function loadAllSkillManifests(rootDir: string): Promise<LoadedSkillManifest[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const manifests: LoadedSkillManifest[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) {
      continue;
    }

    const manifestPath = join(rootDir, entry.name, "skill.json");

    try {
      await access(manifestPath);
    } catch {
      continue;
    }

    const manifest = await loadSkillManifest(manifestPath);
    manifests.push({
      ...manifest,
      manifestPath,
      path: join(rootDir, entry.name)
    });
  }

  return manifests.sort((left, right) => left.name.localeCompare(right.name));
}

export async function buildRegistryIndex(rootDir: string): Promise<RegistryIndex> {
  const manifests = await loadAllSkillManifests(rootDir);

  return {
    skills: manifests.map(({ name, version, description, entry, files, installPath, path }) => ({
      name,
      version,
      description,
      entry,
      files,
      installPath,
      path
    }))
  };
}

export async function writeRegistryIndex(
  rootDir: string,
  outputPath: string
): Promise<RegistryIndex> {
  const registryIndex = await buildRegistryIndex(rootDir);
  const serialized = `${JSON.stringify(registryIndex, null, 2)}\n`;

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized, "utf8");

  return registryIndex;
}

export function parseRepositorySource(repository: string): RepositorySource {
  const githubMatch = repository.match(/^([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)(?:#([A-Za-z0-9_.\-/]+))?$/);

  if (
    repository.startsWith(".") ||
    repository.startsWith("/") ||
    repository.startsWith("file:") ||
    !githubMatch
  ) {
    return {
      type: "local",
      rootDir: repository
    };
  }

  return {
    type: "github",
    repo: githubMatch[1],
    ref: githubMatch[2] ?? "main"
  };
}

async function readRegistryIndexFromLocalRepo(rootDir: string): Promise<RegistryIndex> {
  const registryPath = join(rootDir, "registry", "index.json");

  try {
    const raw = await readFile(registryPath, "utf8");
    return JSON.parse(raw) as RegistryIndex;
  } catch {
    return buildRegistryIndex(join(rootDir, "skills"));
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function loadRegistryIndexFromSource(source: RepositorySource): Promise<RegistryIndex> {
  if (source.type === "local") {
    return readRegistryIndexFromLocalRepo(source.rootDir);
  }

  const baseUrl = `https://raw.githubusercontent.com/${source.repo}/${source.ref}`;
  return fetchJson<RegistryIndex>(`${baseUrl}/registry/index.json`);
}

function validateRelativeInstallFile(file: string): string {
  if (!file || file.startsWith("/") || file.split("/").includes("..")) {
    throw new Error(`Invalid install file path: ${file}`);
  }

  return file;
}

async function installFromLocalSource(
  rootDir: string,
  skillPath: string,
  installFiles: string[],
  destinationDir: string
): Promise<void> {
  for (const file of installFiles) {
    const safeFile = validateRelativeInstallFile(file);
    const sourcePath = join(rootDir, skillPath, safeFile);
    const targetPath = join(destinationDir, safeFile);

    await mkdir(dirname(targetPath), { recursive: true });
    await copyFile(sourcePath, targetPath);
  }
}

async function installFromGitHubSource(
  repo: string,
  ref: string,
  skillPath: string,
  installFiles: string[],
  destinationDir: string
): Promise<void> {
  const baseUrl = `https://raw.githubusercontent.com/${repo}/${ref}/${skillPath}`;

  for (const file of installFiles) {
    const safeFile = validateRelativeInstallFile(file);
    const targetPath = join(destinationDir, safeFile);
    const content = await fetchBytes(`${baseUrl}/${safeFile}`);

    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, content);
  }
}

export async function installSkill(options: InstallSkillOptions): Promise<InstallSkillResult> {
  const source = parseRepositorySource(options.repository);
  const registryIndex = await loadRegistryIndexFromSource(source);
  const registryEntry = registryIndex.skills.find((skill) => skill.name === options.skillName);

  if (!registryEntry) {
    throw new Error(`Skill not found in registry: ${options.skillName}`);
  }

  const installedPath = join(options.targetDir, registryEntry.installPath);
  const installFiles = Array.from(new Set(["skill.json", ...registryEntry.files]));

  await mkdir(installedPath, { recursive: true });

  if (source.type === "local") {
    await installFromLocalSource(source.rootDir, registryEntry.path, installFiles, installedPath);
  } else {
    await installFromGitHubSource(
      source.repo,
      source.ref,
      registryEntry.path,
      installFiles,
      installedPath
    );
  }

  return {
    name: registryEntry.name,
    version: registryEntry.version,
    installedPath
  };
}

export async function publishRepository(
  options: PublishRepositoryOptions
): Promise<PublishRepositoryResult> {
  const manifests = await loadAllSkillManifests(options.skillsDir);
  await writeRegistryIndex(options.skillsDir, options.registryPath);

  return {
    registryPath: options.registryPath,
    skillCount: manifests.length,
    skills: manifests.map(({ name, version }) => ({
      name,
      version
    }))
  };
}
