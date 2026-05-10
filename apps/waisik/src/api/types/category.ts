/**
 * Category API Type Definitions
 * 分类相关接口类型定义
 */

import type { EntityStatus } from './common'

export interface ICategory {
  _id: string
  name: string
  icon?: string
  sort: number
  status: EntityStatus
  createdAt: string
  updatedAt: string
}

export interface ICategoryListResponse {
  categories: ICategory[]
}
