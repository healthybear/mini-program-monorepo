/**
 * User API Type Definitions
 * 用户相关接口类型定义
 */

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
