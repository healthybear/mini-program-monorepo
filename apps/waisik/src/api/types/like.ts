/**
 * Like API Type Definitions
 * 点赞相关接口类型定义
 */

export type LikeTargetType = 'shop' | 'explore_record'

export interface ICreateLikeDto {
  targetType: LikeTargetType
  targetId: string
}

export interface IDeleteLikeQuery {
  targetType: LikeTargetType
  targetId: string
}

export interface ILikeResponse {
  success: boolean
  message: string
}
