/**
 * 高德地图 TypeScript 类型定义
 */

/**
 * 地理位置坐标
 */
export interface AmapLocation {
  /** 经度 */
  longitude: number
  /** 纬度 */
  latitude: number
  /** 地址 */
  address?: string
}

/**
 * POI（地点）信息
 */
export interface AmapPOI {
  /** POI ID */
  id: string
  /** 名称 */
  name: string
  /** 类型编码 */
  type: string
  /** 类型名称 */
  typecode: string
  /** 地址 */
  address: string
  /** 经纬度（格式：经度,纬度） */
  location: string
  /** 电话 */
  tel?: string
  /** 距离（米） */
  distance?: string
  /** 省份 */
  pname?: string
  /** 城市 */
  cityname?: string
  /** 区域 */
  adname?: string
}

/**
 * POI 搜索参数
 */
export interface AmapPOISearchParams {
  /** 搜索关键词 */
  keywords: string
  /** 城市（可选） */
  city?: string
  /** POI 类型（可选） */
  types?: string
  /** 中心点坐标（格式：经度,纬度） */
  location?: string
  /** 搜索半径（米，默认 3000） */
  radius?: number
  /** 每页记录数（最大 25） */
  offset?: number
  /** 当前页数 */
  page?: number
}

/**
 * POI 搜索响应
 */
export interface AmapPOISearchResponse {
  /** 状态码（1 表示成功） */
  status: string
  /** 返回结果数目 */
  count: string
  /** 返回状态说明 */
  info: string
  /** POI 列表 */
  pois: AmapPOI[]
}

/**
 * 地理编码参数
 */
export interface AmapGeocodeParams {
  /** 地址 */
  address: string
  /** 城市（可选） */
  city?: string
}

/**
 * 地理编码结果
 */
export interface AmapGeocode {
  /** 格式化地址 */
  formatted_address: string
  /** 国家 */
  country: string
  /** 省份 */
  province: string
  /** 城市 */
  city: string
  /** 区域 */
  district: string
  /** 街道 */
  street?: string
  /** 门牌号 */
  number?: string
  /** 经纬度（格式：经度,纬度） */
  location: string
  /** 匹配级别 */
  level: string
}

/**
 * 地理编码响应
 */
export interface AmapGeocodeResponse {
  /** 状态码（1 表示成功） */
  status: string
  /** 返回状态说明 */
  info: string
  /** 地理编码结果数目 */
  count: string
  /** 地理编码结果列表 */
  geocodes: AmapGeocode[]
}

/**
 * 逆地理编码参数
 */
export interface AmapRegeocodeParams {
  /** 经纬度（格式：经度,纬度） */
  location: string
  /** 返回附近 POI 类型 */
  poitype?: string
  /** 搜索半径（米，默认 1000） */
  radius?: number
}

/**
 * 逆地理编码结果
 */
export interface AmapRegeocode {
  /** 格式化地址 */
  formatted_address: string
  /** 地址组件 */
  addressComponent: {
    /** 国家 */
    country: string
    /** 省份 */
    province: string
    /** 城市 */
    city: string
    /** 区域 */
    district: string
    /** 街道 */
    township: string
    /** 街道名称 */
    streetNumber: {
      street: string
      number: string
      location: string
      direction: string
      distance: string
    }
  }
  /** 附近 POI 列表 */
  pois?: AmapPOI[]
}

/**
 * 逆地理编码响应
 */
export interface AmapRegeocodeResponse {
  /** 状态码（1 表示成功） */
  status: string
  /** 返回状态说明 */
  info: string
  /** 逆地理编码结果 */
  regeocode: AmapRegeocode
}
