# 高德地图模块 - 常见问题

## H5 定位失败问题

### 问题描述

在 H5 环境下使用定位功能时，出现以下错误：

```
定位失败: Error: 获取位置失败: getLocation:fail Only secure origins are allowed
```

### 原因

浏览器的安全策略要求：**只有在 HTTPS 协议下才能访问地理位置 API**。

在本地开发环境（HTTP）下，浏览器会阻止地理位置访问。

### 解决方案

#### 方案一：使用 HTTPS（推荐）

**开发环境：**

1. 使用 Vite 的 HTTPS 开发服务器：

```bash
# 安装 @vitejs/plugin-basic-ssl
pnpm add -D @vitejs/plugin-basic-ssl

# 在 vite.config.ts 中配置
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [basicSsl()],
  server: {
    https: true
  }
}
```

2. 或使用 ngrok 等工具创建 HTTPS 隧道：

```bash
# 安装 ngrok
npm install -g ngrok

# 启动隧道
ngrok http 9000
```

**生产环境：**

确保部署到支持 HTTPS 的服务器（如 Vercel、Netlify、阿里云 OSS 等）。

#### 方案二：使用搜索功能（已实现）

LocationPicker 组件已经提供了搜索功能作为降级方案：

1. 点击搜索框
2. 输入地点名称（如"北京天安门"）
3. 从搜索结果中选择

#### 方案三：仅在小程序中使用定位

小程序环境不受 HTTPS 限制，可以正常使用定位功能。

### 错误处理优化

模块已经优化了错误提示：

- **H5 环境**：提示用户使用搜索功能
- **小程序环境**：显示具体的错误信息

```ts
// 自动检测环境并给出友好提示
const isH5 = typeof window !== "undefined" && !window.plus && !window.wx;
const errorMsg = isH5 ? "定位失败：H5 环境需要 HTTPS 协议才能使用定位功能，请使用搜索功能选择位置" : `获取位置失败: ${err.errMsg}`;
```

## 其他常见问题

### API Key 配置问题

**问题：** 提示 "高德地图 API Key 未配置"

**解决：** 在 `.env.development` 中配置：

```env
VITE_AMAP_WEB_SERVICE_KEY = 'your_key_here'
```

### 搜索无结果

**问题：** 搜索地点时返回空结果

**可能原因：**

1. API Key 配置错误
2. 关键词太模糊
3. 达到 API 调用限制

**解决：**

1. 检查 API Key 是否正确
2. 使用更具体的关键词（如"北京天安门"而不是"天安门"）
3. 查看高德开放平台的调用量统计

### 地图不显示

**问题：** 地图区域显示空白

**可能原因：**

1. 坐标值为 0 或无效
2. 网络问题

**解决：**

1. 检查传入的坐标是否有效
2. 确保网络连接正常

## 平台差异说明

| 功能         | H5 (HTTP) | H5 (HTTPS) | 微信小程序 | App |
| ------------ | --------- | ---------- | ---------- | --- |
| 搜索地点     | ✅        | ✅         | ✅         | ✅  |
| 地图选点     | ✅        | ✅         | ✅         | ✅  |
| 获取当前位置 | ❌        | ✅         | ✅         | ✅  |

## 最佳实践

1. **开发环境**：使用搜索功能测试，避免 HTTPS 配置复杂度
2. **生产环境**：部署到 HTTPS 服务器，启用完整功能
3. **小程序**：可以正常使用所有功能
4. **错误处理**：始终提供搜索作为降级方案

## 相关链接

- [浏览器地理位置 API 安全要求](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation_API)
- [Vite HTTPS 配置](https://vitejs.dev/config/server-options.html#server-https)
- [高德开放平台](https://lbs.amap.com/)
