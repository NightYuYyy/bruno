# Bruno 全量中文可见文案审计与补译设计

**日期：** 2026-04-13  
**分支：** `zhengjiyong/zh-cn-preview-20260413`

## 目标

在不改动业务行为的前提下，对 Bruno 前端与 Electron 壳层中的**用户可见英文文案**做尽量全量的审计与补译，补齐 `zh-CN` 国际化资源，并将硬编码英文改为统一走 i18n。

## 范围

本轮纳入：

- `packages/bruno-app/src/components/**`
- `packages/bruno-app/src/providers/**`
- `packages/bruno-app/src/utils/**` 中会返回给 UI 的提示文案
- `packages/bruno-electron/src/app/**` 中用户可见菜单/窗口文案
- 已有 `zh-CN` 资源文件：`packages/bruno-app/src/i18n/translation/zh-CN.json`

本轮排除：

- 协议常量、请求示例、测试输入数据
- 纯开发调试日志、注释、Storybook 展示文案
- 非用户直接可见的内部错误对象字段

## 审计原则

1. 只处理**用户能看到**的字符串。
2. 优先复用现有 key；确实缺失时再新增 key。
3. 不改变运行逻辑，只替换文案来源。
4. 组件文案、toast、Yup 校验、confirm/modal 文案统一纳入。
## 推荐方案

采用“**用户可见字符串全量审计优先**”方案：

- 先做代码级扫描，建立剩余英文文案清单
- 再按模块分批补 `t()` / `i18n.t()` 和 `zh-CN` key
- 每批做针对性测试与一次构建验证
- 最后再做安装包预览验证，检查漏网文案

## 分批策略

### Batch 1：工作区与导入链路
- `WorkspaceSidebar/CreateWorkspace`
- `WorkspaceSidebar/ImportWorkspace`
- `WorkspaceHome/WorkspaceOverview/CollectionsList`
- Import/Open Collection 相关剩余提示

### Batch 2：Collection/Request 行为提示
- `providers/ReduxStore/slices/collections/actions.js`
- `utils/collections/emptyStateRequest.js`
- 相关成功/失败 toast、变量编辑限制提示

### Batch 3：通用错误与辅助 UI
- `providers/App/useIpcEvents.js`
- `providers/ReduxStore/slices/notifications.js`
- `components/Cookies/ModifyCookieModal`
- 其它表单校验与低频弹窗

### Batch 4：Electron 壳层用户可见文案
- `packages/bruno-electron/src/app/menu-template.js`
- 如有必要，再补 About/Recent/原生菜单相关文案

## 验证策略

- 每批至少补一个针对性测试，优先覆盖新增 key 或关键文案选择逻辑
- 每批执行相关 Jest 测试
- 全部完成后执行 `npm run build:web`
- 若涉及桌面端菜单/窗口文案，再执行 `npm run build:electron` 并做本地预览
