# Spring 项目创建参考

## 使用场景

当需求不是改造已有 Java/Spring 后端，而是需要从零创建新的 Spring 项目时，先读取本参考，再把初始化方案写进技术方案文档。

不要一上来直接建项。必须先判断项目是单模块还是多模块，再把建项方案写入技术方案，确认后再进入实现。

## 决策顺序

1. 先判断项目类型：单模块服务，还是多模块后端。
2. 再判断服务职责：通用 API、鉴权网关、后台管理服务、定时任务服务、集成服务，还是混合型单体。
3. 再确认是否已有仓库约束、部署约束、数据库约束、中间件约束、鉴权约束。
4. 再确认目标仓库是否已存在根级 `AGENTS.md`；若已存在，必须先读取并继承，不得绕过。
5. 再确认后端项目 repo 是否已存在 `.agents/rules/`；若已存在，必须先读取现有规则并判断是否需要合并或补齐。
6. 最后把推荐栈、模块结构、初始化步骤、依赖、`AGENTS.md` 初始化方案、`.agents/rules/` 初始化方案和 skills 安装要求写进技术方案。
7. 默认在当前目录下新建 Spring 项目；如果当前目录不为空，则默认在当前目录下新建 `backend` 作为后端项目根目录。
8. 初始化方案中必须明确：项目初始化时需要在仓库根目录创建 `AGENTS.md`，作为项目级协作规约文件；若仓库已存在 `AGENTS.md`，则必须显式说明读取结果如何影响建项方案。
9. 初始化方案中还必须明确：项目初始化时需要在后端项目 repo 下创建或补齐 `.agents/rules/`，并把约定的 Spring 规则文件落到该目录下；若目录已存在，则说明增量合并策略。

## 单模块项目默认方案

如果需求明确只有一个后端服务、领域边界简单、短期内不存在明显的跨模块复用需求，默认优先采用单模块 Spring Boot 项目。

默认组合：

- `JDK 21`
- `Maven`
- `Spring Boot 3.x`
- `spring-boot-starter-web`
- `spring-boot-starter-validation`
- `spring-boot-starter-actuator`
- `logback-spring.xml`

技术方案中至少要写清：

- 为什么单模块足够，而不是多模块
- 服务职责边界
- 包结构建议
- 配置与 profile 方案
- 日志、监控、测试方案
- 初始化命令建议

## 多模块项目默认方案

如果需求存在以下任一特征，默认优先采用 Maven 多模块 Spring Boot 架构：

- 需要把启动装配、公共能力、跨模块 Port、业务模块拆开
- 至少有两个独立领域模块，且会并行演进
- 需要沉淀共享中间件、统一鉴权、统一上下文、统一错误码或统一响应模型
- 预期后续会新增网关、任务、知识库、Agent、集成等多个后端模块

推荐根结构：

```text
<repo>/
├── pom.xml
├── AGENTS.md
├── <name>-common/
├── <name>-api/
├── <name>-app/
├── <name>-gateway/           # 按需
├── <name>-job/               # 按需
├── <name>-integration/       # 按需
├── <name>-<domain>/          # 1..n 个业务模块
└── .agents/
    └── rules/
```

默认职责边界：

- `<name>-common`：跨模块稳定复用能力，例如通用 DTO、异常、错误码契约、请求上下文、鉴权白名单注解、实体基类、日志/中间件配置抽象
- `<name>-api`：只放跨模块调用的 Port 或共享契约，不放 Controller，不放具体业务实现
- `<name>-app`：唯一启动模块；负责 `@SpringBootApplication`、组件扫描、全局异常处理、拦截器、Actuator、公共装配
- `<name>-gateway`：如果存在鉴权、登录、JWT、SSO、会话、用户基础能力，优先单独成模块
- `<name>-<domain>`：具体业务模块，默认采用 `adapter / app / domain / infra / config / common` 分层

业务模块推荐目录：

