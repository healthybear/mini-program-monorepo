/**
 * Shop API Type Definitions
 * 店铺相关接口类型定义
 *
 * 与后端类型保持一致：
 * - 后端路径：E:\workspace\uni-admin-node\src\projects\waisik\types\shop.types.ts
 */

import type { EntityStatus, ILocation, IPaginationQuery, IPaginationResponse, SortBy } from './common'

/**
 * 店铺标签
 */
export interface IShopTag {
  name: string
  count: number
}

/**
 * 店铺接口
 * 后端返回的数据结构，使用 _id 作为主键
 */
export interface IShop {
  _id: string
  name: string
  address: string
  location: ILocation
  category: string
  images: string[]
  description?: string
  phone?: string
  businessHours?: string
  averagePrice?: number
  rating: number
  reviewCount: number
  favoriteCount: number
  likeCount: number
  status: EntityStatus
  createdAt: string
  updatedAt: string
}

/**
 * 店铺详情（包含标签统计和用户交互状态）
 */
export interface IShopDetail extends IShop {
  tags: IShopTag[]
  isFavorited: boolean
  isLiked: boolean
}

/**
 * 创建店铺 DTO
 */
export interface ICreateShopDto {
  name: string
  address: string
  location: ILocation
  category: string
  images: string[]
  description?: string
  phone?: string
  businessHours?: string
  averagePrice?: number
}

/**
 * 更新店铺 DTO
 */
export interface IUpdateShopDto {
  name?: string
  address?: string
  location?: ILocation
  category?: string
  images?: string[]
  description?: string
  phone?: string
  businessHours?: string
  averagePrice?: number
  status?: EntityStatus
}

/**
 * 店铺列表查询参数
 */
export interface IShopListQuery extends IPaginationQuery {
  categoryId?: string
  keyword?: string
  lat?: number
  lng?: number
  radius?: number
  sortBy?: SortBy
}

/**
 * 店铺列表响应
 * 后端返回 IPaginationResponse<IShop> 格式
 */
export type IShopListResponse = IPaginationResponse<IShop>
