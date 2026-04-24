# my-skills

一个面向 `skills.sh` 生态的 Agent Skills 内容仓库。

这个仓库只维护标准 `SKILL.md` 技能内容、参考资料和多 Agent 使用说明，不再提供自定义安装器、registry 或 bootstrap 分发脚本。

## Quick Start

安装整个仓库里的已发布 skills：

```bash
npx skills add ramiro-qq/my-skills
```

查看当前仓库可发现的 skills：

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

本地仓库 smoke test：

```bash
npx skills add . --list
```

## Source Formats

安装入口跟随 `skills.sh`，推荐支持下面三种 source 形态：

```bash
# GitHub shorthand
npx skills add ramiro-qq/my-skills

# Full GitHub URL
npx skills add https://github.com/ramiro-qq/my-skills

# Local path
npx skills add .
```

如果你在排查仓库可发现性，优先用本地路径。  
如果你在给外部用户写安装说明，优先用 GitHub shorthand。

## Verified Install Flows

下面这些路径已经在本仓库本地通过真实 `skills` CLI 验证：

```bash
# 列出本仓库可发现的 skills
npx skills add . --list

# 远程 shorthand + 单 skill + Codex
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -y

# 完整 GitHub URL + 单 skill + Codex
npx skills add https://github.com/ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -y

# 本地路径 + 单 skill + Codex
npx skills add /path/to/my-skills --skill requirements-to-tech --agent codex --copy -y

# 本地路径 + 单 skill + Claude Code
npx skills add /path/to/my-skills --skill requirements-to-tech --agent claude-code --copy -y

# 本地路径 + 单 skill + Cursor / generic .agents consumers
npx skills add /path/to/my-skills --skill requirements-to-tech --agent cursor --copy -y

# 本地路径 + 全量 published skills + Codex
npx skills add /path/to/my-skills --skill '*' --agent codex --copy -y
```

如果你只是想确认仓库结构是否被 `skills` CLI 正确识别，优先使用 `--list`。  
如果你需要做安装回归，优先使用 `--skill <name> --agent <agent> --copy -y`，这样结果最稳定、最容易检查。

## Codex Presets

面向 Codex 的推荐安装和验证命令固定为下面几条：

```bash
# 远程 shorthand：安装一个 skill 到当前项目
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -y

# 完整 GitHub URL：安装一个 skill 到当前项目
npx skills add https://github.com/ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -y

# 本地路径：安装一个 skill 到当前项目
npx skills add /path/to/my-skills --skill requirements-to-tech --agent codex --copy -y

# 本地路径：安装全部 skills 到当前项目
npx skills add /path/to/my-skills --skill '*' --agent codex --copy -y

# 全局安装到当前用户
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -g -y

# 查看 Codex 已安装 skills
npx skills list -a codex
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

## Install Targets

根据 `skills` CLI 的 Agent 选择，不同 Agent 会落到不同目录。这个仓库至少验证了下面三类：

| Agent | Example Command | Verified Install Path |
| --- | --- | --- |
| Codex | `npx skills add ramiro-qq/my-skills --agent codex --skill requirements-to-tech` | `.agents/skills/requirements-to-tech` |
| Claude Code | `npx skills add ramiro-qq/my-skills --agent claude-code --skill requirements-to-tech` | `.claude/skills/requirements-to-tech` |
| Cursor / generic `.agents` consumers | `npx skills add ramiro-qq/my-skills --agent cursor --skill requirements-to-tech` | `.agents/skills/requirements-to-tech` |

`--all` 也可以工作，但它会一次写入很多 Agent 目录，更适合做兼容性回归，不适合日常安装示例。

## 当前 Skills

| Skill | Description | Primary Use Case |
| --- | --- | --- |
| `example-skill` | 最小可发布 skill 模板。 | 新建 skill 时参考目录结构、frontmatter 和兼容说明写法。 |
| `requirements-to-tech` | 把需求文档或功能说明转成可审阅的技术方案。 | 需要先完成技术调研、技术选型、影响分析，再进入实现。 |

## Multi-Agent Compatibility

| Agent | Install Target | Expected Behavior |
| --- | --- | --- |
| Codex | `npx skills add ramiro-qq/my-skills --agent codex` | 首要验证目标。必要时在 skill 内标注 Codex 专属工具名，并提供通用降级说明。 |
| Claude Code | `npx skills add ramiro-qq/my-skills --agent claude-code` | 使用同一份 skill 内容，按技能内的 Agent Notes 替换工具调用或工作流表达。 |
| Cursor / generic `.agents` consumers | `npx skills add ramiro-qq/my-skills --agent cursor` | 依赖标准 `SKILL.md` 发现与安装，不要求 Codex 专属目录结构。 |

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

如果要补做安装验证，建议直接运行：

```bash
npx skills add . --list
npx skills add . --skill requirements-to-tech --agent codex --copy -y
```

更多安装路径、Codex 预设和 clone 失败排查见 [docs/install.md](/Users/ramiroli/root/apps/github/my-skills/docs/install.md)。

## Troubleshooting

- 如果 `npx skills add ramiro-qq/my-skills ...` 在 clone 阶段超时，先用本地路径验证：`npx skills add . --list`
- 如果本地路径可用而 GitHub shorthand 不可用，问题通常在网络、认证或远端可达性，而不是 skill 结构
- 如果你只想给 Codex 装单个 skill，优先使用 `--skill requirements-to-tech --agent codex --copy -y`，不要先跑 `--all`
- `skills update` 当前更偏作用域更新，不适合写成 Codex 专属预设命令
- 我本地继续验证时发现 `skills remove requirements-to-tech --agent codex` 返回成功但文件仍在，因此它暂时不作为本仓库推荐的 Codex 运维路径
