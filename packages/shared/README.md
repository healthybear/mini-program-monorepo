# `@repo/shared` 共享包说明

本包为 monorepo 内的 workspace 包，供各 `apps/*` 通过依赖引用。**源码即产物**（当前无单独 build 产物目录）；修改后保存即可被依赖方拉取，无需发包版本号（`workspace:*` 始终指向本地包）。

## 目录约定

| 路径 | 用途 |
|------|------|
| `src/components/<组件名>/` | 每个共享 UI 组件单独目录：`*.vue`、`index.ts` 导出、`types.ts`（可选）、`README.md`（可选） |
| `src/utils/` | （可选）纯函数、常量、与 Vue 无关的工具；按文件或子路径导出 |
| `src/index.js` / `src/index.d.ts` | 根入口；可逐步把常用导出聚合到这里 |

## 新增共享 UI 组件

1. 新建目录：`packages/shared/src/components/<Name>/`
2. 放置 `YourComp.vue`，并增加 `index.ts`：
   ```ts
   export { default as YourComp } from './YourComp.vue'
   export type { ... } from './types' // 若有
   ```
3. 在 [`package.json`](./package.json) 的 `exports` 中增加子路径，例如：
   ```json
   "./components/<name>": {
     "types": "./src/components/<name>/index.ts",
     "import": "./src/components/<name>/index.ts",
     "default": "./src/components/<name>/index.ts"
   }
   ```
4. 在宿主 app 的 `package.json` 中确保已有：`"@repo/shared": "workspace:*"`（与现有 waisik 一致即可）。

### 在宿主中调用

**显式 import（推荐、最清晰）**

```ts
import { YourComp } from '@repo/shared/components/<name>'
```

**配合 `@uni-helper/vite-plugin-uni-components` 的 Resolver 按需解析（可选）**

在宿主 `vite.config.ts` 里为 `UniComponents` 配置 `resolvers`，把模板标签名映射到 `@repo/shared/components/<name>` 的导出（可参考 `apps/waisik` 里 `SharedTabbar` → `Tabbar` 的写法）。模板里即可写 `<YourAlias />` 而无需手写 import。

### UnoCSS / 原子类

若组件内使用 Uno 类名，宿主 app 的 `uno.config.ts` 应把 `packages/shared/src` 纳入 `content.filesystem` 扫描（或维护 `safelist`），否则动态类可能不进产物。

## 新增共享方法（工具函数）

1. 在 `packages/shared/src/utils/` 下新增文件，例如 `format.ts`。
2. 在 `package.json` 的 `exports` 增加条目，例如：
   ```json
   "./utils/format": {
     "types": "./src/utils/format.ts",
     "import": "./src/utils/format.ts",
     "default": "./src/utils/format.ts"
   }
   ```
   或在根 `src/index.js` 中 `export { ... } from './utils/format.js'` 后从 `@repo/shared` 根路径引用（需与现有 `index.js` 风格一致）。

### 在宿主中调用

```ts
import { someFn } from '@repo/shared/utils/format'
// 或根入口 export 后：
import { someFn } from '@repo/shared'
```

工具模块**不要**依赖具体 app 的 `@/`、`pages.json` 等；跨端 API 若使用 `uni`，建议以 **peer** 或文档约定由宿主保证运行环境。

## 路径别名 `@shared`（宿主侧）

在宿主 `vite.config.ts` 中可将 `@shared` 指向 `packages/shared/src`（见 `apps/waisik` 配置），便于：

```ts
import { x } from '@shared/utils/...'
```

与 **`@repo/shared` 包 exports** 二选一或并存：`exports` 适合稳定对外 API；`@shared` 适合内部路径或过渡期。

## 如何更新

- 直接修改 `packages/shared` 下源码；依赖 `workspace:*` 的 app **重新 dev/build** 即可拿到最新逻辑。
- 若改了 `package.json` 的 `exports`，需确认各宿主未缓存旧解析（一般重启 Vite 即可）。
- CI/协作：共享包变更与 app 变更可在同一 MR 中提交，无需单独发布 npm 包。

## 与 Tabbar 文档的关系

Tabbar 的 props、主题、类型等见 [`src/components/tabbar/README.md`](./src/components/tabbar/README.md)。
