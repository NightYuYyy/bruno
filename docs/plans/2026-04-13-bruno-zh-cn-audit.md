# Bruno 全量中文可见文案审计与补译 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 对 Bruno 前端与 Electron 壳层中剩余的用户可见英文文案做尽量全量的审计、补 key 与中文化，完成后可通过本地构建预览。

**Architecture:** 以 i18n 资源为中心，先补齐 `en.json` / `zh-CN.json` 的缺失 key，再将组件、toast、Yup 校验、Electron 菜单中的硬编码英文替换为 `t()` / `i18n.t()`。实现按模块分批推进，每批都补最小测试并立即验证，避免大范围回归。

**Tech Stack:** React 19, react-i18next, Jest, Electron, Redux Toolkit, Formik, Yup

---

### Task 1: 建立翻译 key 基线

**Files:**
- Modify: `packages/bruno-app/src/i18n/translation/en.json`
- Modify: `packages/bruno-app/src/i18n/translation/zh-CN.json`
- Modify: `packages/bruno-app/src/i18n/index.spec.js`

**Step 1: 写失败测试**

在 `packages/bruno-app/src/i18n/index.spec.js` 增加断言，覆盖本轮会用到的代表性 key，例如：
- `WORKSPACE.CREATE_TITLE`
- `WORKSPACE.IMPORT_TITLE`
- `WORKSPACE.COLLECTION_NOT_CLONED`
- `COOKIES.MODIFY_TITLE`
- `ELECTRON_MENU.COLLECTION`

**Step 2: 运行测试确认失败**

Run: `npm test --workspace=packages/bruno-app -- src/i18n/index.spec.js --runInBand`
Expected: FAIL，提示缺少新增 key 或取值不匹配。

**Step 3: 写最小实现**

在 `en.json` / `zh-CN.json` 中新增本轮所需分组与 key，优先按域组织：
- `WORKSPACE`
- `COOKIES`
- `ELECTRON_MENU`
- 必要时补 `COMMON` / `VALIDATION`

**Step 4: 运行测试确认通过**

Run: `npm test --workspace=packages/bruno-app -- src/i18n/index.spec.js --runInBand`
Expected: PASS

**Step 5: 提交**

```bash
git add packages/bruno-app/src/i18n/translation/en.json packages/bruno-app/src/i18n/translation/zh-CN.json packages/bruno-app/src/i18n/index.spec.js
git commit -m "feat(i18n): add workspace cookie and electron menu keys"
```

### Task 2: 翻译 Workspace 创建/导入/概览链路

**Files:**
- Modify: `packages/bruno-app/src/components/WorkspaceSidebar/CreateWorkspace/index.js`
- Modify: `packages/bruno-app/src/components/WorkspaceSidebar/ImportWorkspace/index.js`
- Modify: `packages/bruno-app/src/components/WorkspaceHome/WorkspaceOverview/CollectionsList/index.js`
- Create: `packages/bruno-app/src/components/WorkspaceSidebar/CreateWorkspace/index.spec.js`
- Create: `packages/bruno-app/src/components/WorkspaceSidebar/ImportWorkspace/index.spec.js`
- Create: `packages/bruno-app/src/components/WorkspaceHome/WorkspaceOverview/CollectionsList/index.spec.js`

**Step 1: 写失败测试**

为 3 个组件分别写最小渲染测试，断言以下中文文案存在：
- CreateWorkspace：标题、按钮、Location/Folder Name 帮助文案、Yup 校验信息
- ImportWorkspace：导入标题、zip 拖拽提示、Extract Location 帮助文案、失败 toast
- CollectionsList：空状态文案、未 clone / 未落盘 / 不能重命名等提示

**Step 2: 运行测试确认失败**

Run: `npm test --workspace=packages/bruno-app -- src/components/WorkspaceSidebar/CreateWorkspace/index.spec.js src/components/WorkspaceSidebar/ImportWorkspace/index.spec.js src/components/WorkspaceHome/WorkspaceOverview/CollectionsList/index.spec.js --runInBand`
Expected: FAIL，仍能看到英文文案或断言找不到中文。

**Step 3: 写最小实现**

- 组件接入 `useTranslation()`
- 将 modal title / description / confirmText / label / help / empty-state / toast / Yup 错误改为 `t(...)`
- 复用 `VALIDATION` 与 `WORKSPACE` 分组 key，避免重复硬编码

**Step 4: 运行测试确认通过**

Run: `npm test --workspace=packages/bruno-app -- src/components/WorkspaceSidebar/CreateWorkspace/index.spec.js src/components/WorkspaceSidebar/ImportWorkspace/index.spec.js src/components/WorkspaceHome/WorkspaceOverview/CollectionsList/index.spec.js --runInBand`
Expected: PASS

**Step 5: 提交**

```bash
git add packages/bruno-app/src/components/WorkspaceSidebar/CreateWorkspace/index.js packages/bruno-app/src/components/WorkspaceSidebar/ImportWorkspace/index.js packages/bruno-app/src/components/WorkspaceHome/WorkspaceOverview/CollectionsList/index.js packages/bruno-app/src/components/WorkspaceSidebar/CreateWorkspace/index.spec.js packages/bruno-app/src/components/WorkspaceSidebar/ImportWorkspace/index.spec.js packages/bruno-app/src/components/WorkspaceHome/WorkspaceOverview/CollectionsList/index.spec.js
git commit -m "feat(i18n): translate workspace create import and collections overview"
```

