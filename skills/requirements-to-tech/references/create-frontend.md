# 前端项目创建参考

## 使用场景

当需求不是改造已有前端项目，而是需要从零创建一个新的前端项目时，先读取本参考，再把初始化方案写进技术方案文档。

不要一上来直接创建项目。必须先判断是 SSR 还是 SPA，再把建项方案写入技术方案，确认后再进入实现。

## 决策顺序

1. 先判断用户需求是 SSR 还是 SPA。
2. 再确认是否已有仓库约束、部署约束、UI 组件约束。
3. 最后把推荐栈、目录结构、初始化步骤、依赖和后续 skills 安装要求写进技术方案。
4. 默认在当前目录下新建前端项目，如果当前项目不为空，则在当前目录下新建`frontend`作为前端项目根目录

## SSR 项目默认方案

如果需求是 SSR 项目，默认按以下组合设计：

- `pnpm`
- `Next.js`
- `Tailwind CSS`
- `shadcn/ui`

技术方案中至少要写清：

- 为什么需要 SSR，而不是 SPA
- 目标页面和路由模式
- 服务端渲染边界
- 数据获取模式
- 组件体系与主题方案
- 目录结构建议
- 初始化命令建议

## SPA 项目默认方案

如果需求是 SPA 项目，默认按以下组合设计：

- `pnpm`
- `Vite`
- `Tailwind CSS`
- `shadcn/ui`
- `axios`
- `ahooks`

技术方案中至少要写清：

- 为什么采用 SPA
- 路由模式
- 请求层封装方式
- 异步状态管理方式
- 组件体系与主题方案
- 目录结构建议
- 初始化命令建议

## 技术方案中要补充的内容

涉及前端项目创建时，方案里必须包含：

- 项目类型：SSR / SPA
- 推荐技术栈和选型理由
- 初始化命令草案
- 目录结构草案
- 核心依赖清单
- UI 组件体系说明
- 请求层与异步模式说明
- 代码规范与验证命令
- 后续需要安装的 skills

## skills.sh 安装要求
1. 安装`find-skills`
推荐在项目中安装辅助开发技能，帮助在不同技术深度的开发人员能够快速写出高质量代码。这些skills主要从`skills.sh`市场安装。
安装skills.sh中的`frontend-skill`，通过该skills查找相关skills，如：项目中使用了React，可以通过该skills查找并安装React相关的技能。
安装参考地址：https://skills.sh/vercel-labs/skills/find-skills
2. 默认安装以下技能
- `design-taste-frontend `: 高自主前端技能。
- `frontend-design`: 独特、生产级别的前端界面，拒绝通用的 AI 美学。
- `frontend-ui-engineering`: 构建生产质量的用户界面，使其具有可访问性、高性能和视觉上的精致。
- `Frontend UI/UX Engineer`: Frontend UI/UX Engineer。
- `frontend-code-review `: 前端代码审查skill。
- `vercel-react-best-practices`: Vercel React 最佳实践, 写React代码时很有用。
- `react-doctor`: 一个自动化的 React 代码库扫描工具，用于检测安全、性能、正确性和架构问题。
- `gsap-react`: GSAP with React，前端动效。
- `React 19 Concurrent Patterns`: React19并发开发技巧。
3. 其他skills
如果项目中应用了其他技术栈，可通过`find-skills`查找并安装其他技术栈的开发辅助skill。

## 禁止事项

- 不要在没有先做技术方案的情况下直接执行建项命令。
- 不要混用多套前端基础栈。
- 不要跳过 `Tailwind CSS` 与 `shadcn/ui` 的选型说明。
- 不要省略 `axios` / `ahooks` 在 SPA 中的职责说明。
- 不要遗漏后续 skills 安装要求。
