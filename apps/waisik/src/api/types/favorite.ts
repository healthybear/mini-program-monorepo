/**
 * Favorite API Type Definitions
 * 收藏相关接口类型定义
 */

import type { IShop } from './shop'
import type { IPaginationQuery, IPaginationResponse } from './common'

export interface IFavorite {
  _id: string
  user: string
  shop: IShop
  createdAt: string
}

export type IFavoriteListQuery = IPaginationQuery

/**
 * 收藏列表响应
 * 后端返回 IPaginationResponse<IFavorite> 格式
 */
export type IFavoriteListResponse = IPaginationResponse<IFavorite>

export interface ICreateFavoriteDto {
  shopId: string
}
