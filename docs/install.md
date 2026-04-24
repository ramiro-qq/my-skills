# Installation Guide

本项目的安装流程完全对齐 `skills.sh`，不再提供自定义 installer。

## Supported Source Formats

```bash
# GitHub shorthand
npx skills add ramiro-qq/my-skills

# Full GitHub URL
npx skills add https://github.com/ramiro-qq/my-skills

# Local path
npx skills add .
```

建议：

- 对外文档优先使用 `ramiro-qq/my-skills`
- 本地调试优先使用 `.` 或仓库绝对路径
- 如果要定位远程安装失败，先用本地路径验证仓库结构

## Codex Install Presets

```bash
# 1. 查看仓库中有哪些可发现的 skills
npx skills add . --list

# 2. 安装一个 skill 到当前项目的 Codex 目标目录
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -y

# 3. 安装全部 skills 到当前项目的 Codex 目标目录
npx skills add ramiro-qq/my-skills --skill '*' --agent codex --copy -y

# 4. 全局安装到当前用户的 Codex 目录
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -g -y
```

## Codex Operations

```bash
# 查看 Codex 已安装 skills
npx skills list -a codex

# 更新 Codex 已安装 skills
npx skills update -a codex -y

# 从 Codex 中移除某个 skill
npx skills remove requirements-to-tech --agent codex -y
```

## Validation Workflow

推荐按下面的顺序验证安装：

1. 发现：`npx skills add . --list`
2. 试装：`npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -y`
3. 检查落点：项目级通常落到 `.agents/skills/requirements-to-tech`
4. 核对登记：`npx skills list -a codex`

## Troubleshooting

### Clone timed out after 60s

如果你看到类似下面的错误：

```text
Clone timed out after 60s. This often happens with private repos that require authentication.
```

优先按下面顺序排查：

1. 用本地路径验证仓库结构是否可发现：`npx skills add . --list`
2. 如果本地路径正常，说明问题通常不在 `SKILL.md` 结构，而在 GitHub clone 可达性、认证或网络
3. 如果使用 SSH，检查 `ssh-add -l`
4. 如果使用 HTTPS 和 GitHub CLI，检查 `gh auth status`
5. 如果只是想先装到 Codex，直接用本地绝对路径替代 `ramiro-qq/my-skills`

### Codex only

如果你的目标只是 Codex，不要先跑 `--all`。优先用：

```bash
npx skills add ramiro-qq/my-skills --skill requirements-to-tech --agent codex --copy -y
```

这样安装路径最确定，回归和排查也最直接。
