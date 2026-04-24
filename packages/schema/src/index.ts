import { z } from "zod";

const skillFrontmatterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  metadata: z
    .object({
      internal: z.boolean().optional()
    })
    .optional()
});

export type SkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function coerceScalar(value: string): boolean | string {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return stripWrappingQuotes(value);
}

function parseFrontmatterBlock(frontmatter: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let nestedKey: string | null = null;

  for (const rawLine of frontmatter.split(/\r?\n/)) {
    if (!rawLine.trim()) {
      continue;
    }

    if (rawLine.startsWith("  ")) {
      if (!nestedKey) {
        throw new Error("Invalid frontmatter indentation");
      }

      const nestedMatch = rawLine.trim().match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

      if (!nestedMatch) {
        throw new Error(`Invalid nested frontmatter line: ${rawLine}`);
      }

      const parent = (result[nestedKey] ?? {}) as Record<string, unknown>;
      parent[nestedMatch[1]] = coerceScalar(nestedMatch[2]);
      result[nestedKey] = parent;
      continue;
    }

    const match = rawLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!match) {
      throw new Error(`Invalid frontmatter line: ${rawLine}`);
    }

    nestedKey = match[2] === "" ? match[1] : null;
    result[match[1]] = match[2] === "" ? {} : coerceScalar(match[2]);
  }

  return result;
}

export function parseSkillFrontmatter(source: string): SkillFrontmatter {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    throw new Error("Skill file is missing YAML frontmatter");
  }

  return skillFrontmatterSchema.parse(parseFrontmatterBlock(match[1]));
}