```text
<name>-<domain>/
└── src/main/java/.../<domain>/
    ├── adapter/              # Controller / HTTP 入参出参适配
    ├── app/                  # 用例编排、应用服务、DTO、VO
    ├── domain/               # 领域模型、领域服务、仓储接口
    ├── infra/                # 仓储实现、外部系统适配、Mapper、PO
    ├── config/               # 模块级装配
    ├── scheduler/            # 定时任务，按需
    └── common/               # 仅模块内复用的常量、错误码、工具
```

技术方案中至少要写清：

- 为什么需要多模块，而不是单模块
- 模块划分与依赖方向
- 启动模块、公共模块、Port 模块、业务模块的职责边界
- 模块内部分层结构
- 组件扫描、MyBatis/JPA 扫描、配置装配方式
- 初始化命令建议

## Spring 多模块强约束

如果项目类型是多模块后端，则以下约束默认视为硬约束，不是建议项：

- 启动模块必须与业务模块分离；不要把启动类所在模块写成业务大杂烩
- `api` 模块只定义跨模块 Port、共享契约或最小稳定接口；不要把 Controller、Service 实现、Repository 实现放进去
- `common` 模块只沉淀跨模块稳定复用能力；不要把具体业务规则、业务错误码、业务表结构细节放进去
- Controller 默认放在具体业务模块的 `adapter` 层，不放在 `api` 或 `common`
- 跨模块调用优先通过 `api` 定义接口，由具体模块实现，再由启动模块统一装配进 classpath
- 业务模块内默认使用 `adapter -> app -> domain -> infra` 依赖方向，不要反向依赖
- 模块级错误码放在各模块自己的 `common` 或 `exception` 目录；全局错误码和全局异常契约才放 `common`
- 若使用 MyBatis 或 MyBatis-Plus，Mapper 扫描必须在模块级 `config` 中声明，不要把所有数据访问配置散落在启动模块

## 技术方案中必须补充的内容

涉及 Spring 项目创建时，方案里必须包含：

- 项目类型：单模块 / 多模块
- 服务职责与边界
- 推荐技术栈和选型理由
- 构建工具与 JDK 版本
- 初始化命令草案
- 模块结构或包结构草案
- 核心依赖清单
- 配置、profile、环境变量与密钥管理方案
- API 契约、响应模型与错误处理方案
- 持久化、缓存、对象存储、消息队列等中间件说明
- 鉴权、上下文与拦截器方案
- 日志、监控、健康检查与验证命令
- AI 编辑器规则初始化方案，例如 `.agents/rules/*`
- 后续需要安装的 skills
- 根目录 `AGENTS.md` 读取或初始化方案
- 后端项目 repo 下 `.agents/rules/` 的读取、创建或补齐方案

如果推荐的是多模块项目，还必须显式补充：

- 父 `pom.xml` 与子模块划分
- 启动模块为何独立存在
- `common`、`api`、`gateway`、业务模块各自职责
- 模块间依赖方向与禁止跨层访问规则
- 统一异常、统一响应、统一上下文是否存在，以及边界如何定义

## 接口与错误语义约束

Spring 建项方案里必须明确“接口响应语义”与“错误语义”，但不要把参考项目的具体业务规则原样带入新项目。

技术方案至少要写清：

- 是否采用统一响应包装，例如 `CommonResponse<T>`
- 业务失败是走标准 HTTP 状态码，还是走统一响应码模型
- 错误码是否分为全局错误码与模块错误码
- 是否需要请求上下文，例如 `RequestContext`
- 是否需要白名单注解，例如 `@SkipAuth`
- API 路径是否统一采用 `/v1/...` 版本前缀

约束如下：

- 必须统一，不要不同模块各用一套错误返回风格
- 可以参考已有项目的工程模式，但不要把已有项目的业务错误码前缀、业务文案、业务接口路径、业务表前缀直接复制到新项目
- 如果没有明确需求，不要默认继承“业务失败一律 HTTP 200”这类项目级接口语义；必须在技术方案里说明是否采用

## 配置、Profile 与密钥管理要求

Spring 项目初始化方案中，必须明确：

- 根 `application.yml` 放公共配置
- `application-<profile>.yml` 放环境差异配置
- 敏感信息默认不提交 Git，优先通过环境变量、私有配置文件或配置中心注入
- 如果使用 Jasypt、KMS 或其他密钥方案，必须说明解密入口、密钥来源和本地开发流程
- 如果使用 Spring Boot profile 目录或额外资源目录，必须说明资源如何进入 classpath

