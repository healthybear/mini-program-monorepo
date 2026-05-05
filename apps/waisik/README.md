# Waisik 小程序

基于 uni-app 框架开发的跨平台小程序应用，支持微信、支付宝、字节跳动等多个小程序平台以及 H5 和 App。

## 技术栈

- **框架**: uni-app 3.x + Vue 3 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **UI 组件库**: wot-design-uni
- **样式方案**: UnoCSS + SCSS
- **网络请求**: Alova
- **图标**: @iconify/carbon + 自定义 SVG 图标
- **路由**: @uni-helper/vite-plugin-uni-pages (约定式路由)
- **布局**: @uni-helper/vite-plugin-uni-layouts
- **国际化**: vue-i18n

## 项目特性

- ✅ TypeScript 类型支持
- ✅ 约定式路由，自动生成 pages.json
- ✅ 自定义 Tabbar，支持 UnoCSS 图标
- ✅ 统一设计规范（基于 wot-design-uni）
- ✅ UnoCSS 原子化 CSS，内置常用快捷类
- ✅ 组件自动导入
- ✅ API 自动导入
- ✅ 多环境配置（development/test/production）
- ✅ 请求拦截和登录拦截
- ✅ Pinia 状态持久化

## 目录结构

```
apps/waisik/
├── env/                          # 环境变量配置
│   ├── .env.development         # 开发环境
│   ├── .env.test                # 测试环境
│   └── .env.production          # 生产环境
├── scripts/                      # 构建脚本
├── src/
│   ├── api/                     # API 接口定义
│   ├── components/              # 公共组件
│   ├── config/                  # 配置文件
│   │   └── design-tokens.ts    # 设计规范配置（唯一数据源）
│   ├── http/                    # 网络请求封装
│   ├── pages/                   # 页面
│   │   ├── index/              # 首页
│   │   ├── map/                # 附近
│   │   ├── explore/            # 探店
│   │   ├── statistical/        # 历程
│   │   ├── me/                 # 我的
│   │   └── about/              # 关于
│   ├── router/                  # 路由配置
│   ├── static/                  # 静态资源
│   │   ├── app/icons/          # App 图标
│   │   ├── images/             # 图片资源
│   │   └── my-icons/           # 自定义 SVG 图标
│   ├── store/                   # Pinia 状态管理
│   ├── tabbar/                  # 自定义 Tabbar
│   ├── types/                   # 类型定义
│   ├── utils/                   # 工具函数
│   ├── App.vue                  # 应用入口
│   ├── main.ts                  # 主入口文件
│   ├── manifest.json            # 应用配置（自动生成）
│   ├── pages.json               # 页面配置（自动生成）
│   └── uni.scss                 # uni-app 全局样式变量
├── manifest.config.ts           # manifest 配置源文件
├── pages.config.ts              # pages 配置源文件
├── uno.config.ts                # UnoCSS 配置
├── vite.config.ts               # Vite 配置
└── package.json

```

## 开发指南

### 环境要求

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### 安装依赖

在项目根目录执行：

```bash
pnpm install
```

### 开发运行

```bash
# H5 开发
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp-weixin

# 支付宝小程序
pnpm dev:mp-alipay

# 字节跳动小程序
pnpm dev:mp-toutiao

# App 开发
pnpm dev:app
```

### 构建打包

```bash
# H5 生产构建
pnpm build:h5:prod

# 微信小程序生产构建
pnpm build:mp:prod

# App 生产构建
pnpm build:app:prod
```

### 多环境运行

```bash
# 开发环境（默认）
pnpm dev:mp

# 测试环境
pnpm dev:mp:test

# 生产环境
pnpm dev:mp:prod
```

## 设计规范

项目使用统一的设计规范配置，基于 wot-design-uni 组件库标准。

### 设计 Token 管理

- **唯一数据源**: `src/config/design-tokens.ts`
- **UnoCSS 配置**: `uno.config.ts` 直接导入 design-tokens.ts
- **uni-app 变量**: `src/uni.scss` 需手动保持与 design-tokens.ts 一致

### 颜色系统

```typescript
// 主题色
primary: "#0957DE";

// 功能色
success: "#07c160";
warning: "#ff976a";
danger: "#ee0a24";
error: "#ee0a24";
info: "#1989fa";

// 文本颜色
textPrimary: "#323233";
textSecondary: "#646566";
textPlaceholder: "#c8c9cc";

// 背景颜色
bgPage: "#f7f8fa";
bgCard: "#ffffff";
bgGrey: "#f8f8f8";
```

### UnoCSS 快捷类

```html
<!-- 布局 -->
<view class="flex-center">居中布局</view>
<view class="flex-between">两端对齐</view>
<view class="flex-col-center">垂直居中</view>

<!-- 文本 -->
<text class="text-ellipsis">单行省略</text>
<text class="text-ellipsis-2">两行省略</text>

<!-- 尺寸 -->
<view class="wh-full">宽高100%</view>

<!-- 交互 -->
<view class="click-active">点击效果</view>

<!-- 安全区域 -->
<view class="pt-safe">顶部安全区</view>
<view class="pb-safe">底部安全区</view>
```

## 自定义 Tabbar

项目使用自定义 Tabbar，配置文件：`src/tabbar/config.ts`

### Tabbar 页面

- 首页 (index) - `i-carbon-home`
- 附近 (map) - `i-carbon-location`
- 探店 (explore) - `i-carbon-explore`
- 历程 (statistical) - `i-carbon-chart-line`
- 我的 (me) - `i-carbon-user`

### 切换 Tabbar 策略

```typescript
// src/tabbar/config.ts
export const selectedTabbarStrategy = TABBAR_STRATEGY_MAP.CUSTOM_TABBAR;

// 可选值：
// NO_TABBAR: 无 tabbar
// NATIVE_TABBAR: 原生 tabbar
// CUSTOM_TABBAR: 自定义 tabbar（当前使用）
```

## 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 提交信息遵循 Conventional Commits 规范

```bash
# 代码检查
pnpm lint

# 自动修复
pnpm lint:fix

# 类型检查
pnpm type-check
```

## 平台兼容性

| H5  | iOS | Android | 微信小程序 | 支付宝小程序 | 字节小程序 | 百度小程序 |
| --- | --- | ------- | ---------- | ------------ | ---------- | ---------- |
| ✅  | ✅  | ✅      | ✅         | ✅           | ✅         | ✅         |

## 注意事项

1. **环境变量**: 所有环境变量必须以 `VITE_` 开头才能在代码中访问
2. **静态资源**: 图片等静态资源放在 `src/static` 目录下
3. **自动生成文件**: `src/manifest.json` 和 `src/pages.json` 由配置文件自动生成，不要手动修改
4. **UnoCSS 图标**: 动态使用的图标需要添加到 `uno.config.ts` 的 `safelist` 中
5. **设计规范**: 修改设计 token 时，需同时更新 `design-tokens.ts` 和 `uni.scss`

## 相关链接

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [wot-design-uni 组件库](https://wot-design-uni.pages.dev/)
- [UnoCSS 文档](https://unocss.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Alova 文档](https://alova.js.org/)

## License

MIT

Copyright (c) 2025
