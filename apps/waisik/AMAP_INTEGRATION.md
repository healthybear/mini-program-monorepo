# 高德地图集成使用指南

## 配置步骤

### 1. 获取高德地图 API Key

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录
3. 进入控制台 -> 应用管理 -> 我的应用
4. 创建新应用，添加 Key（**选择 Web 服务**）

### 2. 配置 API Key

在 `apps/waisik/env/.env.development` 文件中，将 `YOUR_AMAP_WEB_SERVICE_KEY` 替换为你的真实 Key：

```env
VITE_AMAP_WEB_SERVICE_KEY = 'your_real_key_here'
```

### 3. 测试功能

运行项目后，在新建探店记录页面点击"选择位置"按钮，应该能看到：

- 搜索地点功能
- 地图选点功能
- 获取当前位置功能

## 模块说明

高德地图功能已封装为独立模块，位于 `src/modules/amap/`，包含：

- **API 封装** (`api/index.ts`): 地理编码、POI 搜索等
- **组件** (`components/location-picker.vue`): 地图选点组件
- **类型定义** (`types/index.ts`): TypeScript 类型
- **配置** (`config/index.ts`): 配置管理

详细文档请查看 `src/modules/amap/README.md`

## 已完成的集成

✅ 在 `new.vue` 中替换了 `uni.chooseLocation` 为高德地图选点组件
✅ 支持搜索地点
✅ 支持地图点击选点
✅ 支持获取当前位置
✅ 自动询问是否使用位置名称作为餐厅名称

## 注意事项

1. **API Key 必须配置**：否则无法使用定位和搜索功能
2. **坐标系统**：使用高德坐标系（GCJ-02）
3. **权限申请**：小程序需要在 `manifest.json` 中配置位置权限
4. **调用限制**：免费用户每日调用量有限制

## 后续优化建议

1. 添加位置缓存，减少 API 调用
2. 添加常用位置收藏功能
3. 优化搜索结果展示（添加距离、评分等）
4. 支持地图样式切换
