# Bruno Full zh-CN Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 Bruno 本地自用版完成高覆盖率简体中文界面与运行时提示汉化。

**Architecture:** 基于现有 `i18next/react-i18next` 继续扩展，不改回纯中文硬编码。按“菜单系统 → 弹窗与表单 → 运行时提示 → 平台相关文案 → 深层页面”的顺序分批推进，每批都补最少必要测试并跑构建验证。

**Tech Stack:** React 19、Electron、react-i18next、Jest、Testing Library、rsbuild

---

### Task 1: Collection 与 CollectionItem 菜单系统汉化

**Files:**
- Modify: `packages/bruno-app/src/components/Sidebar/Collections/Collection/index.js`
- Modify: `packages/bruno-app/src/components/Sidebar/Collections/Collection/CollectionItem/index.js`
- Modify: `packages/bruno-app/src/utils/common/platform.js`
- Modify: `packages/bruno-app/src/i18n/translation/en.json`
- Modify: `packages/bruno-app/src/i18n/translation/zh-CN.json`
- Test: `packages/bruno-app/src/components/Sidebar/Collections/Collection/index.spec.js`（若无则新建）

**Step 1: 写失败测试**
- 断言截图中的 Collection 菜单项是中文。

**Step 2: 跑测试确认失败**
- Run: `npm.cmd run test --workspace=packages/bruno-app -- src/components/Sidebar/Collections/Collection/index.spec.js --runInBand`

**Step 3: 实现最小改动**
- 新增 `COLLECTION_MENU` / `ITEM_MENU` 翻译 key。
- 给两个菜单组件接入 `useTranslation()`。
- 把 `getRevealInFolderLabel()` 改成从 i18n 返回平台文案。

**Step 4: 跑测试确认通过**
- 重新运行同一测试。

### Task 2: Sidebar 其余高频菜单与弹窗

**Files:**
- Modify: `packages/bruno-app/src/components/Sidebar/**`
- 重点：`NewFolder`、`NewRequest`、`RemoveCollection`、`Sections/CollectionsSection`

**Step 1: 扫描硬编码菜单/弹窗文案**
**Step 2: 分批替换为 `t(...)`**
**Step 3: 跑对应测试或补最小测试**

### Task 3: 运行时提示与 toast 中文化

**Files:**
- Modify: `packages/bruno-app/src/providers/ReduxStore/slices/**`
- Modify: `packages/bruno-app/src/components/**`
- Modify: `packages/bruno-app/src/utils/common/**`

**Step 1: 扫描 `toast.error/success`、`confirmText`、空状态、错误提示**
**Step 2: 抽到翻译 key**
**Step 3: 回归测试或构建验证**

### Task 4: 深层页面扫尾

**Files:**
- Modify: `packages/bruno-app/src/components/CollectionSettings/**`
- Modify: `packages/bruno-app/src/components/RequestTabs/**`
- Modify: `packages/bruno-app/src/components/ManageWorkspace/**`
- Modify: `packages/bruno-app/src/components/OpenAPISyncTab/**`

**Step 1: 优先扫用户日常可见页面**
**Step 2: 再处理边缘页面**
**Step 3: 记录残留英文清单**

### Task 5: 统一验证

**Files:**
- Verify only

**Step 1: 跑本轮新增测试**
- Run: `npm.cmd run test --workspace=packages/bruno-app -- <targeted specs> --runInBand`

**Step 2: 跑前端构建**
- Run: `npm.cmd run build:web`

**Step 3: 如涉及桌面版，再跑打包**
- Run: `npm.cmd run build:electron`

**Step 4: 查看 diff**
- Run: `git -C C:\Users\zhengjiyong\code\bruno diff --stat`