如果项目使用 Redis、S3、MQ、第三方 HTTP 客户端等中间件，还必须说明：

- 是否默认启用
- 本地开发关闭或降级策略
- 配置前缀、配置来源与超时策略
- 健康检查和启动失败策略

## 日志、监控与验证要求

Spring 项目初始化方案中，必须明确：

- 是否启用 `spring-boot-starter-actuator`
- 健康检查暴露哪些端点
- 日志文件路径、滚动策略与环境差异
- 是否需要异步文件日志
- 本地验证命令、测试命令、启动命令

测试约束至少要说明：

- 默认测试框架使用 `spring-boot-starter-test`
- 默认优先 `JUnit 5`
- 只有在需要兼容历史 `JUnit 4` 用例时，才引入 `junit-vintage-engine`

## 根目录 AGENTS.md 与 `.agents/rules/` 初始化要求

Spring 项目初始化时，必须先检查后端项目 repo 根目录是否已经存在 `AGENTS.md`。

处理顺序是：

1. 如果后端项目 repo 根目录已有 `AGENTS.md`，必须先读取，再决定建项方案；不能跳过
2. 如果后端项目 repo 根目录没有 `AGENTS.md`，则技术方案中必须显式包含创建根级 `AGENTS.md` 的步骤
3. 如果后端项目 repo 已有 `.agents/rules/`，必须先读取现有规则文件，避免覆盖或与现有约束冲突
4. 如果后端项目 repo 没有 `.agents/rules/`，则技术方案中必须显式包含创建 `.agents/rules/` 的步骤
5. 如果是多模块仓库，后端项目 repo 根级 `AGENTS.md` 负责该后端项目的统一协作规约；只有在模块差异非常明显时，才允许后续补充模块级规则文件

`AGENTS.md` 的目标：

- 作为后端项目 repo 根目录及其全部子目录的项目级协作规约
- 为后续开发者与 Agent 提供统一的工程结构、模块边界、实现约束和验证要求
- 尽早固定高频硬约束，避免把关键规则散落到聊天记录或临时方案中

`AGENTS.md` 的内容建议拆分为两类：

### 固定规则

固定规则用于沉淀长期稳定、跨需求复用的项目级约束，通常包括：

- 仓库基本情况与技术栈
- 常用命令
- 模块结构与依赖关系
- 包结构与分层约定
- API 与错误处理约定
- 配置、profile 与密钥约定
- 持久化与中间件约定
- 注释、文档与说明约定
- 变更前后检查清单

### 动态规则

动态规则用于记录会随技术栈、部署环境、用户要求、模块增减而变化的约束，通常包括：

- 当前 JDK、Spring Boot、Maven 插件版本
- 当前模块清单、模块职责与依赖变更
- 当前数据库、缓存、消息队列、对象存储接入情况
- 当前环境变量、代理地址、配置中心、联调环境变化
- 当前用户明确要求的代码风格、注释语言、目录偏好、测试要求
- 当前阶段新增的质量工具、验证命令与 Review 关注点

固定规则应保持稳定，动态规则允许随着项目演进更新，但两者都应写进 `AGENTS.md`，而不是只停留在一次性技术方案中。

Spring 项目初始化阶段，根级 `AGENTS.md` 至少必须包含以下最小章节：

1. 仓库基本情况与技术栈
2. 常用命令
3. 模块结构与依赖关系
4. 包结构与分层约定
5. API 与错误处理约定
6. 配置、Profile 与密钥约定
7. 持久化与中间件约定
8. 日志、监控与验证约定
9. 注释、文档与说明约定
10. 变更前后检查清单

若项目当前信息尚未完全确定，可以在 `AGENTS.md` 中明确写：

- 当前未知
- 后续确认
- 默认约束

但不能跳过 `AGENTS.md` 文件本身，也不能把这些规则只写进技术方案而不落到后端项目 repo 根目录。

`.agents/rules/` 的目标：

