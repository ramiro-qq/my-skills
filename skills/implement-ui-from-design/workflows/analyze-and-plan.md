# Workflow: Analyze and Plan

## Required Reading

**Read these reference files NOW:**
1. `references/context-reading.md`
2. `references/design-mapping.md`
3. `references/implementation-rules.md`

## Process

## Step 1: Read requirement sources first

- 先读取用户描述、需求文档、技术方案、设计稿说明或验收标准。
- 用简洁语言写清：本次需求要实现什么、服务什么业务目标、覆盖哪些用户动作、哪些结果算完成。
- 如果需求本身有明显歧义，先向用户确认关键歧义，不要带着模糊理解进入后续步骤。

## Step 2: Read project rules and constraints

- 优先读取 `AGENTS.md`；如果不存在，再读取 README、项目内规则文档、目录约定、代码规范和 UI 规范。
- 把和本次实现强相关的约束记录下来，例如：技术栈、主题体系、组件约定、路由组织、状态管理方式、是否允许抽公共组件。

## Step 3: Read the current implementation

- 读取目标功能相关的路由、页面、组件、接口、hooks、store、样式入口和主题变量。
- 识别现有业务流程：页面如何进入、数据从哪里来、有哪些关键状态与交互。
- 同时盘点项目里的 layout shell，例如 header、sidebar、tabs、page container、公共表单容器、弹窗壳层。

## Step 4: Map the design to the codebase

- 对照设计稿，建立“设计元素 -> 代码承载点”的映射。
- 明确哪些区域已经由项目实现，哪些是本次需求真正需要改造的内容区。
- 如果设计稿缺少局部状态或组件样式，基于现有主题和相邻设计做受约束推断，并标明这是推断项。

## Step 5: Classify the request

- **新增需求**：当前没有对应功能页面，或现有页面只是占位、空壳、演示页。
- **增量需求**：当前已有部分实现，需要在现有基础上补齐、重构或提升还原度。
- 针对两种类型分别输出改造策略，不要混用。

## Step 6: Scan reuse opportunities

- 扫描项目中可复用的组件、样式变量、布局容器、交互模式和数据展示模块。
- 如果现有功能里有多个相似实现，但尚未抽成公共组件，判断这次是否应顺手提炼，并说明提炼边界。
- 没有充分理由时，不要为了“看起来更优雅”而大范围重构。

## Step 7: Produce a focused implementation plan

- 输出本次涉及的页面、组件、文件、接口、状态与改造点。
- 明确 in scope / out of scope。
- 明确哪些区域不应改动，例如共用 header、sidebar、全局 layout、已有稳定模块。
- 如果用户当前只要求分析，到此结束，不进入编码。

## Success Criteria

This workflow is complete when:

- [ ] 已明确需求目标、业务逻辑和验收口径
- [ ] 已读取项目规则和相关上下文代码
- [ ] 已建立设计稿与页面/组件/文件的对应关系
- [ ] 已区分新增需求和增量需求
- [ ] 已识别可复用组件和不应改动的区域
- [ ] 已输出聚焦且可执行的改造方案
