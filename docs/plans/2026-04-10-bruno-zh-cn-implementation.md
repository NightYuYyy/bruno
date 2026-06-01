# Bruno 简体中文汉化 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 Bruno 开源桌面端补上第一版可长期本地使用的简体中文界面，并保持本地构建可用。

**Architecture:** 在现有 `i18next` 基础上补充 `zh-CN` 资源并扩展英文资源作为基线；优先把高频组件中的硬编码 UI 文案改为 `t(...)`。默认语言切换为中文，先不增加独立语言设置入口。

**Tech Stack:** React 19、react-i18next、Jest、Testing Library、Electron、rsbuild

---

### Task 1: 为默认中文行为写失败测试

**Files:**
- Create: `packages/bruno-app/src/i18n/index.spec.js`
- Test: `packages/bruno-app/src/i18n/index.spec.js`

**Step 1: Write the failing test**
- 断言默认语言为 `zh-CN`
- 断言公共 key 返回中文

**Step 2: Run test to verify it fails**
- Run: `npm.cmd run test --workspace=packages/bruno-app -- src/i18n/index.spec.js --runInBand`

**Step 3: Write minimal implementation**
- 修改 `packages/bruno-app/src/i18n/index.js`
- 新增 `packages/bruno-app/src/i18n/translation/zh-CN.json`
- 扩展 `packages/bruno-app/src/i18n/translation/en.json`

**Step 4: Run test to verify it passes**
- 重新运行同一测试

### Task 2: 为代表性欢迎页/菜单文案写失败测试

**Files:**
- Create: `packages/bruno-app/src/components/WelcomeModal/index.spec.js`
- Create: `packages/bruno-app/src/components/AppTitleBar/AppMenu/index.spec.js`

**Step 1: Write the failing tests**
- WelcomeModal 断言中文标题/按钮出现
- AppMenu 断言菜单数据里是中文标签

**Step 2: Run tests to verify they fail**
- Run: `npm.cmd run test --workspace=packages/bruno-app -- src/components/WelcomeModal/index.spec.js src/components/AppTitleBar/AppMenu/index.spec.js --runInBand`

**Step 3: Write minimal implementation**
- 修改欢迎引导相关组件
- 修改 `AppMenu` 接入 `useTranslation`

**Step 4: Run tests to verify they pass**
- 重新运行同一测试

### Task 3: 批量接入高频 UI 的 i18n

**Files:**
- Modify: `packages/bruno-app/src/components/WorkspaceHome/WorkspaceOverview/index.js`
- Modify: `packages/bruno-app/src/components/Sidebar/CreateCollection/index.js`
- Modify: `packages/bruno-app/src/components/Sidebar/ImportCollection/index.js`
- Modify: `packages/bruno-app/src/components/Sidebar/ImportCollection/FileTab.js`
- Modify: `packages/bruno-app/src/components/Sidebar/ImportCollection/GitHubTab.js`
- Modify: `packages/bruno-app/src/components/Sidebar/ImportCollection/UrlTab.js`
- Modify: `packages/bruno-app/src/components/Sidebar/ImportCollectionLocation/index.js`
- Modify: `packages/bruno-app/src/components/Sidebar/BulkImportCollectionLocation/index.js`
- Modify: `packages/bruno-app/src/components/Sidebar/CloseWorkspace/index.js`
- Modify: `packages/bruno-app/src/components/Sidebar/Collections/CollectionSearch/index.js`
- Modify: `packages/bruno-app/src/components/Preferences/Support/index.js`

**Step 1: Replace hardcoded UI strings with `t(...)`**
**Step 2: Add required translation keys**
**Step 3: Keep logic-only code untouched**

### Task 4: 验证构建和回归

**Files:**
- Verify only

**Step 1: Run targeted tests**
- Run: `npm.cmd run test --workspace=packages/bruno-app -- src/i18n/index.spec.js src/components/WelcomeModal/index.spec.js src/components/AppTitleBar/AppMenu/index.spec.js --runInBand`

**Step 2: Run app build**
- Run: `npm.cmd run build:web`

**Step 3: Review diff**
- Run: `git -C C:\Users\zhengjiyong\bruno diff --stat`

**Step 4: Summarize remaining untranslated areas**
- 记录仍有英文残留的模块，作为后续第二轮汉化清单