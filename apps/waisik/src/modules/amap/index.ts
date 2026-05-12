/**
 * 高德地图模块统一导出
 *
 * 使用示例：
 * ```ts
 * import { searchPOI, getCurrentLocation, LocationPicker } from '@/modules/amap'
 * ```
 */

// API
export * from './api'

// 类型
export * from './types'

// 配置
export * from './config'

// 组件
export { default as LocationPicker } from './components/location-picker.vue'
