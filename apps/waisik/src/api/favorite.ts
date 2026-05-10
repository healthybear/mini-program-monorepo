import type {
  ICreateFavoriteDto,
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
  return http.get<IFavoriteListResponse>('/api/v1/waisik/favorites', { params })
}

/**
 * 收藏店铺
 * @param data 收藏数据（店铺ID）
 * @returns Promise<void>
 */
export function createFavorite(data: ICreateFavoriteDto) {
  return http.post<void>('/api/v1/waisik/favorites', data)
}

/**
 * 取消收藏店铺
 * @param shopId 店铺ID
 * @returns Promise<null> 删除成功返回 null
 */
export function deleteFavorite(shopId: string) {
  return http.delete<null>(`/api/v1/waisik/favorites/${shopId}`)
}
