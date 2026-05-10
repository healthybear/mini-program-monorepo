/**
 * Category API Type Definitions
 * 分类相关接口类型定义
 */

export interface ICategory {
  id: string
  name: string
  icon?: string
  sort: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface ICategoryListResponse {
  categories: ICategory[]
}
