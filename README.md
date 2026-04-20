# my-skills

一个用于发布、安装和维护 Skills 的仓库。

- GitHub：`https://github.com/ramiro-qq/my-skills`
- CLI：`my-skills`
- 已发布 Skills 目录：`skills/`
- 未发布想法目录：`docs/ideas/`

## 使用已发布 Skills

面向其他项目使用者。

前提：

- 你的环境里有 `Node.js`
- 目标项目目录已经准备好

### 安装命令

在你的项目目录执行：

```bash
curl -fsSL https://raw.githubusercontent.com/ramiro-qq/my-skills/main/scripts/install-skill.mjs -o /tmp/install-skill.mjs && node /tmp/install-skill.mjs ramiro-qq/my-skills example-skill .
```

命令说明：

- `curl ... install-skill.mjs`：直接下载仓库里的安装脚本，绕过 `npm exec github:...` 对 GitHub 包拉取的依赖
- `ramiro-qq/my-skills`：已发布 Skill 的来源仓库
- `example-skill`：要安装的 Skill 名称
- `.`：安装到当前项目目录

如果你本地访问 GitHub 包依赖很稳定，也可以继续使用 CLI 方式：

```bash
npm exec --yes --package=github:ramiro-qq/my-skills my-skills install ramiro-qq/my-skills example-skill .
```

### 安装结果

安装完成后，Skill 会出现在你的项目目录：

```text
.codex/skills/<skill-name>/
```

例如：

```text
.codex/skills/example-skill/
```

通常会包含：

- `SKILL.md`
- `skill.json`
- `README.md`（可选）
- `references/`（可选）
- `scripts/`（可选）
- `templates/`（可选）
- `assets/`（可选）

后续就在你的项目环境中，按该 Skill 目录下的 `SKILL.md` 说明使用它。

## 已发布 Skills 集合

| Skill | 描述 | 使用场景 |
| --- | --- | --- |
| `example-skill` | 最小正式 Skill 示例，用于验证仓库规范和目录结构。 | 新建 Skill 时参考目录结构和元数据写法；验证安装和工具链。 |
| `requirements-to-tech` | 将需求文档、PRD 或新功能说明转成项目可落地的技术方案。 | 需要技术选型、架构设计、增量改造分析、影响范围评估，并且必须先出文档再进入编码。 |

## 开发与发布 Skill

面向仓库维护者和 Skill 开发者。

### 1. 记录未发布想法

如果一个 Skill 还在构思阶段，先在 `docs/ideas/` 下新增 Markdown 文件记录目标、场景和待完善点。

### 2. 创建正式 Skill

在 `skills/` 下创建目录，最少包含：

```text
skills/your-skill/
  SKILL.md
  skill.json
```

可按需补充：

```text
skills/your-skill/
  README.md
  scripts/
  templates/
  assets/
```

### 3. 本地校验与测试

```bash
npm install
npm run validate
npm test
npm run build
```

### 4. 生成并更新发布索引

```bash
npm run registry
npm run publish:skills
```

### 5. 推送到 GitHub

将变更推送到远程仓库后，由 GitHub Actions 执行自动校验、测试和 registry 更新。

## 未发布 Skills 集合说明

`docs/ideas/` 用于保留 Skill 草案、未发布想法，以及已经正式发布但仍需要保留的原始方案文档，便于后续迭代对照。

当前保留文档：

- `docs/ideas/技术方案.md`：`requirements-to-tech` 的原始草案，正式 Skill 发布后继续保留。
