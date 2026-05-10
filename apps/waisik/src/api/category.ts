import type { ICategoryListResponse } from './types/category'
import { http } from '@/http/http'

/**
 * 获取分类列表
 * @returns Promise<ICategoryListResponse> 分类列表
 */
export function getCategoryList() {
  return http.get<ICategoryListResponse>('/api/v1/waisik/categories')
}
