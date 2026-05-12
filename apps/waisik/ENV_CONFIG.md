# 环境变量配置说明

## 文件说明

项目使用 Vite 的环境变量系统，支持多个环境配置文件：

```
env/
├── .env.development        # 开发环境配置（提交到 Git）
├── .env.development.local  # 开发环境本地配置（不提交，存放敏感信息）
├── .env.production         # 生产环境配置（提交到 Git）
└── .env.production.local   # 生产环境本地配置（不提交，存放敏感信息）
```

## 配置优先级

Vite 会按以下优先级加载环境变量（后面的会覆盖前面的）：

1. `.env` - 所有环境通用
2. `.env.local` - 所有环境通用（本地，不提交）
3. `.env.[mode]` - 特定环境（如 `.env.development`）
4. `.env.[mode].local` - 特定环境本地配置（不提交）

## 敏感信息配置

**❌ 不要在以下文件中写入敏感信息：**

- `.env.development`
- `.env.production`
- 任何会提交到 Git 的文件

**✅ 应该在以下文件中配置敏感信息：**

- `.env.development.local`
- `.env.production.local`

这些 `.local` 文件已在 `.gitignore` 中，不会被提交到 Git。

## 示例

### .env.development（提交到 Git）

```env
# 后台请求地址
VITE_SERVER_BASEURL = 'http://localhost:3000'

# 高德地图 API Key（占位符，不要写真实 Key）
VITE_AMAP_WEB_SERVICE_KEY = ''
```

### .env.development.local（不提交，本地使用）

```env
# 高德地图 Web 服务 API Key（真实 Key）
VITE_AMAP_WEB_SERVICE_KEY = 'your_real_key_here'

# 其他敏感信息
# VITE_SECRET_TOKEN = 'xxx'
```

## 使用方式

在代码中通过 `import.meta.env` 访问：

```ts
const apiKey = import.meta.env.VITE_AMAP_WEB_SERVICE_KEY;
```

## 注意事项

1. **变量名必须以 `VITE_` 开头**才能在客户端代码中访问
2. **`.local` 文件优先级最高**，会覆盖同名变量
3. **修改环境变量后需要重启开发服务器**
4. **不要在代码中硬编码敏感信息**

## 团队协作

1. 提交 `.env.development` 和 `.env.production` 作为配置模板
2. 每个开发者创建自己的 `.local` 文件配置敏感信息
3. 在项目文档中说明需要配置哪些环境变量
4. 使用占位符或空值作为默认值

## 相关链接

- [Vite 环境变量文档](https://vitejs.dev/guide/env-and-mode.html)
