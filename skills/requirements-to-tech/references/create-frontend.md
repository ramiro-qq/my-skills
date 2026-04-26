# 前端项目创建参考

## 使用场景

当需求不是改造已有前端项目，而是需要从零创建一个新的前端项目时，先读取本参考，再把初始化方案写进技术方案文档。

不要一上来直接创建项目。必须先判断是 SSR 还是 SPA，再把建项方案写入技术方案，确认后再进入实现。

## 决策顺序

1. 先判断用户需求是 SSR 还是 SPA。
2. 再确认是否已有仓库约束、部署约束、UI 组件约束。
3. 最后把推荐栈、目录结构、初始化步骤、依赖和后续 skills 安装要求写进技术方案。
4. 默认在当前目录下新建前端项目，如果当前项目不为空，则在当前目录下新建`frontend`作为前端项目根目录
5. 初始化方案中必须明确：项目初始化时需要在仓库根目录创建 `AGENTS.md`，作为项目级协作规约文件

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

并默认遵循以下实现约束：

- 能直接复用 `ahooks` 现成 hooks 的场景，必须优先复用，不要重复造轮子
- API 管理目录固定为 `src/api`
- 接口请求统一采用“`axios` 统一实例 + `ahooks/useRequest`”组合
- 不需要、也不应再额外封装自定义 `useRequest` 类 hooks 去替代 `ahooks/useRequest`

技术方案中至少要写清：

- 为什么采用 SPA
- 路由模式
- 请求层封装方式
- 异步状态管理方式
- 组件体系与主题方案
- 目录结构建议
- 初始化命令建议
- 为什么 API 目录固定为 `src/api`
- 为什么请求层应使用 `axios` 统一实例 + `ahooks/useRequest`
- 哪些异步场景优先直接使用 `ahooks` 现成 hooks，而不是自定义重复实现

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
- 根目录 `AGENTS.md` 初始化方案

如果项目初始化阶段会创建新仓库规则文件，还必须显式补充：

- 为什么需要根级 `AGENTS.md`
- `AGENTS.md` 的适用范围
- `AGENTS.md` 的固定规则与动态规则划分方式
- `AGENTS.md` 在初始化阶段的最小章节要求

如果项目类型是 `SPA`，还必须显式补充：

- `src/api` 作为 API 管理目录的职责边界
- `axios` 统一实例的放置位置、拦截器职责和复用方式
- `ahooks/useRequest` 在页面加载、手动触发、轮询、刷新、依赖刷新等场景中的使用边界
- 为什么不额外封装自定义 `useRequest`
- 哪些常见场景优先使用 `ahooks` 自带 hooks，例如请求、节流、防抖、轮询、倒计时、滚动与尺寸监听等

## SPA 目录与请求层强约束

如果项目类型是 `SPA`，则以下约束为硬约束，不是建议项：

- API 管理目录必须使用 `src/api`
- 不要把接口管理放到 `src/services`、`src/service`、`src/apis`、`src/lib/api` 或其他自定义目录
- `src/api` 内负责：
  - `axios` 统一实例
  - API 模块划分
  - 请求参数与响应类型
  - 与接口协议直接相关的转换逻辑
- 页面或业务模块发起异步请求时，默认直接使用 `ahooks/useRequest` + `src/api` 中暴露的 API 方法
- 如果 `ahooks` 已经提供现成 hooks，必须优先使用；只有在 `ahooks` 无法覆盖且有明确理由时，才允许新增自定义 hooks
- 即便需要新增自定义 hooks，也不能重新封装一套替代 `ahooks/useRequest` 的通用请求 hooks 体系
- 请求公共能力应集中在 `axios` 统一实例层解决，例如：
  - baseURL
  - headers
  - token 注入
  - 通用错误拦截
  - 响应解包
- 请求状态管理应尽量使用 `useRequest` 原生能力，不要重复封装 loading、error、refresh、polling、debounce、throttle 等通用逻辑

## 根目录 AGENTS.md 初始化要求

前端项目初始化时，必须在仓库根目录初始化 `AGENTS.md`。这不是可选项，而是项目协作的默认交付物。

`AGENTS.md` 的目标：

- 作为仓库根目录及其全部子目录的项目级协作规约
- 为后续人类开发者与 Agent 提供统一的事实来源、实现边界、目录约定和验证要求
- 在项目初始化阶段尽早固定高频硬约束，避免规则散落到聊天记录或临时文档中

`AGENTS.md` 的内容建议拆分为两类：

### 固定规则

固定规则用于沉淀“长期稳定、跨需求复用”的项目级约束，通常包括：

- 仓库基本情况与技术栈
- 常用命令
- 工程结构
- 路由约定
- 项目级实现硬约束
- 目录与命名约定
- API、数据获取与状态约定
- UI、主题与反馈约定
- 注释、文档与说明约定
- 变更前后检查清单

### 动态规则

动态规则用于记录“会随技术栈、项目阶段、用户要求、部署环境、业务模块而变化”的约束，通常包括：

- 当前技术栈版本与关键依赖变化
- 当前项目根目录、子应用目录或 monorepo 结构变化
- 路由入口、应用壳入口、鉴权入口的变化
- 代理地址、环境变量、部署环境与联调环境变化
- 当前用户明确要求的代码风格、注释语言、目录偏好、组件约束
- 当前阶段新增的领域模块、质量工具、验证命令与 Review 关注点

固定规则应保持稳定，动态规则允许随着项目演进更新，但都应写入 `AGENTS.md`，而不是只停留在一次性说明中。

前端项目初始化阶段，根级 `AGENTS.md` 至少必须包含以下最小章节：

1. 仓库基本情况与技术栈
2. 常用命令
3. 工程结构
4. 路由约定
5. 项目约定
6. 技术栈约定
7. UI 约定
8. 注释、文档与说明约定
9. 变更前后检查清单

若项目当前信息尚未完全确定，可以在 `AGENTS.md` 中明确写：

- 当前未知
- 后续确认
- 默认约束

但不能跳过 `AGENTS.md` 文件本身，也不能把这些规则只写进技术方案而不落到仓库根目录。

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

### skills 安装命令规范

技术方案中如果涉及 skills 安装，必须给出明确命令，不要只写技能名称。默认安装命令固定为：

```bash
npx skills add https://github.com/<owner>/<repo> --skill <name> -a codex -y
```

约束如下：

- `owner`、`repo`、`name` 必须替换为真实值，不能在最终方案里保留占位符
- 对每个建议安装的 skill，优先给出单独可执行命令
- 如果某个 skill 安装失败，可以按同一命令最多重试三次
- 技术方案里应明确写出“失败可重试三次”的处理说明
- 若某个 skill 来源不是 GitHub 仓库，必须显式说明原因与替代安装方式，不能静默偏离默认命令格式

## 禁止事项

- 不要在没有先做技术方案的情况下直接执行建项命令。
- 不要混用多套前端基础栈。
- 不要跳过 `Tailwind CSS` 与 `shadcn/ui` 的选型说明。
- 不要省略 `axios` / `ahooks` 在 SPA 中的职责说明。
- 不要遗漏后续 skills 安装要求。
- 不要在 `SPA` 项目中重复封装 `ahooks` 已有能力。
- 不要把 API 管理目录放到 `src/api` 之外的其他路径。
- 不要自定义一套通用 `useRequest` 来替代 `ahooks/useRequest`。
- 不要在前端项目初始化时遗漏根目录 `AGENTS.md`。
- 不要把本应沉淀到根级 `AGENTS.md` 的项目规约只写在聊天记录、PR 描述或一次性技术方案里。