- 为 AI 编辑器提供按文件类型、目录范围和实现主题细分的规则文件
- 把比 `AGENTS.md` 更细粒度、更偏实现层的约束沉淀成可自动应用的规则
- 在项目初始化阶段尽早把高频 Java / Spring / MyBatis / 文档结构约束固定下来

`AGENTS.md` 与 `.agents/rules/` 的分工约束：

- `AGENTS.md` 负责仓库级事实、模块边界、常用命令、协作规则、验证要求
- `.agents/rules/*.mdc` 负责更细粒度的编码规则、目录规则、接口规则、配置规则和文档规则
- 不要只初始化 `AGENTS.md` 而遗漏 `.agents/rules/`
- 也不要把本应按文件类型自动应用的细节编码规范全部堆进 `AGENTS.md`

## `.agents/rules/` 默认规则文件

创建 Spring 项目时，必须在后端项目 repo 根目录初始化 `.agents/rules/`，并至少加入以下规则文件：

- `api-interface-params.mdc`
- `backend-tech-stack.mdc`
- `java-comment-style-consistency.mdc`
- `docs-structure.mdc`
- `project-layered-architecture.mdc`
- `mybatis-plus-pagination.mdc`
- `spring-application-yaml-split.mdc`

这些规则文件的职责如下：

- `api-interface-params.mdc`：接口入参与出参约束，要求 HTTP 出参统一 `CommonResponse<具名类型>`，并限制无结构 `Map` / `Object` / JSON 泛型入参出参
- `backend-tech-stack.mdc`：固定后端技术栈版本约束，例如 `JDK 21`、`Spring Boot 3.5.9`、`jakarta.validation`、`mysql-connector-j`
- `java-comment-style-consistency.mdc`：统一 Java 方法注释、关键字段注释和关键逻辑行注释风格
- `docs-structure.mdc`：统一 `docs/` 目录结构与文档命名规范
- `project-layered-architecture.mdc`：约束 `adapter / app / domain / infra / common` 分层职责与依赖方向
- `mybatis-plus-pagination.mdc`：要求列表分页统一使用 `MyBatis-Plus Page + selectPage`
- `spring-application-yaml-split.mdc`：约束 `application.yml` 与 `application-{profile}.yml` 的拆分边界

初始化时的处理要求：

1. 若规则模板文件已提供，必须复制到后端项目 repo 下 `.agents/rules/` 并保持文件名稳定
2. 若仓库中已存在同名规则文件，必须先读取再决定覆盖、合并或保留，不能直接覆盖
3. 技术方案中必须显式写明这些规则文件会作为默认交付物创建
4. 若某个规则文件暂时不适用，必须在技术方案中写明原因，不能静默省略

这里的规则模板来源目录固定为当前 skill 同级 `rules/` 目录。

当前 skill 目录结构已固定为：

```text
requirements-to-tech/
├── SKILL.md
├── references/
└── rules/
```

上述 7 个 `.mdc` 文件都维护在 `rules/` 目录下，并从这里复制到 `<后端项目repo>/.agents/rules/`。

推荐初始化命令示意：

```bash
cd skills/requirements-to-tech
mkdir -p <backend-project-repo>/.agents/rules
cp rules/*.mdc <backend-project-repo>/.agents/rules/
```

约束如下：

- 规则模板来源目录固定为当前 skill 同级 `rules/` 目录
- 推荐先进入 `skills/requirements-to-tech/` 再执行复制命令，避免依赖脆弱的 `../rules` 相对路径
- `<backend-project-repo>` 必须替换为真实后端项目 repo 路径，不能误写成外层工作区根目录
- 新仓库初始化时，`.agents/rules/` 与 `AGENTS.md` 一样，属于默认基础设施，不是可选项
- 不要只在聊天记录里说明“有这些规则”，必须实际落到 `<后端项目repo>/.agents/rules/` 目录

## skills.sh 安装要求

### 1. 必装 `find-skills`

推荐在项目初始化阶段先安装 `find-skills`，用于后续根据 `Spring Boot`、`Java`、`Maven`、测试、架构、可观测性等技术栈继续查找合适技能。

