# my-skills

## 项目定位

`my-skills` 是一个面向 `skills.sh` 生态的 Agent Skills 仓库。

这个仓库只做一件事：提供可以通过 `skills` CLI 安装的公开 skills。  
如果你是使用者，只需要关心安装命令和技能列表，不需要关心仓库内部实现。

## Skills 安装

### 安装所有技能

```bash
npx skills add ramiro-qq/my-skills
```

### 查看已发布技能

```bash
npx skills add ramiro-qq/my-skills --list
```

### 安装指定技能

```bash
npx skills add ramiro-qq/my-skills --skill requirements-to-tech
npx skills add ramiro-qq/my-skills --skill integration-debug
npx skills add ramiro-qq/my-skills --skill implement-ui-from-design
```

### 为指定 Agent 安装技能

```bash
# 同时为多个 Agent 安装
npx skills add ramiro-qq/my-skills --agent codex --agent claude-code

# 为 Codex 安装指定技能
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -y

# 为 Cursor 安装指定技能
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent cursor --copy -y

# 为 Claude Code 安装指定技能
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent claude-code --copy -y
```

### 全局安装技能

```bash
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -g -y
```

### 本地仓库验证安装

```bash
npx skills add . --list
npx skills add . --skill requirements-to-tech --agent codex --copy -y
```

## Agent 安装说明

| Agent | Example Command | Install Target |
| --- | --- | --- |
| Codex | `npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex` | `.agents/skills/` 或 `~/.codex/skills/` |
| Cursor | `npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent cursor` | `.agents/skills/` 或 `~/.cursor/skills/` |
| Claude Code | `npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent claude-code` | `.claude/skills/` 或 `~/.claude/skills/` |

如果你只想验证仓库结构是否能被 `skills` CLI 识别，优先使用 `--list`。  
如果你只想给某个 Agent 安装一个技能，优先使用 `--skill <name> --agent <agent> --copy -y`。

如果你要安装新发布的联调技能，推荐直接使用：

```bash
npx skills add ramiro-qq/my-skills --skill integration-debug --agent codex --copy -y
```

`integration-debug` 适合前后端联调、接口契约核对、异常数据兼容检查、整体流程回归和浏览器证据采集场景。

如果你要安装设计稿高还原实现技能，推荐直接使用：

```bash
npx skills add ramiro-qq/my-skills --skill implement-ui-from-design --agent codex --copy -y
```

`implement-ui-from-design` 适合基于设计稿做高还原前端开发，先读需求、业务、项目规则和现状代码，再区分新增或增量改造并完成高质量实现。

更多安装路径和故障排查见 [docs/install.md](/Users/ramiroli/root/apps/github/my-skills/docs/install.md)。

## 已发布技能集合

| Skill | Description | Use Case |
| --- | --- | --- |
| `example-skill` | 最小可发布 skill 模板。 | 参考标准 `SKILL.md` 结构与发布写法。 |
| `implement-ui-from-design` | 结合需求、项目规则和现状代码，把 UI 设计稿映射成高还原前端实现。 | 设计稿还原、高质量页面改造、新增页面或增量 UI 开发场景。 |
| `integration-debug` | 将前端、后端和下游服务串起来做联调，并整理接口清单、核对请求响应、收敛阻塞项。 | 前后端联调、接口联调、验收前串联调试场景。 |
| `requirements-to-tech` | 将需求文档或功能说明转成可审阅的技术方案。 | 先出方案、再编码的需求分析与技术设计场景。 |
