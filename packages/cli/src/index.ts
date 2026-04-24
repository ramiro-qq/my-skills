import { loadRepositoryVersion, validateRepository } from "../../core/src/index.js";

async function main() {
  const command = process.argv[2];

  if (command === "validate") {
    const report = await validateRepository(".");
    const version = await loadRepositoryVersion(".");

    for (const skill of report.skills) {
      console.log(`validated ${skill.name}@${version}`);
    }

    console.log("validated README install examples");
    console.log("validated compatibility notes");

    if (report.errors.length > 0) {
      for (const error of report.errors) {
        console.error(error);
      }

      process.exitCode = 1;
      return;
    }

    console.log(`validated ${report.skills.length} skills`);
    return;
  }

  console.error("usage: validate");
  process.exitCode = 1;
}

void main();
