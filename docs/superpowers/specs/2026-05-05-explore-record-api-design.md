# 探店记录 API 设计文档

## 概述

本文档定义了探店记录功能的前端数据类型和 API 接口设计，以及后端开发任务清单。

探店记录是用户记录餐厅探店体验的核心功能，包含照片、评分、标签、评价等信息。

## 需求总结

### 功能需求

1. **探店记录管理**：创建、查询、更新、删除探店记录
2. **分页查询**：支持分页和排序（按创建时间、评分、价格）
3. **餐厅关联**：通过餐厅 ID 关联，冗余存储餐厅名称和地址
4. **标签系统**：每个记录独立统计标签选择次数
5. **用户关联**：记录创建者信息（ID、名称、头像）

### 技术栈

- **前端**：uni-app + Vue 3 + TypeScript + Alova
- **后端**：Node.js + Express（待实现）
- **数据格式**：JSON
- **时间格式**：ISO 8601

## 数据类型定义

### 1. 标签类型

```typescript
/**
 * 探店标签
 */
export interface ExploreTag {
  /** 标签名称 */
  name: string;
  /** 选择次数（每个记录独立统计） */
  count: number;
}
```

### 2. 地理位置类型

```typescript
/**
 * 地理位置信息
 */
export interface Location {
  /** 位置名称 */
  name: string;
  /** 详细地址 */
  address: string;
  /** 纬度 */
  latitude: number;
  /** 经度 */
  longitude: number;
}
```

### 3. 探店记录完整数据

```typescript
/**
 * 探店记录完整数据
 */
export interface ExploreRecord {
  /** 记录 ID */
  id: string;

  /** 用户信息 */
  userId: string;
  userName: string;
  userAvatar?: string;

  /** 餐厅信息 */
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;

  /** 探店内容 */
  images: string[]; // 图片 URL 数组
  rating: number; // 评分（0-5，步进 0.5）
  tags: ExploreTag[]; // 标签数组
  content?: string; // 评价内容（可选）
  foodNames?: string; // 食物名称（可选，多个用逗号或空格分隔）
  price?: number; // 人均消费，单位：元（可选）

  /** 地理位置（可选） */
  location?: Location;

  /** 时间信息 */
  createdAt: string; // 创建时间（ISO 8601 格式）
  updatedAt: string; // 更新时间（ISO 8601 格式）
}
```

### 4. 创建探店记录请求

```typescript
/**
 * 创建探店记录请求
 */
export interface CreateExploreRecordDto {
  /** 餐厅信息 */
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;

  /** 探店内容 */
  images: string[]; // 至少一张图片
  rating: number; // 必填，范围 0-5，步进 0.5
  tags: ExploreTag[]; // 标签数组
  content?: string; // 评价内容（可选）
  foodNames?: string; // 食物名称（可选）
  price?: number; // 价格（可选）

  /** 地理位置（可选） */
  location?: Location;
}
```

### 5. 更新探店记录请求

```typescript
/**
 * 更新探店记录请求
 * 所有字段都是可选的，只更新提供的字段
 */
export interface UpdateExploreRecordDto {
  restaurantName?: string;
  restaurantAddress?: string;
  images?: string[];
  rating?: number;
  tags?: ExploreTag[];
  content?: string;
  foodNames?: string;
  price?: number;
  location?: Location;
}
```

### 6. 列表查询请求

```typescript
/**
 * 探店记录列表查询参数
 */
export interface ExploreRecordListQuery {
  /** 页码，从 1 开始 */
  pageNum: number;
  /** 每页数量 */
  pageSize: number;
  /** 排序字段（可选） */
  sortBy?: "createdAt" | "rating" | "price";
  /** 排序方向（可选，默认 desc） */
  sortOrder?: "asc" | "desc";
}
```

### 7. 列表查询响应

```typescript
/**
 * 探店记录列表响应
 */
export interface ExploreRecordListResponse {
  /** 记录列表 */
  list: ExploreRecord[];
  /** 总记录数 */
  total: number;
}
```

### 8. 删除响应

```typescript
/**
 * 删除操作响应
 */
export interface DeleteResponse {
  success: boolean;
  message?: string;
}
```

## API 接口设计

### 基础路径

```
/api/explore-records
```

### 1. 创建探店记录

**接口**：`POST /api/explore-records`

**请求头**：

```
Content-Type: application/json
Authorization: Bearer <token>
```

**请求体**：

```typescript
CreateExploreRecordDto;
```

**响应**：

```typescript
{
  code: 200,
  message: "创建成功",
  data: ExploreRecord
}
```

**错误响应**：

- `400`：参数验证失败
- `401`：未授权
- `404`：餐厅不存在

---

### 2. 获取探店记录列表

**接口**：`GET /api/explore-records`

**请求头**：

```
Authorization: Bearer <token>
```

**查询参数**：

```
pageNum=1&pageSize=10&sortBy=createdAt&sortOrder=desc
```

**响应**：

