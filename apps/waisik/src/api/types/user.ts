/**
 * User API Type Definitions
 * 用户相关接口类型定义
 */

import type { IExploreRecord, IExploreRecordListResponse } from './record'
import type { IFavorite, IFavoriteListResponse } from './favorite'

export interface IUserInfo {
  id: string
  nickname: string
  avatarUrl: string
}

export interface IUserStats {
  reviewCount: number
  favoriteCount: number
}

export interface IUserDetail {
  user: IUserInfo
  stats: IUserStats
}

export interface IUserReviewsQuery {
  pageNum: number
  pageSize: number
}

export interface IUserFavoritesQuery {
  pageNum: number
  pageSize: number
}
