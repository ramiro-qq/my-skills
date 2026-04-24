# 浏览器联调工具选型

这份 reference 用来解决一个实际问题：联调过程中什么时候该用 `chrome-devtools MCP`，什么时候该用 `Browser Use`，什么时候该用 `agent-browser`，什么时候只能退回到 `Computer Use`。

目标不是“把所有工具都用一遍”，而是根据证据类型选择最短路径。

## 结论先行

默认优先级建议：

1. `chrome-devtools MCP`
2. `Browser Use` / in-app browser
3. `agent-browser`
4. `Computer Use`

原因：

- `chrome-devtools MCP` 最适合联调里的浏览器证据采集，尤其是 console、network、lighthouse、performance trace、DOM 快照和当前页面状态确认。
- `Browser Use` 最适合在 Codex 内置浏览器里完成页面导航、交互、截图和 DOM 级观察，适合重放联调流程和复现 UI 问题。
- `agent-browser` 最适合做可重复的浏览器脚本、带状态的会话测试、页面 diff、下载测试和性能 profile 导出，适合更长流程或半自动化回归。
- `Computer Use` 适合结构化 DOM 拿不到时的兜底场景，例如 canvas、复杂桌面弹窗、浏览器外原生窗口或无可用浏览器自动化接口的页面。

## 工具对比

| 工具 | 最适合解决的问题 | 强项 | 局限 | 建议定位 |
| --- | --- | --- | --- | --- |
| `chrome-devtools MCP` | 控制台报错、请求失败、重定向、性能问题、Lighthouse、当前页面真实状态确认 | 直接读 console、network、快照、screenshot、performance trace、lighthouse | 更偏分析与诊断，不是最顺手的长流程脚本工具 | 联调里的浏览器证据首选 |
| `Browser Use` | 在 in-app browser 中打开本地页面、导航、点击、填写、截图、DOM 观察 | 与当前 Codex 浏览器集成紧、适合交互式重放流程、适合本地页面验证 | 网络与性能分析能力不如 DevTools 直接，流程脚本沉淀不如 CLI 稳定 | 浏览器交互和 UI 流程复现首选 |
| `agent-browser` | 可重复脚本、会话持久化、页面 diff、下载、headed 调试、性能 profile 文件导出 | CLI 能力全、支持 profiler、session、diff、CDP 连接、适合重复执行 | 不如 DevTools 方便做当前页即时诊断；对当前线程内页面状态不如 in-app browser 紧密 | 长流程自动化和回归工具 |
| `Computer Use` | canvas、无障碍树不完整页面、系统弹窗、浏览器外窗口 | 可直接操作桌面和应用窗口 | 很难拿到结构化 network/console/performance 证据 | 最后兜底，不作为首选 |

## 1. `chrome-devtools MCP`

适合场景：

- 看控制台错误、警告、未捕获异常
- 看接口请求、响应、状态码、请求头、重定向
- 做性能分析、Lighthouse 检查、页面 trace
- 需要精确知道“当前浏览器页面到底发生了什么”

你可以用它做的事情：

- 页面导航与截图
- 文本快照和 DOM 可访问性树检查
- 控制台日志读取
- Network 请求列表和请求详情读取
- Lighthouse 审计
- Performance trace 启停与 insight 分析

建议优先用它的情况：

- 页面报错但代码阅读还不能定位
- 请求在浏览器里失败，但 curl 或服务端日志看起来正常
- 登录态、重定向、跨域、资源加载、CSR hydration、控制台 warning 影响页面行为
- 用户明确提到“看看浏览器日志”“看看 network”“看看 performance”

## 2. `Browser Use`

适合场景：

- 打开 localhost、本地预览页或当前 in-app browser 页面
- 执行联调主流程：打开页面、点击、输入、提交、切换页面、截图
- 基于 DOM snapshot 做页面结构理解和页面行为复现

优点：

- 与当前 Codex in-app browser 工作流贴合
- 适合边看边操作、边调边验证
- 本地页面和局部交互验证效率高

不足：

- 不是最强的 network/performance 专项分析工具
- 更适合“重放流程 + 看结果”，不如 DevTools 适合抓浏览器内部证据

建议定位：

- 联调过程里的 UI 行为复现和流程重放首选
- 需要日志、network 或性能证据时，再切到 `chrome-devtools MCP`

## 3. `agent-browser`

适合场景：

- 同一流程要重复执行多次
- 需要保留 session、cookie、登录状态
- 需要导出性能 profile 文件
- 需要做页面 diff、下载验证、headed 可视化调试

关键能力：

- `snapshot` / `click` / `fill` / `wait`
- `state save/load` 和 `session`
- `screenshot` / `pdf` / `diff`
- `profiler start/stop`
- 连接已有 Chrome CDP

优点：

- 更像浏览器联调自动化工具箱
- 很适合把回归流程脚本化
- profile 导出后可以丢进 Chrome DevTools / Perfetto 分析

不足：

- 对“当前这个线程里用户正在看的页面”不如 in-app browser 自然
- 调即看、看即改的流畅度不如 DevTools + Browser Use 组合

建议定位：

- 需要重复跑主流程、做回归、导出 trace 或做对比时使用

## 4. `Computer Use`

适合场景：

- 页面是 canvas、虚拟列表、复杂拖拽，DOM/无障碍树拿不到有效结构
- 出现系统权限弹窗、浏览器原生弹窗、文件选择器等自动化难点
- 需要跨应用观察，例如浏览器 + 原生客户端 + 桌面系统窗口

不足：

- 证据结构化程度最低
- 不适合做 network、console、performance 级分析

建议定位：

- 浏览器结构化工具失效后的兜底方案

## 推荐工作流

### A. 常规前后端联调

1. 先用 `Browser Use` 或 `agent-browser` 重放主流程。
2. 一旦发现页面异常、请求异常或控制台异常，切到 `chrome-devtools MCP` 收集证据。
3. 如果流程需要多次回归，沉淀成 `agent-browser` 脚本化步骤。

### B. 浏览器报错 / 请求异常优先

1. 直接用 `chrome-devtools MCP` 看 console 和 network。
2. 明确错误边界后，再回到代码或接口层修正。
3. 修正后用 `Browser Use` 重放主流程确认页面行为。

### C. 页面性能 / 卡顿 / 首屏慢

1. 优先 `chrome-devtools MCP` 做 performance trace 或 Lighthouse。
2. 需要稳定导出 profile 归档时，用 `agent-browser profiler`.

### D. DOM 工具失效

1. 尝试 `Computer Use`。
2. 明确说明此时拿到的是视觉/交互证据，不是结构化浏览器内部证据。

## 最终建议

把浏览器工具分工固定下来：

- `chrome-devtools MCP`：证据采集和诊断中枢
- `Browser Use`：页面交互和流程重放主力
- `agent-browser`：可重复自动化与性能 profile 补充
- `Computer Use`：最后兜底

联调时不要随机换工具。先明确你要的证据类型，再选对应工具。
