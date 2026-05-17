# Waisik 小程序配置指南

## 已完成的修复

### 1. 高德地图配置

#### 问题

- 微信小程序：定位失败 "getLocation:fail translate coordinate system faild, map provider not configured"
- H5 环境：地图组件报错 "Map key not configured"

#### 解决方案

**微信小程序：**

- ✅ 已在 `manifest.config.ts` 中配置位置权限和隐私接口声明
- ✅ 需要在微信开发者工具中授权位置权限（见下方步骤）

**H5 环境：**

- ✅ 已使用条件编译隐藏地图组件，仅保留搜索功能
- ✅ H5 环境下使用搜索功能选择位置（不受 HTTPS 限制）

### 2. API 地址配置

#### 问题

- 微信小程序中 API 请求地址被硬编码为 `https://ukw0y1.laf.run`
- 环境变量 `VITE_SERVER_BASEURL` 配置被覆盖

#### 解决方案

- ✅ 已修改 `src/utils/index.ts` 中的 `getEnvBaseUrl()` 函数
- ✅ 现在会优先使用环境变量配置的地址
- ✅ 当前配置：`https://localhost:3443`

### 3. 微信自动登录

#### 问题

- 后端 API 需要认证令牌
- 应用没有登录页面

#### 解决方案

- ✅ 已在 `App.vue` 中添加微信小程序自动登录逻辑
- ✅ 应用启动时自动调用 `wxLogin()` 获取令牌

## 微信开发者工具配置步骤

### 1. 关闭域名校验（开发环境）

1. 打开微信开发者工具
2. 点击右上角"详情"
3. 进入"本地设置"标签
4. 勾选"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"

### 2. 授权位置权限

**方法一：通过开发者工具**

1. 点击"详情" → "权限"标签
2. 找到"位置信息"
3. 确保已授权

**方法二：清除授权重新测试**

1. 点击"清缓存" → "清除授权数据"
2. 重新运行小程序
3. 首次使用定位功能时会弹出授权提示
4. 点击"允许"授权

### 3. 配置服务器域名（生产环境）

在微信公众平台配置以下域名：

**request 合法域名：**

- `https://localhost:3443`（开发环境，需要关闭域名校验）
- `https://your-production-api.com`（生产环境）

**uploadFile 合法域名：**

- 同上

## 环境变量配置

### 开发环境

文件：`env/.env.development`

```env
# 后台请求地址
# 注意：H5 开发建议使用 HTTP 避免 SSL 证书问题
# 微信小程序开发需要在开发者工具中关闭域名校验
VITE_SERVER_BASEURL = 'https://localhost:3443'

# 高德地图 Web 服务 API Key（在 .env.development.local 中配置）
VITE_AMAP_WEB_SERVICE_KEY = ''
```

文件：`env/.env.development.local`（不提交到 Git）

```env
# 高德地图 Web 服务 API Key
VITE_AMAP_WEB_SERVICE_KEY = 'your_key_here'
```

### 微信小程序多环境配置（可选）

如果需要为微信小程序的不同版本配置不同的 API 地址：

```env
# 开发版
VITE_SERVER_BASEURL__WEIXIN_DEVELOP = 'https://dev-api.example.com'

# 体验版
VITE_SERVER_BASEURL__WEIXIN_TRIAL = 'https://trial-api.example.com'

# 正式版
VITE_SERVER_BASEURL__WEIXIN_RELEASE = 'https://api.example.com'
```

## 后端 API 要求

### 微信登录接口

**接口：** `POST /auth/wxLogin`

**请求参数：**

```json
{
  "code": "微信登录凭证"
}
```

**返回数据：**

```json
{
  "token": "jwt_token",
  "expiresIn": 7200
}
```

或双 token 模式：

```json
{
  "accessToken": "access_token",
  "accessExpiresIn": 7200,
  "refreshToken": "refresh_token",
  "refreshExpiresIn": 604800
}
```

### 创建探店记录接口

**接口：** `POST /api/v1/waisik/explore-records`

**请求头：**

```
Authorization: Bearer {token}
```

**请求参数：**

```json
{
  "shop": "餐厅ID或临时ID",
  "foodName": "食物名称",
  "rating": 5,
  "images": ["图片URL数组"],
  "tags": ["标签数组"],
  "content": "备注内容",
  "price": 100,
  "location": {
    "latitude": 39.90923,
    "longitude": 116.397428,
    "address": "详细地址"
  }
}
```

## 测试步骤

### 1. 测试微信自动登录

1. 清除小程序缓存和授权数据
2. 重新启动小程序
3. 查看控制台输出：
   - 应该看到 "检测到未登录，尝试微信自动登录..."
   - 成功后显示 "微信自动登录成功"
