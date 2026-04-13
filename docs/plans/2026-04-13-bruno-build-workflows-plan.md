# Bruno Build Workflows Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 fork 版 Bruno 增加手动触发的 Windows x64 与 macOS（DMG/ZIP）打包流水线，并复用官方公开 workflow 风格。

**Architecture:** 复用官方 `.github/actions/common/setup-node-deps` 作为 Node 与依赖准备步骤；分别在 `windows-latest` 与 `macos-latest` 上执行前端构建与 Electron 打包。Windows 走当前仓库已有的 x64 配置；macOS 走 unsigned 本地自用构建，目标限定为 DMG/ZIP，并上传 artifact。

**Tech Stack:** GitHub Actions, electron-builder, npm workspaces, Node 22, Electron

---

### Task 1: 设计并新增 Windows 手动打包 workflow

**Files:**
- Create: `.github/workflows/build-win-local.yml`
- Reference: `.github/workflows/tests.yml`
- Reference: `.github/actions/common/setup-node-deps/action.yml`

**Step 1: 定义 `workflow_dispatch`**
**Step 2: 使用 `windows-latest`**
**Step 3: 复用 `setup-node-deps`**
**Step 4: 运行 `npm run build:web` 与 `npm run build:electron`**
**Step 5: 上传 `.exe` 与 `win-unpacked` artifact**

### Task 2: 设计并新增 macOS 手动打包 workflow

**Files:**
- Create: `.github/workflows/build-mac-local.yml`
- Reference: `packages/bruno-electron/electron-builder-config.js`

**Step 1: 定义 `workflow_dispatch`**
**Step 2: 使用 `macos-latest`**
**Step 3: 复用 `setup-node-deps`**
**Step 4: 构建前端并准备 Electron web 目录**
**Step 5: 在 `packages/bruno-electron` 下运行 unsigned `electron-builder` 生成 DMG/ZIP**
**Step 6: 上传 `.dmg`、`.zip` 与可选 unpacked app artifact**

### Task 3: 本地验证 workflow 文件结构

**Files:**
- Verify only

**Step 1: 检查 YAML 语法结构与字段一致性**
**Step 2: 对照官方 workflow 风格确认 actions 版本与权限设置**
**Step 3: 查看 `git diff --stat`**

### Task 4: 给用户说明使用方式与限制

**Files:**
- Verify only

**Step 1: 说明在 GitHub Actions 页面手动触发**
**Step 2: 说明 macOS 产物为未签名，仅适合自用测试**
**Step 3: 说明后续若要正式分发需加入 Apple 签名/公证 secrets**
