# Tabbar（`@repo/shared/components/tabbar`）

跨 app 复用的**纯 UI**底部导航：胶囊悬浮条、主题色与单项覆盖。

## 使用方式

在宿主应用中：

```ts
import { Tabbar, defaultTabbarTheme, type SharedTabBarItem } from '@repo/shared/components/tabbar'
```

- 通过 **`items`** 传入列表（类型见 `SharedTabBarItem`）。
- **`currentIndex`** 为受控选中下标；切换时监听 **`@change`**，在宿主内更新状态并执行 `uni.switchTab` 等。
- **`theme`** 传入 `Partial<typeof defaultTabbarTheme>` 覆盖默认胶囊样式与颜色。
- **`resolve-text`** 传入文案解析函数（如 i18n 的 `t` 封装）。
- **`iconType: 'uiLib'`** 时需在宿主侧通过 **`#uiLib-icon`** 插槽自行渲染 `wd-icon` 等。

宿主仍负责：`pages.json` / 原生 tabbar 配置、`uni.hideTabBar`、路由缓存策略、角色过滤后的 `items` 列表（实现位置由宿主自行决定，例如 `src/config/tab-bar.ts` + `src/store/tab-bar.ts`）。

## 单项可选字段

| 字段 | 说明 |
|------|------|
| `iconActive` | `image`：选中图 URL；`unocss` / `iconfont`：选中时的类名 |
| `activeColor` / `inactiveColor` | 覆盖主题中的选中/未选中颜色 |
| `textActive` | 选中时使用的文案 key（仍由 `resolve-text` 解析） |

---

## 共享包总览（新增组件 / 方法、调用、更新）

**本文件只描述 Tabbar 本身。**  
关于在 monorepo 里**如何新增其它共享组件、共享工具方法、如何在 app 里引用、如何更新 `exports`、Uno 扫描、可选 Vite Resolver** 等，请阅读：

- **[`packages/shared/README.md`](../../../README.md)**（从本文件出发的相对路径：`../../../README.md`）
