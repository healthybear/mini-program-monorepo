# mini-program-monorepo

基于 `pnpm workspace` 的小程序 Monorepo，当前包含：

- 母版模板：`_templates/unibest`
- 业务子项目：`apps/waisik`（包名：`@repo/waisik`，显示名：`WaiSik`）
- 共享包：`packages/shared`

## 环境要求

- Node.js `>= 18`
- pnpm `9.x`

## 安装依赖

```bash
pnpm install
```

## 常用命令

```bash
# 递归构建所有 workspace 包
pnpm build

# 递归 lint
pnpm lint
```

## 快速新建子项目

已内置命令：`new:app`，会从 `_templates/unibest` 复制出一个新子项目并自动完成基础改名。

```bash
pnpm new:app -- <app-name> [DisplayName]
```

示例：

```bash
pnpm new:app -- mall WaiSikMall
```

该命令会自动：

1. 创建 `apps/mall`
2. 删除子项目内 `pnpm-lock.yaml`
3. 将包名改为 `@repo/mall`
4. 将显示名称改为 `WaiSikMall`（同步到 env / 页面标题 / manifest）

创建后建议执行：

```bash
pnpm install
pnpm --filter @repo/mall run dev:h5
```

## 目录说明

```text
.
├── _templates/            # 子项目母版
├── apps/                  # 业务应用
├── packages/              # 共享包
├── scripts/new-app.mjs    # 新建子项目脚本
├── pnpm-workspace.yaml
└── package.json
```

## 推送远程仓库前建议

- 确认没有提交本地敏感配置（`.env`、密钥文件等）
- 保持根目录 `pnpm-lock.yaml` 纳入版本管理
- 不要提交 `dist`、`node_modules` 等产物（已通过 `.gitignore` 处理）
