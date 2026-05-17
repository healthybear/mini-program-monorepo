# 调试检查清单

## 前端检查（微信开发者工具控制台）

### 1. 检查自动登录日志

在控制台搜索以下关键词：

```
✅ 应该看到：
- "检测到未登录，尝试微信自动登录..."
- "微信登录-code: {code: 'xxx'}"
- "微信登录-res: {token: 'xxx'}" 或 "{accessToken: 'xxx'}"
- "登录成功"

❌ 如果看到：
- "微信登录失败" → 说明 /auth/wxLogin 接口有问题
- 没有任何登录相关日志 → 说明 App.vue 的 onLaunch 没有执行
```

### 2. 检查 token 是否存在

在控制台执行：

```javascript
uni.getStorageSync("token");
```

应该看到一个包含 token 信息的对象。

### 3. 检查 API 请求头

在 Network 面板找到失败的请求：

```
GET https://localhost:3443/api/v1/waisik/explore-records?pageNum=1&pageSize=10&sortBy=latest
```

查看 Request Headers：

```
✅ 应该有：
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

❌ 如果没有 Authorization 头：
- 说明登录失败或 token 未保存
```

## 后端检查

### 1. 检查 `/auth/wxLogin` 接口

**测试方法：**

```bash
# 使用 curl 或 Postman 测试
POST https://localhost:3443/auth/wxLogin
Content-Type: application/json

{
  "code": "test_code_123"
}
```

**期望返回：**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 7200
}
```

或

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "accessExpiresIn": 7200,
  "refreshExpiresIn": 604800
}
```

### 2. 检查 `/api/v1/waisik/explore-records` 接口

**查看后端日志中的错误信息：**

常见错误类型：

#### 错误 1: 数据库连接失败

```
Error: connect ECONNREFUSED 127.0.0.1:27017
或
Error: Client does not support authentication protocol
```

**解决：** 启动数据库服务（MongoDB/MySQL/PostgreSQL）

#### 错误 2: 表/集合不存在

```
Error: Table 'waisik.explore_records' doesn't exist
或
MongoError: ns not found
```

**解决：** 运行数据库迁移脚本创建表

#### 错误 3: Token 解析失败

```
Error: Cannot read property 'id' of undefined
或
JsonWebTokenError: invalid token
```

**解决：** 检查 JWT 密钥配置，确保前后端一致

#### 错误 4: 用户不存在

```
Error: User not found
```

**解决：** 微信登录后需要在数据库中创建用户记录

#### 错误 5: 字段类型错误

```
TypeError: Cannot read property 'toString' of undefined
或
ValidationError: pageNum must be a number
```

**解决：** 检查查询参数类型转换

### 3. 检查数据库

**MongoDB 示例：**

```bash
# 连接数据库
mongo

# 切换到数据库
use waisik

# 检查集合是否存在
show collections

# 检查用户表
db.users.find()

# 检查探店记录表
db.explore_records.find()
```

**MySQL 示例：**

```sql
-- 检查表是否存在
SHOW TABLES LIKE 'explore_records';

-- 检查表结构
DESCRIBE explore_records;

-- 检查数据
SELECT * FROM explore_records LIMIT 10;
```

## 快速诊断命令

### 前端（微信开发者工具控制台）

```javascript
// 1. 检查是否登录
const tokenStore = useTokenStore();
console.log("是否登录:", tokenStore.hasLogin);
console.log("Token:", tokenStore.validToken);

// 2. 手动触发登录
await tokenStore.wxLogin();

// 3. 手动触发获取记录
const recordStore = useRecordStore();
await recordStore.fetchRecords(true);
```

### 后端（服务器终端）

```bash
# 检查后端服务是否运行
curl https://localhost:3443/health

# 检查数据库连接
# (根据你的后端框架和数据库类型调整命令)
```

## 常见解决方案

### 问题 1: 微信登录失败

**原因：** 后端 `/auth/wxLogin` 接口不存在或有 bug

**解决：**

1. 确认后端实现了该接口
2. 检查接口是否需要微信 AppID 和 AppSecret 配置
3. 测试接口是否能正确处理微信 code

### 问题 2: Token 无效

**原因：** JWT 密钥不匹配或 token 格式错误

**解决：**

1. 检查后端 JWT 密钥配置
2. 确认 token 返回格式符合 `IAuthLoginRes` 类型
3. 检查 token 是否包含必要的用户信息（如 userId）

### 问题 3: 数据库查询失败

**原因：** 数据库未初始化或表结构不匹配

**解决：**

1. 运行数据库迁移脚本
2. 检查表结构是否与 `IExploreRecord` 类型匹配
3. 确认数据库连接配置正确

### 问题 4: 用户不存在

**原因：** 微信登录后未创建用户记录

**解决：**

1. 修改 `/auth/wxLogin` 接口，首次登录时自动创建用户
2. 或者添加用户注册流程

## 下一步

请按照以上步骤检查，并提供：

1. 微信开发者工具控制台的完整日志（特别是登录相关的）
2. 后端服务器的错误日志（500 错误的详细堆栈信息）
3. 数据库中是否存在相关表和数据

这样我才能准确定位问题所在。
