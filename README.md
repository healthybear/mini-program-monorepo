# Mini Program Monorepo

基于 pnpm workspaces 的小程序 monorepo 项目。

## 项目结构

```
mini-program-monorepo/
├── apps/              # 应用程序
│   └── waisik/       # Waisik 小程序项目
├── .changeset/        # Changesets 版本管理
├── .husky/            # Git hooks
├── package.json       # 根配置
├── pnpm-workspace.yaml
├── tsconfig.base.json # 基础 TypeScript 配置
└── eslint.config.js   # 基础 ESLint 配置
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 运行开发模式

```bash
# 运行 waisik 微信小程序
pnpm dev:waisik

# 或进入子项目目录
cd apps/waisik
pnpm dev:mp-weixin
```

### 构建

```bash
# 构建 waisik 微信小程序
pnpm build:waisik

# 或进入子项目目录
cd apps/waisik
pnpm build:mp-weixin
```

### 添加依赖

```bash
# 在根目录添加共享依赖
pnpm add <package> -w

# 在特定应用中添加依赖
pnpm --filter @mini-program-monorepo/waisik add <dependency>
```

## 要求

- Node.js >= 20.0.0
- pnpm >= 9.0.0

## Git 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，通过 commitlint 和 husky 强制执行。

提交格式：`<type>(<scope>): <subject>`

常用 type：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链相关