```typescript
{
  code: 200,
  message: "查询成功",
  data: {
    list: ExploreRecord[],
    total: number
  }
}
```

**错误响应**：

- `400`：参数验证失败
- `401`：未授权

---

### 3. 获取探店记录详情

**接口**：`GET /api/explore-records/:id`

**请求头**：

```
Authorization: Bearer <token>
```

**路径参数**：

- `id`：记录 ID

**响应**：

```typescript
{
  code: 200,
  message: "查询成功",
  data: ExploreRecord
}
```

**错误响应**：

- `401`：未授权
- `404`：记录不存在

---

### 4. 更新探店记录

**接口**：`PUT /api/explore-records/:id`

**请求头**：

```
Content-Type: application/json
Authorization: Bearer <token>
```

**路径参数**：

- `id`：记录 ID

**请求体**：

```typescript
UpdateExploreRecordDto;
```

**响应**：

```typescript
{
  code: 200,
  message: "更新成功",
  data: ExploreRecord
}
```

**错误响应**：

- `400`：参数验证失败
- `401`：未授权
- `403`：无权限修改（不是创建者）
- `404`：记录不存在

---

### 5. 删除探店记录

**接口**：`DELETE /api/explore-records/:id`

**请求头**：

```
Authorization: Bearer <token>
```

**路径参数**：

- `id`：记录 ID

**响应**：

```typescript
{
  code: 200,
  message: "删除成功",
  data: {
    success: true
  }
}
```

**错误响应**：

- `401`：未授权
- `403`：无权限删除（不是创建者）
- `404`：记录不存在

## 字段说明和约束

### 必填字段

创建探店记录时，以下字段为必填：

- `restaurantId`：餐厅 ID
- `restaurantName`：餐厅名称
- `restaurantAddress`：餐厅地址
- `images`：至少一张图片
- `rating`：评分（0-5，步进 0.5）
- `tags`：标签数组（可以为空数组）

### 字段约束

1. **评分（rating）**
   - 类型：`number`
   - 范围：0 - 5
   - 步进：0.5
   - 有效值：0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5

2. **图片（images）**
   - 类型：`string[]`
   - 最少：1 张
   - 最多：6 张（建议）
   - 格式：完整的 URL 地址

3. **价格（price）**
   - 类型：`number`
   - 单位：元（人民币）
   - 范围：> 0
   - 精度：保留 2 位小数

4. **标签（tags）**
   - 类型：`ExploreTag[]`
   - 每个标签的 `count` 通常为 1
   - 标签名称不能为空

5. **时间字段**
   - 格式：ISO 8601（例如：`2026-05-05T10:30:00.000Z`）
   - 由后端自动生成和更新

### 删除策略

- 使用**硬删除**（物理删除）
- 删除记录时，相关的图片资源需要同步清理
- 只有记录创建者可以删除自己的记录

## 后端开发任务清单

### 数据库设计

#### 1. 探店记录表（explore_records）

```sql
CREATE TABLE explore_records (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_avatar VARCHAR(500),

  restaurant_id VARCHAR(36) NOT NULL,
  restaurant_name VARCHAR(200) NOT NULL,
  restaurant_address VARCHAR(500) NOT NULL,

  images JSON NOT NULL,              -- 图片 URL 数组
  rating DECIMAL(2,1) NOT NULL,      -- 评分 0-5，步进 0.5
  tags JSON NOT NULL,                -- 标签数组
  content TEXT,                      -- 评价内容
  food_names VARCHAR(500),           -- 食物名称
  price DECIMAL(10,2),               -- 价格

  location JSON,                     -- 地理位置信息

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_restaurant_id (restaurant_id),
  INDEX idx_created_at (created_at),
  INDEX idx_rating (rating)
);
```

#### 2. 餐厅表（restaurants）

```sql
CREATE TABLE restaurants (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(500) NOT NULL,
  phone VARCHAR(20),
  business_hours VARCHAR(200),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_name (name)
);
```

### API 实现任务

#### 任务 1：创建探店记录接口

**路由**：`POST /api/explore-records`

**实现要点**：

1. 验证用户身份（JWT token）
2. 验证请求参数：
   - `restaurantId` 必填且存在
   - `images` 至少一张
   - `rating` 范围 0-5，步进 0.5
   - `tags` 数组格式正确
3. 从 token 中提取用户信息（userId, userName, userAvatar）
4. 生成记录 ID（UUID）
5. 设置 `createdAt` 和 `updatedAt` 为当前时间
6. 插入数据库
7. 返回完整的记录数据

**错误处理**：

- 参数验证失败：返回 400
- 餐厅不存在：返回 404
- 数据库错误：返回 500

---

#### 任务 2：获取探店记录列表接口

**路由**：`GET /api/explore-records`

**实现要点**：

1. 验证用户身份
2. 解析查询参数：
   - `pageNum`（默认 1）
   - `pageSize`（默认 10，最大 100）
   - `sortBy`（默认 `createdAt`）
   - `sortOrder`（默认 `desc`）
