import { z } from "zod";

const skillManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().min(1).optional(),
  entry: z.string().min(1),
  files: z.array(z.string().min(1)).default([]),
  installPath: z.string().min(1).default(".codex/skills")
});

export type SkillManifest = z.infer<typeof skillManifestSchema>;

export function parseSkillManifest(input: unknown): SkillManifest {
  return skillManifestSchema.parse(input);
}
