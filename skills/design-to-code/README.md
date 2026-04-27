# Design to Code

## 适用定位

`design-to-code` 是一个面向 `skills.sh` 生态的 Agent Skill。  
它用于把 Figma 链接、截图或 Pencil 导出稿，转成符合宿主项目规范、可维护、可视觉校验的前端代码。

这个 skill 不走“看图直接生成一版就结束”的路线。  
它强调先读取项目规范和现有组件，再做设计归一化、代码生成、截图比对和局部修复。

## 核心能力

- 识别 Figma、截图、Pencil、batch 等不同输入类型
- 将设计源归一化为 Design IR
- 扫描宿主项目规范、路由、样式入口和共享组件
- 优先复用现有组件和设计 token
- 生成可维护的 React / Tailwind / TypeScript 前端代码
- 通过截图比对做视觉验证和约束式修复
- 为每次执行保留可追踪日志与报告

## 安装

### 安装整个仓库技能集

```bash
npx skills add ramiro-qq/my-skills
```

### 查看仓库已发布技能

```bash
npx skills add ramiro-qq/my-skills --list
```

### 安装 design-to-code

```bash
npx skills add ramiro-qq/my-skills --skill design-to-code
```

### 为指定 Agent 安装

```bash
# Codex
npx skills add ramiro-qq/my-skills --skill design-to-code --agent codex --copy -y

# Cursor
npx skills add ramiro-qq/my-skills --skill design-to-code --agent cursor --copy -y

# Claude Code
npx skills add ramiro-qq/my-skills --skill design-to-code --agent claude-code --copy -y
```

### 本地仓库验证安装

```bash
npx skills add . --list
npx skills add . --skill design-to-code --agent codex --copy -y
```

## 何时使用

适合这些场景：

- 把 Figma 设计稿落成真实前端页面
- 把截图或静态设计图还原成前端实现
- 把 Pencil 原型或导出稿转成代码
- 对已有页面做设计稿比对、还原度提升和局部修复
- 一次处理多个页面、多个 frame 或批量设计转代码任务

不适合这些场景：

- 纯后端开发
- 纯数据库或 schema 设计
- 没有明确设计源的自由创意改版
- 只做低保真头脑风暴，不要求真实页面落地

## 默认执行流程

1. 识别输入类型和目标 page/frame
2. 读取宿主项目规范与现状代码
3. 扫描可复用组件、布局壳层和 token
4. 建立 Design IR
5. 生成前端代码
6. 本地预览并截图
7. 对比设计源与实现结果
8. 定位差异区域并做局部修复
9. 输出报告、日志和最终结果

## 目录结构

```text
skills/design-to-code/
├── README.md
├── SKILL.md
└── references/
    ├── README.md
    ├── acceptance-checklist.md
    ├── execution-log-template.md
    ├── pipeline.md
    └── verification-roadmap.md
```

## 参考资料

- `references/README.md`：参考资料入口
- `references/pipeline.md`：主流程说明
- `references/acceptance-checklist.md`：验收检查单
- `references/verification-roadmap.md`：视觉校验与修复路线
- `references/execution-log-template.md`：执行日志模板

## 说明

这个 skill 已经按 `my-skills` 仓库规范重整：

- 使用统一的 `SKILL.md` frontmatter
- 目录结构对齐 `my-skills` 已发布 skills
- 安装说明统一为 `skills.sh` 风格
- 文档入口和引用方式与仓库内其他 skills 保持一致
- 去掉源仓库特有的发布说明，只保留适合本仓库的内容
