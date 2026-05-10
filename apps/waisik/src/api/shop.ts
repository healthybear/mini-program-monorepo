import type {
  ICreateShopDto,
  IShop,
  IShopDetail,
  IShopListQuery,
  IShopListResponse,
  IUpdateShopDto,
} from './types/shop'
import { http } from '@/http/http'

/**
 * 获取店铺列表
 * @param params 查询参数（分页、筛选、排序）
 * @returns Promise<IShopListResponse> 店铺列表
 */
export function getShopList(params: IShopListQuery) {
  return http.get<IShopListResponse>('/api/v1/waisik/shops', { params })
}

/**
 * 获取店铺详情
 * @param id 店铺ID
 * @returns Promise<IShopDetail> 店铺详情（包含标签统计、收藏和点赞状态）
 */
export function getShopDetail(id: string) {
  return http.get<IShopDetail>(`/api/v1/waisik/shops/${id}`)
}

/**
 * 创建店铺
 * @param data 店铺数据
 * @returns Promise<IShop> 创建的店铺
 */
export function createShop(data: ICreateShopDto) {
  return http.post<IShop>('/api/v1/waisik/shops', data)
}

/**
 * 更新店铺
 * @param id 店铺ID
 * @param data 更新数据
 * @returns Promise<IShop> 更新后的店铺
 */
export function updateShop(id: string, data: IUpdateShopDto) {
  return http.put<IShop>(`/api/v1/waisik/shops/${id}`, data)
}

/**
 * 删除店铺
 * @param id 店铺ID
 * @returns Promise<null> 删除成功返回 null
 */
export function deleteShop(id: string) {
  return http.delete<null>(`/api/v1/waisik/shops/${id}`)
}