4. 如果失败，检查后端 `/auth/wxLogin` 接口是否正常

### 2. 测试定位功能

1. 进入"新建探店记录"页面
2. 点击"选择位置"
3. 点击定位按钮（右上角）
4. 首次使用会弹出授权提示，点击"允许"
5. 定位成功后会显示当前位置

### 3. 测试搜索功能

1. 在位置选择器中，输入地点名称（如"北京天安门"）
2. 点击搜索
3. 从搜索结果中选择位置
4. 确认选择

### 4. 测试创建记录

1. 上传至少一张照片
2. 填写餐厅名称、食物名称
3. 选择评分
4. 选择位置（可选）
5. 点击"保存"
6. 查看控制台网络请求：
   - 请求头应包含 `Authorization: Bearer {token}`
   - 请求地址应为 `https://localhost:3443/api/v1/waisik/explore-records`

## 常见问题

### Q1: 定位一直失败怎么办？

**A:** 检查以下几点：

1. 微信开发者工具是否已授权位置权限
2. 是否关闭了域名校验
3. 查看控制台错误信息
4. 如果仍然失败，使用搜索功能代替

### Q2: API 请求返回 401 未授权

**A:** 检查以下几点：

1. 查看控制台是否有 "微信自动登录成功" 的日志
2. 检查后端 `/auth/wxLogin` 接口是否正常
3. 检查请求头是否包含 `Authorization` 字段
4. 清除缓存重新登录

### Q3: H5 环境下定位失败

**A:** H5 环境下的定位需要 HTTPS 协议（localhost 除外）：

- 开发环境：使用 `http://localhost:9001` 访问
- 生产环境：部署到 HTTPS 服务器
- 或者使用搜索功能代替定位

### Q4: 高德地图搜索无结果

**A:** 检查以下几点：

1. 确认 `.env.development.local` 中配置了 `VITE_AMAP_WEB_SERVICE_KEY`
2. 检查 API Key 是否有效
3. 使用更具体的关键词（如"北京天安门"而不是"天安门"）
4. 查看高德开放平台的调用量是否超限

### Q5: H5 环境下 API 请求报 SSL 证书错误 (ERR_CERT_AUTHORITY_INVALID)

**A:** 这是因为 `https://localhost:3443` 使用了自签名证书或无效证书。解决方案：

**方案一：使用 HTTP（推荐用于开发环境）**

1. 修改 `env/.env.development` 中的 `VITE_SERVER_BASEURL` 为 `http://localhost:3443`
2. 重新运行 `pnpm dev:h5`

**方案二：配置浏览器信任证书**

1. Chrome：访问 `chrome://flags/#allow-insecure-localhost`，启用该选项
2. 或者在证书错误页面点击"高级" → "继续访问"

**方案三：使用 mkcert 生成本地可信证书**

```bash
# 安装 mkcert
npm install -g mkcert

# 创建本地 CA
mkcert -install

# 为 localhost 生成证书
mkcert localhost 127.0.0.1 ::1

# 在后端服务中使用生成的证书文件
```

**注意：** 微信小程序不受此问题影响，只需在开发者工具中关闭域名校验即可。

### Q6: API 请求返回 500 Internal Server Error

**A:** 这是后端服务器错误，前端请求已正确发送。检查以下几点：

**前端检查：**

1. 查看微信开发者工具控制台，确认是否有 "微信自动登录成功" 的日志
2. 在 Network 面板查看请求头是否包含 `Authorization: Bearer {token}`
3. 确认请求 URL 和参数格式正确

**后端检查（重点）：**

1. **查看后端日志**：找到具体的错误堆栈信息
2. **数据库连接**：确认数据库服务是否正常运行
3. **数据表结构**：确认 `explore-records` 相关的表是否存在且结构正确
4. **用户认证**：确认后端能正确解析 JWT token 并获取用户信息
5. **字段映射**：确认后端期望的字段名与数据库实际字段名一致

**常见原因：**

- 数据库未启动或连接失败
- 数据表不存在或字段缺失
- Token 解析失败，无法获取当前用户
- 后端代码逻辑错误（如空指针、类型转换失败等）

**调试建议：**

```bash
# 后端日志通常会显示详细错误，例如：
# - "Cannot read property 'id' of undefined" → token 解析失败
# - "Table 'explore_records' doesn't exist" → 数据表不存在
# - "Connection refused" → 数据库连接失败
```

## 相关文档

- [高德地图模块文档](src/modules/amap/README.md)
- [高德地图常见问题](src/modules/amap/FAQ.md)
- [uni-app 位置 API](https://uniapp.dcloud.net.cn/api/location/location.html)
- [微信小程序登录](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html)

---

**最后更新：** 2026-05-17
