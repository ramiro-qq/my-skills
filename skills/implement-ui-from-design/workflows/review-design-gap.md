# Workflow: Review Design Gap

## Required Reading

**Read these reference files NOW:**
1. `references/context-reading.md`
2. `references/design-mapping.md`
3. `references/implementation-rules.md`

## Process

## Step 1: Read the same context as implementation work

- 即使只是做差异审查，也必须读取需求来源、项目规则和相关代码。
- 不要只拿设计稿和页面截图做纯视觉点评，要结合真实业务边界判断哪些差异是问题，哪些属于已有壳层或复用约束。

## Step 2: Build a section-by-section mapping

- 按页面区域、功能模块、组件层级和关键状态建立映射。
- 区分以下几类差异：
  - 缺失实现
  - 视觉还原度不足
  - 组件复用错误
  - 主题/风格不一致
  - 业务状态缺失
  - 不应改动但被误改的公共壳层

## Step 3: Judge with context, not pure aesthetics

- 如果项目已经实现统一 header、sidebar、tab shell，而本次需求只涉及内容区，默认不把壳层差异计入本次问题。
- 如果设计稿展示的是完整页面，但项目采用共享布局，优先审查内容区是否与设计目标一致。
- 如果现有实现与设计稿不一致但原因来自项目约束、组件库限制或业务策略，要明确写出，不要机械判错。

## Step 4: Output a repair list

- 按优先级输出问题清单：
  - 高优先级：影响业务、信息层级或主视觉结构的差异
  - 中优先级：影响还原度和统一性的局部差异
  - 低优先级：不影响主流程的细节优化项
- 对每个问题说明：当前现象、对应设计目标、建议改法、影响文件或组件、是否需要公共组件抽取。

## Success Criteria

This workflow is complete when:

- [ ] 差异审查建立在需求、规则和代码现状之上
- [ ] 已识别真正需要修复的差异，而不是泛泛列视觉意见
- [ ] 已区分内容区问题与公共壳层问题
- [ ] 输出了按优先级排序的修正清单
