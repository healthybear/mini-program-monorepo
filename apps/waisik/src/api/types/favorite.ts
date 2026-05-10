/**
 * Favorite API Type Definitions
 * 收藏相关接口类型定义
 */

import type { IShop } from './shop'

export interface IFavorite {
  id: string
  userId: string
  shop: IShop
  createdAt: string
}

export interface IFavoriteListQuery {
  pageNum: number
  pageSize: number
}

export interface IFavoriteListResponse {
  favorites: IFavorite[]
  total: number
  pageNum: number
  pageSize: number
}

export interface ICreateFavoriteDto {
  shopId: string
}

export interface IDeleteResponse {
  success: boolean
  message: string
}
