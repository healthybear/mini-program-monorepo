/**
 * Explore Record API Type Definitions
 * 探店记录相关接口类型定义
 *
 * 与后端类型保持一致：
 * - 后端路径：E:\workspace\uni-admin-node\src\projects\waisik\types\explore-record.types.ts
 */

import type { ILocation, IPaginationQuery, IPaginationResponse, RecordStatus } from './common'

/**
 * 探店记录接口
 * 后端返回的数据结构，使用 _id 作为主键
 */
export interface IExploreRecord {
  _id: string
  // 关联（用于查询和聚合）
  shop: string
  user: string
  // 快照（冗余，用于列表展示，避免 JOIN）
  restaurantName: string
  restaurantAddress: string
  userName: string
  userAvatar: string
  // 探店内容
  foodName?: string
  rating: number
  images: string[]
  tags: string[]
  content?: string
  price?: number
  location?: ILocation
  // 统计
  likeCount: number
  // 时间和状态
  visitDate?: string
  status: RecordStatus
  createdAt: string
  updatedAt: string
}

/**
 * 探店记录详情（包含用户交互状态）
 */
export interface IExploreRecordDetail extends IExploreRecord {
  isLiked: boolean
}

/**
 * 创建探店记录 DTO
 */
export interface ICreateExploreRecordDto {
  shop: string
  foodName?: string
  rating: number
  images: string[]
  tags: string[]
  content?: string
  price?: number
  location?: ILocation
  visitDate?: string
}

/**
 * 更新探店记录 DTO
 */
export interface IUpdateExploreRecordDto {
  foodName?: string
  rating?: number
  images?: string[]
  tags?: string[]
  content?: string
  price?: number
  location?: ILocation
  visitDate?: string
  status?: RecordStatus
}

/**
 * 探店记录列表查询参数
 */
export interface IExploreRecordListQuery extends IPaginationQuery {
  shopId?: string
  userId?: string
  tag?: string
  minRating?: number
  sortBy?: 'latest' | 'popular'
}

/**
 * 探店记录列表响应
 * 后端返回 IPaginationResponse<IExploreRecord> 格式
 */
export type IExploreRecordListResponse = IPaginationResponse<IExploreRecord>