3. 计算 offset：`(pageNum - 1) * pageSize`
4. 查询数据库：
   - 使用 `LIMIT` 和 `OFFSET` 分页
   - 使用 `ORDER BY` 排序
5. 查询总记录数（`COUNT(*)`）
6. 返回 `{ list, total }`

**排序字段映射**：

- `createdAt` → `created_at`
- `rating` → `rating`
- `price` → `price`

**错误处理**：

- 参数验证失败：返回 400
- 数据库错误：返回 500

---

#### 任务 3：获取探店记录详情接口

**路由**：`GET /api/explore-records/:id`

**实现要点**：

1. 验证用户身份
2. 从路径参数获取记录 ID
3. 查询数据库
4. 返回完整的记录数据

**错误处理**：

- 记录不存在：返回 404
- 数据库错误：返回 500

---

#### 任务 4：更新探店记录接口

**路由**：`PUT /api/explore-records/:id`

**实现要点**：

1. 验证用户身份
2. 从路径参数获取记录 ID
3. 查询记录是否存在
4. 验证权限：只有创建者可以更新
5. 验证请求参数（如果提供）：
   - `rating` 范围 0-5，步进 0.5
   - `images` 至少一张
   - `tags` 数组格式正确
6. 更新数据库（只更新提供的字段）
7. 更新 `updatedAt` 为当前时间
8. 返回更新后的完整记录数据

**错误处理**：

- 参数验证失败：返回 400
- 记录不存在：返回 404
- 无权限修改：返回 403
- 数据库错误：返回 500

---

#### 任务 5：删除探店记录接口

**路由**：`DELETE /api/explore-records/:id`

**实现要点**：

1. 验证用户身份
2. 从路径参数获取记录 ID
3. 查询记录是否存在
4. 验证权限：只有创建者可以删除
5. 删除数据库记录（硬删除）
6. 清理相关图片资源（可选，建议异步处理）
7. 返回 `{ success: true }`

**错误处理**：

- 记录不存在：返回 404
- 无权限删除：返回 403
- 数据库错误：返回 500

---

### 通用任务

#### 任务 6：参数验证中间件

创建通用的参数验证中间件，使用 `express-validator` 或 `joi`：

1. 验证 `CreateExploreRecordDto`
2. 验证 `UpdateExploreRecordDto`
3. 验证 `ExploreRecordListQuery`
4. 验证评分范围和步进
5. 验证图片数组长度

#### 任务 7：权限验证中间件

创建权限验证中间件：

1. 验证 JWT token
2. 提取用户信息
3. 验证记录所有权（用于更新和删除）

#### 任务 8：错误处理中间件

创建统一的错误处理中间件：

1. 捕获所有错误
2. 格式化错误响应
3. 记录错误日志

#### 任务 9：数据库迁移脚本

创建数据库迁移脚本：

1. 创建 `explore_records` 表
2. 创建 `restaurants` 表（如果不存在）
3. 创建索引

#### 任务 10：单元测试

编写单元测试：

1. 测试创建探店记录
2. 测试获取列表（分页、排序）
3. 测试获取详情
4. 测试更新记录
5. 测试删除记录
6. 测试权限验证
7. 测试参数验证

## 实现注意事项

### 1. 数据一致性

- 创建记录时，验证 `restaurantId` 是否存在
- 冗余存储餐厅名称和地址，避免频繁 JOIN 查询
- 更新餐厅信息时，不自动更新探店记录中的冗余数据

### 2. 性能优化

- 为常用查询字段添加索引（user_id, restaurant_id, created_at, rating）
- 列表查询限制最大 `pageSize`（建议 100）
- 考虑使用缓存（Redis）缓存热门记录

### 3. 安全性

- 所有接口都需要身份验证
- 更新和删除操作需要验证所有权
- 防止 SQL 注入（使用参数化查询）
- 验证图片 URL 格式，防止 XSS 攻击

### 4. 图片管理

- 图片上传应该是独立的接口
- 删除记录时，考虑异步清理图片资源
- 图片 URL 应该包含 CDN 域名

### 5. 时间处理

- 统一使用 UTC 时间存储
- 返回 ISO 8601 格式
- 前端根据用户时区显示

### 6. 标签系统

- 标签的 `count` 字段在当前设计中通常为 1
- 未来可以扩展为全局标签库，统计每个标签的总使用次数

## 前端实现文件

### 文件结构

```
apps/waisik/src/api/
├── types/
│   └── record.ts          # 数据类型定义
└── record.ts              # API 接口定义
```

### 类型定义文件（apps/waisik/src/api/types/record.ts）

包含所有 TypeScript 接口定义（见"数据类型定义"章节）。

### API 接口文件（apps/waisik/src/api/record.ts）

使用 Alova 定义 API 接口，参考现有的 `foo-alova.ts` 文件结构。

## 版本历史

- **v1.0.0** (2026-05-05)：初始版本
  - 定义核心数据类型
  - 设计 5 个 RESTful API 接口
  - 编写后端开发任务清单
