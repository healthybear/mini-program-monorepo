import type { IFavoriteListResponse } from './types/favorite'
import type { IExploreRecordListResponse } from './types/record'
import type {
  IUserDetail,
  IUserFavoritesQuery,
  IUserReviewsQuery,
} from './types/user'
import { http } from '@/http/http'

/**
 * 获取用户信息
 * @param id 用户ID
 * @returns Promise<IUserDetail> 用户信息和统计数据
 */
export function getUserInfo(id: string) {
  return http.get<IUserDetail>(`/users/${id}`)
}

/**
 * 获取用户的探店笔记列表
 * @param id 用户ID
 * @param params 查询参数（分页）
 * @returns Promise<IExploreRecordListResponse> 用户的笔记列表
 */
export function getUserReviews(id: string, params: IUserReviewsQuery) {
  return http.get<IExploreRecordListResponse>(`/users/${id}/explore-records`, { params })
}

/**
 * 获取用户的收藏列表
 * @param id 用户ID
 * @param params 查询参数（分页）
 * @returns Promise<IFavoriteListResponse> 用户的收藏列表
 */
export function getUserFavorites(id: string, params: IUserFavoritesQuery) {
  return http.get<IFavoriteListResponse>(`/users/${id}/favorites`, { params })
}
