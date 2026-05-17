import type {
  ICreateExploreRecordDto,
  IExploreRecord,
  IExploreRecordDetail,
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
  return http.post<IExploreRecord>('/api/v1/waisik/explore-records', data)
}

/**
 * 获取探店记录列表
 * @param params 查询参数（分页、排序）
 * @returns Promise<IExploreRecordListResponse> 探店记录列表
 */
export function getRecordList(params: IExploreRecordListQuery) {
  return http.get<IExploreRecordListResponse>('/api/v1/waisik/explore-records', params)
}

/**
 * 获取探店记录详情
 * @param id 记录ID
 * @returns Promise<IExploreRecordDetail> 探店记录详情（包含点赞状态）
 */
export function getRecordDetail(id: string) {
  return http.get<IExploreRecordDetail>(`/api/v1/waisik/explore-records/${id}`)
}

/**
 * 更新探店记录
 * @param id 记录ID
 * @param data 更新数据
 * @returns Promise<IExploreRecord> 更新后的探店记录
 */
export function updateRecord(id: string, data: IUpdateExploreRecordDto) {
  return http.put<IExploreRecord>(`/api/v1/waisik/explore-records/${id}`, data)
}

/**
 * 删除探店记录
 * @param id 记录ID
 * @returns Promise<null> 删除成功返回 null
 */
export function deleteRecord(id: string) {
  return http.delete<null>(`/api/v1/waisik/explore-records/${id}`)
}
