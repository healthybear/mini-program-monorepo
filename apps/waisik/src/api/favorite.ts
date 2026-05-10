import type {
  ICreateFavoriteDto,
  IDeleteResponse,
  IFavoriteListQuery,
  IFavoriteListResponse,
} from './types/favorite'
import { http } from '@/http/http'

/**
 * 获取我的收藏列表
 * @param params 查询参数（分页）
 * @returns Promise<IFavoriteListResponse> 收藏列表
 */
export function getFavoriteList(params: IFavoriteListQuery) {
  return http.get<IFavoriteListResponse>('/favorites', { params })
}

/**
 * 收藏店铺
 * @param data 收藏数据（店铺ID）
 * @returns Promise<void>
 */
export function createFavorite(data: ICreateFavoriteDto) {
  return http.post<void>('/favorites', data)
}

/**
 * 取消收藏店铺
 * @param shopId 店铺ID
 * @returns Promise<IDeleteResponse> 删除结果
 */
export function deleteFavorite(shopId: string) {
  return http.delete<IDeleteResponse>(`/favorites/${shopId}`)
}
