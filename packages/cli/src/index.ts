import {
  installSkill,
  loadAllSkillManifests,
  publishRepository,
  writeRegistryIndex
} from "../../core/src/index.js";

async function main() {
  const command = process.argv[2];

  if (command === "validate") {
    const manifests = await loadAllSkillManifests("skills");

    for (const manifest of manifests) {
      console.log(`validated ${manifest.name}@${manifest.version}`);
    }

    console.log(`validated ${manifests.length} skills`);
    return;
  }

  if (command === "build-registry") {
    const registryIndex = await writeRegistryIndex("skills", "registry/index.json");
    console.log(`wrote registry/index.json with ${registryIndex.skills.length} skills`);
    return;
  }

  if (command === "install") {
    const repository = process.argv[3];
    const skillName = process.argv[4];
    const targetDir = process.argv[5] ?? ".";

    if (!repository || !skillName) {
      console.error("usage: install <repository> <skill-name> [target-dir]");
      process.exitCode = 1;
      return;
    }

    const result = await installSkill({
      repository,
      skillName,
      targetDir
    });

    console.log(`installed ${result.name}@${result.version} to ${result.installedPath}`);
    return;
  }

  if (command === "publish") {
    const result = await publishRepository({
      skillsDir: "skills",
      registryPath: "registry/index.json"
    });

    for (const skill of result.skills) {
      console.log(`published ${skill.name}@${skill.version}`);
    }

    console.log(`published ${result.skillCount} skills to ${result.registryPath}`);
    return;
  }

  console.error("unknown command");
  process.exitCode = 1;
}

void main();
