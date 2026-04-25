# Workflow: Implement From Design

## Required Reading

**Read these reference files NOW:**
1. `references/context-reading.md`
2. `references/design-mapping.md`
3. `references/implementation-rules.md`

## Process

## Step 1: Do the analysis prework first

- 即使用户直接要求“照着设计稿实现”，也不能跳过前置分析。
- 先完成需求读取、项目规则读取、代码现状分析和设计稿映射。
- 如果这些前置步骤还没做完，先补齐，再进入编码。

## Step 2: Decide the implementation strategy

- 如果是新增需求：确认是新建页面、替换占位页，还是在现有路由下完整覆盖内容区。
- 如果是增量需求：确认保留哪些已有实现、替换哪些局部模块、补齐哪些缺失状态。
- 明确哪些公共壳层保持不动，例如 header、sidebar、breadcrumb、global layout。

## Step 3: Normalize style and component decisions

- 先盘点设计稿中的布局规则、间距节奏、颜色、阴影、圆角、字号、字重、状态变化和组件层级。
- 与项目现有主题变量、token、样式体系和组件库做映射。
- 优先复用已有组件；确实缺少时，再新增局部组件或提炼公共组件。

## Step 4: Infer only what is necessary

- 设计稿缺失的空态、加载态、错误态、禁用态和响应式细节，按现有设计语言补齐。
- 推断只为补全闭环，不为炫技或自由发挥。
- 推断出的组件、布局和视觉细节必须与同页面、同模块和全站风格保持一致。

## Step 5: Implement in the smallest safe scope

- 只改本次需求直接涉及的页面内容区、局部组件和相关样式。
- 避免把原本稳定的页面壳层、导航、公共布局和无关模块卷入这次改造。
- 如果发现必须调整公共组件或主题变量，先确认影响范围，再做最小必要改动。

## Step 6: Verify both fidelity and behavior

- 对照设计稿检查布局层级、间距、视觉节奏、组件状态和整体风格一致性。
- 对照业务逻辑检查：交互路径、数据状态、空态、异常态、权限态、响应式表现是否仍然成立。
- 如果页面依赖已有 header、sidebar 或父级布局，确保新改动不会破坏这些区域的已实现行为。

## Step 7: Report what changed and what was inferred

- 总结修改了哪些页面、组件、样式和公共能力。
- 明确哪些内容来自设计稿，哪些属于受约束推断。
- 如果还有未能确认的视觉或业务细节，单独列出待确认项，而不是静默硬编码。

## Success Criteria

This workflow is complete when:

- [ ] 编码前分析步骤已经完成
- [ ] 已根据新增/增量类型选择正确策略
- [ ] 已复用现有组件并控制改动边界
- [ ] 已对缺失设计做必要且克制的推断
- [ ] 最终实现同时通过设计还原度和业务行为检查
- [ ] 输出中明确说明了改动范围与推断项
