# my-skills

## 本项目信息与定位

`my-skills` 是一个用于集中管理、发布、安装和维护 Skills 的仓库。

- GitHub 仓库：`https://github.com/ramiro-qq/my-skills`
- Skills 正式发布目录：`skills/`
- Skills 草案目录：`docs/ideas/`
- CLI 命令名：`my-skills`

项目定位：

- 对外提供一个可执行 CLI，用于安装已发布 Skills
- 对内提供一套统一的 Skill 开发、校验、测试和发布流程
- 使用 `registry/index.json` 维护已发布 Skills 索引

## 使用 Skills 步骤说明

面向其他项目使用者。

前提：

- 当前仓库内容已经提交并推送到 GitHub
- 你的环境里有 `Node.js` 和 `npx`

### 1. 进入你的项目目录

```bash
cd /path/to/your-project
```

### 2. 使用 CLI 安装已发布 Skill

直接从当前 GitHub 仓库执行 CLI，并安装 `example-skill`：

```bash
npm exec --yes --package=github:ramiro-qq/my-skills my-skills install ramiro-qq/my-skills example-skill .
```

说明：

- 前半段 `--package=github:ramiro-qq/my-skills` 表示 CLI 自身从这个仓库获取
- 后半段 `ramiro-qq/my-skills` 表示 Skill 来源仓库
- 最后的 `.` 表示安装到当前项目目录

### 3. 查看安装结果

安装完成后，Skill 会落到你的项目目录：

```text
.codex/skills/<skill-name>/
```

### 4. 在项目里使用 Skill

安装后的目录通常包含：

- `SKILL.md`
- `skill.json`
- `README.md`
- `assets/`
- `templates/`
- `scripts/`

后续就在你的项目环境中，按该 Skill 目录下的 `SKILL.md` 说明使用它。

## 开发 Skill 步骤说明

面向仓库维护者和 Skill 开发者。

### 1. 记录未发布想法

如果一个 Skill 还在构思阶段，先在 `docs/ideas/` 下新增一个 Markdown 文件记录目标、场景和待完善点。

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

将变更推送到远程仓库后，由 GitHub Actions 继续执行自动校验、测试和 registry 更新。

## 已发布 Skills 集合

| Skill | 描述 | 使用场景 |
| --- | --- | --- |
| `example-skill` | 最小正式 Skill 示例，用于验证仓库规范和目录结构。 | 新建 Skill 时参考目录结构和元数据写法；验证仓库工具链。 |
| `review-notes` | 生成简洁的评审备注和后续行动项。 | 开发完成后整理 review 结论、行动项和交付摘要。 |

## 未发布的 Skills 集合说明

未发布的 Skills 统一放在 `docs/ideas/`，用于记录暂未进入正式发布流程的 Skill 想法和待办项。

当前暂无未发布 Skill。
