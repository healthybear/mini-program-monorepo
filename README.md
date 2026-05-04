# Mini Program Monorepo

基于 pnpm workspaces 的小程序 monorepo 项目。

## 项目结构

```
mini-program-monorepo/
├── packages/          # 共享包和库
│   └── ...
├── apps/             # 应用程序
│   └── ...
├── package.json
├── pnpm-workspace.yaml
└── .npmrc
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 运行开发模式

```bash
# 运行所有包的开发模式
pnpm dev

# 运行特定包
pnpm --filter <package-name> dev
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter <package-name> build
```

### 添加依赖

```bash
# 在根目录添加依赖
pnpm add <package> -w

# 在特定包中添加依赖
pnpm --filter <package-name> add <dependency>
```

## 要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