安装命令：

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills -a codex -y
```

### 2. 默认安装以下 skills

Spring 项目初始化时，除 `find-skills` 外，默认再安装以下指定技能：

- `java-springboot`
- `java-junit`
- `create-spring-boot-java-project`
- `java-coding-standards`
- `java-maven`
- `mysql`
- `mysql-best-practices`

推荐安装命令：

```bash
npx skills add https://github.com/awesome-copilot/awesome-copilot --skill java-springboot -a codex -y
npx skills add https://github.com/awesome-copilot/awesome-copilot --skill java-junit -a codex -y
npx skills add https://github.com/awesome-copilot/awesome-copilot --skill create-spring-boot-java-project -a codex -y
npx skills add https://github.com/affaan-m/everything-claude-code --skill java-coding-standards -a codex -y
npx skills add https://github.com/pluginagentmarketplace/custom-plugin-java --skill java-maven -a codex -y
npx skills add https://github.com/planetscale/database-skills --skill mysql -a codex -y
npx skills add https://github.com/mindrally/skills --skill mysql-best-practices -a codex -y
```

这些技能的职责建议在技术方案中一并说明：

- `java-springboot`：Spring Boot 工程最佳实践
- `java-junit`：JUnit 5+ 测试最佳实践
- `create-spring-boot-java-project`：Spring Boot Java 项目初始化辅助
- `java-coding-standards`：Java 编码规范
- `java-maven`：Maven 工程与构建辅助
- `mysql`：MySQL 使用与设计辅助
- `mysql-best-practices`：MySQL 最佳实践与约束补充

### 3. 其他 skills 安装策略

在完成上述固定安装后，再通过 `find-skills` 基于当前项目实际技术栈继续查找并补充安装其他技能，例如：

- API 设计与接口约束
- 测试与 TDD
- 代码规范、Lint、Review
- 安全审查
- 可观测性与运行诊断
- 消息队列、缓存、对象存储、部署平台等专项能力

补充约束如下：

- 先安装固定技能，再使用 `find-skills` 扩展
- 技术方案中如果推荐安装某个额外 skill，必须给出真实可执行命令，不能只写 skill 名称
- 如果当前仓库已有 `AGENTS.md`，skill 选择应优先遵循其中已有的协作与质量要求

### 4. skills 安装命令规范

技术方案中如果涉及 skills 安装，必须给出明确命令，不要只写技能名称。默认安装命令固定为：

```bash
npx skills add https://github.com/<owner>/<repo> --skill <name> -a codex -y
```

约束如下：

- `owner`、`repo`、`name` 必须替换为真实值，不能在最终方案里保留占位符
- 对每个建议安装的 skill，优先给出单独可执行命令
- 如果某个 skill 安装失败，可以按同一命令最多重试三次
- 技术方案里应明确写出“失败可重试三次”的处理说明
- 若某个 skill 不是从 GitHub 仓库安装，必须显式说明原因与替代安装方式，不能静默偏离默认命令格式

## 禁止事项

- 不要在没有先做技术方案的情况下直接执行 Spring 建项命令
- 不要在没有论证的情况下默认上多模块，也不要在明显需要拆分时强行塞进单模块
- 不要把启动模块写成业务实现模块
- 不要把 Controller 放进 `api` 或 `common`
- 不要把具体业务约束、业务错误码、业务表前缀、业务流程直接从参考项目复制进新项目模板
- 不要把密钥、明文密码、私有地址、临时联调配置直接写入可提交文件
- 不要遗漏根目录 `AGENTS.md`
- 不要在仓库已有 `AGENTS.md` 时跳过读取
- 不要把本应沉淀到根级 `AGENTS.md` 的项目规约只写在聊天记录、PR 描述或一次性技术方案里
- 不要在最终方案里只写 “后续再装 skill” 这类占位描述；必须至少写清 `find-skills` 安装命令，以及其他推荐技能的真实安装命令或选择策略

## 输出要求

如果最终推荐创建 Spring 项目，技术方案中必须体现工程结构、模块边界、环境配置、`AGENTS.md` 方案、skills 安装方案和部署约束，而不是只写业务逻辑。
