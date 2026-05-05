import type {
  ICreateExploreRecordDto,
  IDeleteResponse,
  IExploreRecord,
  IExploreRecordListQuery,
  IExploreRecordListResponse,
  IUpdateExploreRecordDto,
} from './types/record'
import { http } from '@/http/http'

/**
 * 创建探店记录
 * @param data 探店记录数据
 * @returns Promise<IExploreRecord> 创建的探店记录
 */
export function createRecord(data: ICreateExploreRecordDto) {
  return http.post<IExploreRecord>('/explore-records', data)
}

/**
 * 获取探店记录列表
 * @param params 查询参数（分页、排序）
 * @returns Promise<IExploreRecordListResponse> 探店记录列表
 */
export function getRecordList(params: IExploreRecordListQuery) {
  return http.get<IExploreRecordListResponse>('/explore-records', { params })
}

/**
 * 获取探店记录详情
 * @param id 记录ID
 * @returns Promise<IExploreRecord> 探店记录详情
 */
export function getRecordDetail(id: string) {
  return http.get<IExploreRecord>(`/explore-records/${id}`)
}

/**
 * 更新探店记录
 * @param id 记录ID
 * @param data 更新数据
 * @returns Promise<IExploreRecord> 更新后的探店记录
 */
export function updateRecord(id: string, data: IUpdateExploreRecordDto) {
  return http.put<IExploreRecord>(`/explore-records/${id}`, data)
}

/**
 * 删除探店记录
 * @param id 记录ID
 * @returns Promise<IDeleteResponse> 删除结果
 */
export function deleteRecord(id: string) {
  return http.delete<IDeleteResponse>(`/explore-records/${id}`)
}
