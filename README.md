# my-skills

一个面向 `skills.sh` 生态的 Agent Skills 内容仓库。

这个仓库只维护标准 `SKILL.md` 技能内容、参考资料和多 Agent 使用说明，不再提供自定义安装器、registry 或 bootstrap 分发脚本。

## 安装

安装整个仓库里的已发布 skills：

```bash
npx skills add ramiro-qq/my-skills
```

只查看当前仓库可发现的 skills：

```bash
npx skills add ramiro-qq/my-skills --list
```

只安装一个 skill：

```bash
npx skills add ramiro-qq/my-skills --skill requirements-to-tech
```

按指定 Agent 安装：

```bash
npx skills add ramiro-qq/my-skills --agent codex --agent claude-code
```

如果当前目录就是仓库本地副本，也可以直接用本地路径做 smoke test：

```bash
npx skills add . --list
```

## 仓库结构

正式发布的 skills 只放在 `skills/` 下，并通过 `SKILL.md` frontmatter 暴露元数据。

```text
skills/
  example-skill/
    SKILL.md
    README.md
  requirements-to-tech/
    SKILL.md
    references/
docs/ideas/
```

- `skills/`: 正式发布的 skills
- `docs/ideas/`: 草稿、原始方案和未发布想法，不参与对外 skills 发现

## 当前 Skills

| Skill | Description | Primary Use Case |
| --- | --- | --- |
| `example-skill` | 最小可发布 skill 模板。 | 新建 skill 时参考目录结构、frontmatter 和兼容说明写法。 |
| `requirements-to-tech` | 把需求文档或功能说明转成可审阅的技术方案。 | 需要先完成技术调研、技术选型、影响分析，再进入实现。 |

## Multi-Agent Compatibility

| Agent | Install Target | Expected Behavior |
| --- | --- | --- |
| Codex | `npx skills add ramiro-qq/my-skills --agent codex` | 优先验证。必要时在 skill 内标注 Codex 专属工具名，并提供通用降级说明。 |
| Claude Code | `npx skills add ramiro-qq/my-skills --agent claude-code` | 使用相同 skill 内容，按技能内的 Agent Notes 替换工具调用或工作流表达。 |
| Cursor / generic `.agents` consumers | `npx skills add ramiro-qq/my-skills --agent cursor` | 依赖标准 `SKILL.md` 发现与安装，不假设 Codex 专属目录结构。 |

## Authoring Rules

- `SKILL.md` frontmatter 是唯一权威元数据源，至少包含 `name` 和 `description`
- 兼容性说明必须写在 skill 正文的 `Agent Notes` 或 `Compatibility` 段落中
- 不要在 skill 主流程里硬编码安装路径
- 附属资料可以放在 `README.md`、`references/`、`scripts/`、`assets/`

## 本地校验

```bash
npm install
npm run validate
npm test
```

`npm run validate` 只校验仓库内容质量：

- `SKILL.md` frontmatter 可解析
- README 安装示例对齐 `skills` CLI
- 每个已发布 skill 都有多 Agent 兼容说明
- 仓库中不存在旧的 installer、registry 或旧 manifest 残留
