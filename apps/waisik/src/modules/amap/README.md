# 高德地图模块

独立的高德地图功能模块，提供地理编码、POI 搜索、地图选点等功能。

## 功能特性

- 🗺️ 地理编码（地址 -> 坐标）
- 📍 逆地理编码（坐标 -> 地址）
- 🔍 POI 搜索（关键词搜索、周边搜索）
- 📌 地图选点组件（支持搜索 + 地图点击）
- 🎯 获取当前位置
- 📦 完全模块化，易于迁移到其他项目

## 目录结构

```
amap/
├── api/              # API 封装
│   └── index.ts      # 地理编码、POI 搜索等 API
├── components/       # 组件
│   └── location-picker.vue  # 地图选点组件
├── config/           # 配置
│   └── index.ts      # 高德地图配置
├── types/            # 类型定义
│   └── index.ts      # TypeScript 类型
├── index.ts          # 统一导出
└── README.md         # 说明文档
```

## 快速开始

### 1. 获取高德地图 API Key

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录
3. 进入控制台 -> 应用管理 -> 我的应用
4. 创建新应用，添加 Key（选择 **Web 服务**）

### 2. 配置 API Key

在项目根目录的 `.env.development` 文件中添加：

```env
# 高德地图 Web 服务 API Key
VITE_AMAP_WEB_SERVICE_KEY=your_key_here
```

### 3. 使用示例

#### 获取当前位置

```ts
import { getCurrentLocation } from "@/modules/amap";

async function getLocation() {
  try {
    const location = await getCurrentLocation();
    console.log(location);
    // {
    //   longitude: 116.397428,
    //   latitude: 39.90923,
    //   address: "北京市东城区...",
    //   formattedAddress: "北京市东城区..."
    // }
  } catch (error) {
    console.error("定位失败:", error);
  }
}
```

#### POI 搜索

```ts
import { searchPOI } from "@/modules/amap";

// 关键词搜索
async function search() {
  const result = await searchPOI({
    keywords: "肯德基",
    city: "北京",
  });
  console.log(result.pois);
}

// 周边搜索
async function searchNearby() {
  const result = await searchPOI({
    keywords: "酒店",
    location: "116.397428,39.90923",
    radius: 1000, // 1000 米
  });
  console.log(result.pois);
}
```

#### 地理编码

```ts
import { geocode, regeocode } from "@/modules/amap";

// 地址 -> 坐标
async function addressToLocation() {
  const result = await geocode({
    address: "北京市朝阳区阜通东大街6号",
  });
  console.log(result.geocodes[0].location); // "116.480881,39.989410"
}

// 坐标 -> 地址
async function locationToAddress() {
  const result = await regeocode({
    location: "116.480881,39.989410",
  });
  console.log(result.regeocode.formatted_address);
}
```

#### 使用地图选点组件

```vue
<script setup lang="ts">
import { LocationPicker } from "@/modules/amap";

const showPicker = ref(false);

function handleLocationConfirm(location: any) {
  console.log("选中位置:", location);
  // {
  //   name: "天安门",
  //   address: "北京市东城区...",
  //   latitude: 39.90923,
  //   longitude: 116.397428
  // }
}
</script>

<template>
  <view>
    <button @click="showPicker = true">选择位置</button>

    <LocationPicker v-model="showPicker" @confirm="handleLocationConfirm" />
  </view>
</template>
```

## API 文档

### getCurrentLocation()

获取当前位置（包含详细地址）

**返回值：**

```ts
{
  longitude: number;
  latitude: number;
  address: string;
  formattedAddress: string;
}
```

### searchPOI(params)

搜索 POI（地点）

**参数：**

```ts
{
  keywords: string        // 搜索关键词（必填）
  city?: string          // 城市
  types?: string         // POI 类型编码
  location?: string      // 中心点坐标（格式：经度,纬度）
  radius?: number        // 搜索半径（米）
  offset?: number        // 每页记录数（最大 25）
  page?: number          // 当前页数
}
```

**返回值：**

```ts
{
  status: string;
  count: string;
  pois: Array<{
    id: string;
    name: string;
    type: string;
    address: string;
    location: string;
    tel?: string;
    distance?: string;
  }>;
}
```

### geocode(params)

地理编码（地址 -> 坐标）

**参数：**

```ts
{
  address: string    // 地址（必填）
  city?: string      // 城市
}
```

### regeocode(params)

逆地理编码（坐标 -> 地址）

**参数：**

```ts
{
  location: string   // 经纬度（格式：经度,纬度）
  poitype?: string   // 返回附近 POI 类型
  radius?: number    // 搜索半径（米）
}
```

## 组件文档

### LocationPicker

地图选点组件，支持搜索和地图点击选择位置。

**Props：**

- `modelValue: boolean` - 是否显示选择器
- `defaultLocation?: object` - 默认位置
  ```ts
  {
    longitude: number
    latitude: number
    address?: string
  }
  ```

**Events：**

- `update:modelValue` - 更新显示状态
- `confirm` - 确认选择位置
  ```ts
  {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }
  ```

**功能：**

- ✅ 搜索地点
- ✅ 地图点击选点
- ✅ 获取当前位置
- ✅ 显示选中位置信息

## 注意事项

1. **API Key 配置**：必须在 `.env` 文件中配置 `VITE_AMAP_WEB_SERVICE_KEY`
2. **坐标系统**：使用高德坐标系（GCJ-02）
3. **调用限制**：免费用户每日调用量有限制，请查看高德开放平台说明
4. **权限申请**：使用定位功能需要在 `manifest.json` 中配置位置权限

## 迁移到其他项目

由于模块完全独立，可以直接复制整个 `amap` 文件夹到其他项目：

```bash
# 复制模块
cp -r src/modules/amap /path/to/other-project/src/modules/

# 配置 API Key
echo "VITE_AMAP_WEB_SERVICE_KEY=your_key" >> /path/to/other-project/.env
```

## 相关链接

- [高德开放平台](https://lbs.amap.com/)
- [Web 服务 API 文档](https://lbs.amap.com/api/webservice/summary)
- [POI 搜索 API](https://lbs.amap.com/api/webservice/guide/api-advanced/newpoisearch)
- [地理编码 API](https://lbs.amap.com/api/webservice/guide/api/georegeo)
