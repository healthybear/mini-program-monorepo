# API 类型定义更新总结

## 更新日期

2026-05-11

## 更新目的

将前端的 API 类型定义与后端保持一致，使用真实的后端接口路径和数据结构。

## 主要变更

### 1. 新增通用类型定义文件

**文件**: `src/api/types/common.ts`

新增了通用类型定义，包括：

- `ILocation` - 地理位置坐标
- `IPaginationQuery` - 分页查询参数
- `IPaginationResponse<T>` - 分页响应数据（使用 `list` 字段）
- `ILocationQuery` - 地理位置搜索参数
- `SortBy` - 排序方式类型
- `EntityStatus` - 实体状态类型
- `RecordStatus` - 探店笔记状态类型
- `IDeleteResponse` - 删除响应

### 2. 探店记录类型更新

**文件**: `src/api/types/record.ts`

**关键变更**:

- ID 字段从 `id` 改为 `_id`（MongoDB 主键）
- 店铺关联从 `restaurantId` 改为 `shop`（字符串）
- 用户关联从 `userId` 改为 `user`（字符串）
- 标签从 `IExploreTag[]` 改为 `string[]`
- 新增 `visitDate` 字段（访问日期）
- 新增 `status` 字段（记录状态）
- 新增 `likeCount` 字段（点赞数）
- 详情接口返回 `IExploreRecordDetail`（包含 `isLiked` 状态）
- 列表响应使用 `IPaginationResponse<IExploreRecord>` 格式

**创建 DTO 变更**:

```typescript
// 旧
{
  restaurantId: string
  restaurantName: string
  restaurantAddress: string
  tags: IExploreTag[]
}

// 新
{
  shop: string  // 店铺 ID
  tags: string[]  // 标签名称数组
  visitDate?: string  // 访问日期
}
```

### 3. 店铺类型更新

**文件**: `src/api/types/shop.ts`

**关键变更**:

- ID 字段从 `id` 改为 `_id`
- 分类从 `categoryId` + `categoryName` 改为 `category`（字符串）
- 新增 `address` 字段（独立的地址字段）
- 评分字段从 `avgRating` 改为 `rating`
- 新增 `averagePrice` 字段（人均价格）
- 详情接口返回 `IShopDetail`（继承 `IShop`，包含 `tags`、`isFavorited`、`isLiked`）
- 列表响应使用 `IPaginationResponse<IShop>` 格式

### 4. 分类类型更新

**文件**: `src/api/types/category.ts`

**关键变更**:

- ID 字段从 `id` 改为 `_id`
- 状态类型从 `'active' | 'inactive'` 改为 `EntityStatus`

### 5. 收藏类型更新

**文件**: `src/api/types/favorite.ts`

**关键变更**:

- ID 字段从 `id` 改为 `_id`
- 用户字段从 `userId` 改为 `user`
- 列表响应使用 `IPaginationResponse<IFavorite>` 格式

### 6. API 调用文件更新

**更新的文件**:

- `src/api/record.ts` - 更新返回类型，详情接口返回 `IExploreRecordDetail`
- `src/api/shop.ts` - 更新返回类型
- `src/api/favorite.ts` - 更新返回类型

**删除响应类型变更**:

- 从返回 `IDeleteResponse` 改为返回 `null`（后端成功删除返回 null）

### 7. Store 更新

**文件**: `src/store/record.ts`

**关键变更**:

- `currentRecord` 类型从 `IExploreRecord` 改为 `IExploreRecordDetail`
- 列表数据访问从 `res.records` 改为 `res.list`
- ID 比较从 `r.id` 改为 `r._id`
- 排序参数从 `sortBy: 'createdAt', sortOrder: 'desc'` 改为 `sortBy: 'latest'`

### 8. 页面组件更新

**文件**: `src/pages/record/detail.vue`

**关键变更**:

- 数据访问从 `record.id` 改为 `record._id`
- 图片数组从 `record.photos` 改为 `record.images`
- 标签访问从 `record.tags.map(t => t.name)` 改为 `record.tags`
- 位置信息从 `record.location?.latitude` 获取（可选）
- 添加空值检查 `recordData?.` 防止未加载时报错

## 后端接口路径

所有接口路径已确认与后端一致：

### 探店记录

- `GET /api/v1/waisik/explore-records` - 获取列表
- `GET /api/v1/waisik/explore-records/:id` - 获取详情
- `POST /api/v1/waisik/explore-records` - 创建（需认证）
- `PUT /api/v1/waisik/explore-records/:id` - 更新（需认证）
- `DELETE /api/v1/waisik/explore-records/:id` - 删除（需认证）

### 店铺

- `GET /api/v1/waisik/shops` - 获取列表
- `GET /api/v1/waisik/shops/:id` - 获取详情
- `POST /api/v1/waisik/shops` - 创建（需认证）
- `PUT /api/v1/waisik/shops/:id` - 更新（需认证）
- `DELETE /api/v1/waisik/shops/:id` - 删除（需认证）

### 收藏

- `GET /api/v1/waisik/favorites` - 获取列表（需认证）
- `POST /api/v1/waisik/favorites` - 收藏店铺（需认证）
- `DELETE /api/v1/waisik/favorites/:shopId` - 取消收藏（需认证）

### 点赞

- `POST /api/v1/waisik/likes` - 点赞（需认证）
- `DELETE /api/v1/waisik/likes` - 取消点赞（需认证）

### 分类

- `GET /api/v1/waisik/categories` - 获取列表

### 上传

- `POST /api/v1/waisik/upload/image` - 上传单张图片（需认证）
- `POST /api/v1/waisik/upload/images` - 上传多张图片（需认证）

## 数据结构对比

### 探店记录

#### 旧结构

```typescript
{
  id: string
  userId: string
  restaurantId: string
  tags: { name: string, count: number }[]
}
```

#### 新结构

```typescript
{
  _id: string
  user: string
  shop: string
  tags: string[]
  visitDate?: string
  status: RecordStatus
  likeCount: number
}
```

### 店铺

#### 旧结构

```typescript
{
  id: string
  categoryId: string
  categoryName?: string
  avgRating: number
  location: { latitude, longitude, address, city, district }
}
```

#### 新结构

```typescript
{
  _id: string
  category: string
  rating: number
  address: string
  location: { latitude, longitude, address }
  averagePrice?: number
}
```

## 注意事项

1. **ID 字段**: 所有实体的 ID 字段都使用 `_id`（MongoDB 主键）
2. **分页响应**: 后端统一使用 `list` 字段返回数据列表，而不是 `records`、`shops` 等
3. **删除响应**: 删除成功返回 `null`，不再返回 `{ success: true, message: '...' }`
4. **标签数据**: 探店记录的标签是字符串数组，不再包含 count 字段
5. **详情接口**: 详情接口返回的数据包含用户交互状态（`isLiked`、`isFavorited`）
6. **位置信息**: 店铺的位置信息分为 `address`（字符串）和 `location`（坐标对象）

## 后续工作

1. 更新其他使用这些类型的页面组件
2. 测试所有 API 调用是否正常工作
3. 更新相关的表单验证逻辑
4. 确保所有页面正确处理新的数据结构

## 参考

- 后端类型定义: `E:\workspace\uni-admin-node\src\projects\waisik\types\`
- 后端路由定义: `E:\workspace\uni-admin-node\src\projects\waisik\routes\`