### Task 3: 翻译 Collection 行为提示与 Cookie 弹窗

**Files:**
- Modify: `packages/bruno-app/src/providers/ReduxStore/slices/collections/actions.js`
- Modify: `packages/bruno-app/src/utils/collections/emptyStateRequest.js`
- Modify: `packages/bruno-app/src/components/Cookies/ModifyCookieModal/index.js`
- Create: `packages/bruno-app/src/components/Cookies/ModifyCookieModal/index.spec.js`
- Create/Modify: `packages/bruno-app/src/utils/collections/emptyStateRequest.spec.js`

**Step 1: 写失败测试**

- Cookie modal：断言标题、raw mode 解析错误、增删改 cookie 成功/失败提示走中文
- emptyStateRequest：断言请求类型 label 与失败提示使用 i18n
- 如 `collections/actions.js` 中出现纯函数可抽取，再对抽取函数写最小测试；若暂不抽取，则至少覆盖被 UI 直接消费的 helper

**Step 2: 运行测试确认失败**

Run: `npm test --workspace=packages/bruno-app -- src/components/Cookies/ModifyCookieModal/index.spec.js src/utils/collections/emptyStateRequest.spec.js --runInBand`
Expected: FAIL

**Step 3: 写最小实现**

- 将 `toast.success/error` 文案改为 `i18n.t(...)`
- 对 Cookie 表单中的 Yup 错误与 modal 标题统一走 `t(...)`
- 对 `emptyStateRequest` 中的类型标签与错误提示统一走 i18n
- 对 `collections/actions.js` 中高频成功/失败提示做分组替换，优先覆盖保存、重命名、创建文件夹、添加到 workspace、变量编辑限制等用户直接可见文案

**Step 4: 运行测试确认通过**

Run: `npm test --workspace=packages/bruno-app -- src/components/Cookies/ModifyCookieModal/index.spec.js src/utils/collections/emptyStateRequest.spec.js --runInBand`
Expected: PASS

**Step 5: 提交**

```bash
git add packages/bruno-app/src/providers/ReduxStore/slices/collections/actions.js packages/bruno-app/src/utils/collections/emptyStateRequest.js packages/bruno-app/src/components/Cookies/ModifyCookieModal/index.js packages/bruno-app/src/components/Cookies/ModifyCookieModal/index.spec.js packages/bruno-app/src/utils/collections/emptyStateRequest.spec.js
git commit -m "feat(i18n): translate collection action toasts and cookie modal"
```

### Task 4: 翻译 Electron 菜单与壳层文案

**Files:**
- Modify: `packages/bruno-electron/src/app/menu-template.js`
- Create: `packages/bruno-electron/src/app/menu-template.spec.js`

**Step 1: 写失败测试**

创建 `menu-template.spec.js`，断言顶层与关键子菜单 label 走中文 key，例如：
- Collection / Open Collection / Open Recent / Clear Recent
- Quit / Force Quit
- View / Actual Size / Zoom In / Zoom Out
- About Bruno / Documentation

**Step 2: 运行测试确认失败**

Run: `npm test --workspace=packages/bruno-electron -- src/app/menu-template.spec.js --runInBand`
Expected: FAIL，菜单仍是英文。

**Step 3: 写最小实现**

- 在 Electron 层引入共享 i18n 实例或最小可复用翻译访问方式
- 保持 `role` 不变，只替换显式 label
- 不改菜单结构和 click 行为

**Step 4: 运行测试确认通过**

Run: `npm test --workspace=packages/bruno-electron -- src/app/menu-template.spec.js --runInBand`
Expected: PASS

**Step 5: 提交**

```bash
git add packages/bruno-electron/src/app/menu-template.js packages/bruno-electron/src/app/menu-template.spec.js
git commit -m "feat(i18n): translate electron menu labels"
```

### Task 5: 全量验证与本地预览

**Files:**
- Verify: `packages/bruno-app/src/i18n/translation/en.json`
- Verify: `packages/bruno-app/src/i18n/translation/zh-CN.json`
- Verify: `packages/bruno-electron/out/**`

**Step 1: 运行相关测试集合**

Run: `npm test --workspace=packages/bruno-app -- src/i18n/index.spec.js src/components/WorkspaceSidebar/CreateWorkspace/index.spec.js src/components/WorkspaceSidebar/ImportWorkspace/index.spec.js src/components/WorkspaceHome/WorkspaceOverview/CollectionsList/index.spec.js src/components/Cookies/ModifyCookieModal/index.spec.js src/utils/collections/emptyStateRequest.spec.js --runInBand`
Expected: PASS

Run: `npm test --workspace=packages/bruno-electron -- src/app/menu-template.spec.js --runInBand`
Expected: PASS

**Step 2: 构建确认**

Run: `npm run build:web`
Expected: exit 0

Run: `npm run build:electron`
Expected: exit 0，并产出 `packages/bruno-electron/out/win-unpacked/resources/app.asar`

**Step 3: 本地预览验证**

- 备份本机 Bruno 安装目录中的 `resources/app.asar`
- 替换为新构建产物
- 启动 Bruno，抽查以下路径：
  - 创建 Workspace
  - 导入 Workspace
  - Workspace 概览 / CollectionsList
  - Cookie 修改弹窗
  - Electron 顶部菜单

**Step 4: 最终提交**

```bash
git status --short
git add <all translated files>
git commit -m "feat(i18n): finish visible zh-CN translation audit"
```
