/**
 * Common API Type Definitions
 * 通用接口类型定义
 */

/**
 * 地理位置坐标
 */
export interface ILocation {
  latitude: number
  longitude: number
  address?: string
}

/**
 * 分页查询参数
 */
export interface IPaginationQuery {
  pageNum: number
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface IPaginationResponse<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  totalPages: number
}

/**
 * 地理位置搜索参数
 */
export interface ILocationQuery {
  lat: number
  lng: number
  radius?: number // 搜索半径（米），默认 5000
}

/**
 * 排序方式
 */
export type SortBy = 'latest' | 'popular' | 'rating' | 'distance'

/**
 * 实体状态
 */
export type EntityStatus = 'active' | 'inactive' | 'deleted'

/**
 * 探店笔记状态
 */
export type RecordStatus = 'published' | 'draft' | 'deleted'

/**
 * 删除响应
 */
export interface IDeleteResponse {
  success: boolean
  message: string
}
