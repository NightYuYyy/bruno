# Bruno 简体中文本地汉化设计

**日期：** 2026-04-10

## 目标
- 面向你本地长期使用，优先把 Bruno 开源桌面端里高频、可见、常用界面尽量改成简体中文。
- 保持打包链路可用，不引入额外复杂配置。
- 默认直接显示中文，不优先做语言切换入口。

## 当前现状
- 项目已接入 `i18next` / `react-i18next`，但覆盖面很低。
- `packages/bruno-app/src/i18n/translation/` 下目前只有 `en.json`。
- 许多核心 UI 文案仍然直接写死在组件中。
- 说明基础设施已具备，但要达到“可用汉化”，需要同时做词条补全和组件接入。

## 设计决策
1. 新增 `zh-CN.json`，并把默认语言切到 `zh-CN`。
2. 保留并扩展 `en.json`，避免后续回退或继续国际化时丢失英文基线。
3. 先覆盖高频区域：欢迎引导、顶部菜单、首页工作区、创建/导入 Collection、搜索、关闭工作区、支持页。
4. 尽量不改业务逻辑，只抽离显示文案。
5. 使用最小必要测试覆盖默认语言和代表性界面，最后跑构建验证。

## 范围
- `packages/bruno-app/src/i18n/*`
- `packages/bruno-app/src/components/WelcomeModal/*`
- `packages/bruno-app/src/components/AppTitleBar/AppMenu/index.js`
- `packages/bruno-app/src/components/WorkspaceHome/WorkspaceOverview/index.js`
- `packages/bruno-app/src/components/Sidebar/CreateCollection/index.js`
- `packages/bruno-app/src/components/Sidebar/ImportCollection/*`
- `packages/bruno-app/src/components/Sidebar/ImportCollectionLocation/index.js`
- `packages/bruno-app/src/components/Sidebar/BulkImportCollectionLocation/index.js`
- `packages/bruno-app/src/components/Sidebar/CloseWorkspace/index.js`
- `packages/bruno-app/src/components/Sidebar/Collections/CollectionSearch/index.js`
- `packages/bruno-app/src/components/Preferences/Support/index.js`

## 非目标
- 不追求一次性覆盖仓库全部字符串。
- 不处理官网/文档站翻译。
- 不引入复杂语言选择设置页。