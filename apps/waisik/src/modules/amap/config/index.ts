/**
 * 高德地图配置
 *
 * 获取 Key 的步骤：
 * 1. 访问 https://lbs.amap.com/
 * 2. 注册并登录
 * 3. 进入控制台 -> 应用管理 -> 我的应用
 * 4. 创建新应用，添加 Key（选择 Web 服务）
 */

// 常量定义
const DEFAULT_POI_PAGE_SIZE = 20 // POI 搜索每页记录数
const DEFAULT_POI_PAGE = 1 // POI 搜索默认页码
const DEFAULT_REGEOCODE_RADIUS = 1000 // 逆地理编码搜索半径（米）

export const AMAP_CONFIG = {
  /**
   * 高德地图 Web 服务 API Key
   * 请在 .env 文件中配置 VITE_AMAP_WEB_SERVICE_KEY
   */
  webServiceKey: import.meta.env.VITE_AMAP_WEB_SERVICE_KEY || '',

  /**
   * API 基础 URL
   */
  baseURL: 'https://restapi.amap.com',

  /**
   * 默认城市
   */
  defaultCity: '全国',

  /**
   * POI 搜索默认参数
   */
  poiSearch: {
    offset: DEFAULT_POI_PAGE_SIZE, // 每页记录数
    page: DEFAULT_POI_PAGE, // 当前页数
    extensions: 'all', // 返回结果详细程度：base/all
  },

  /**
   * 地理编码默认参数
   */
  geocode: {
    output: 'JSON',
  },

  /**
   * 逆地理编码默认参数
   */
  regeocode: {
    output: 'JSON',
    radius: DEFAULT_REGEOCODE_RADIUS, // 搜索半径（米）
  },
}

/**
 * 检查 API Key 是否已配置
 */
export function checkApiKey(): boolean {
  if (!AMAP_CONFIG.webServiceKey) {
    console.error('高德地图 API Key 未配置，请在 .env 文件中设置 VITE_AMAP_WEB_SERVICE_KEY')
    return false
  }
  return true
}
