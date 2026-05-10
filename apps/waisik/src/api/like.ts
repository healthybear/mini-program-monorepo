import type { ICreateLikeDto, IDeleteLikeQuery, ILikeResponse } from './types/like'
import { http } from '@/http/http'

/**
 * 点赞（店铺或探店笔记）
 * @param data 点赞数据（目标类型和ID）
 * @returns Promise<ILikeResponse> 点赞结果
 */
export function createLike(data: ICreateLikeDto) {
  return http.post<ILikeResponse>('/api/v1/waisik/likes', data)
}

/**
 * 取消点赞
 * @param params 查询参数（目标类型和ID）
 * @returns Promise<ILikeResponse> 取消点赞结果
 */
export function deleteLike(params: IDeleteLikeQuery) {
  return http.delete<ILikeResponse>('/api/v1/waisik/likes', { params })
}
