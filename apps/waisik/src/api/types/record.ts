/**
 * Explore Record API Type Definitions
 * Based on: docs/superpowers/specs/2026-05-05-explore-record-api-design.md
 */

export interface IExploreTag {
  name: string
  count: number
}

export interface ILocation {
  latitude: number
  longitude: number
  address?: string
}

export interface IExploreRecord {
  id: string
  userId: string
  userName: string
  userAvatar: string
  restaurantId: string
  restaurantName: string
  restaurantAddress: string
  foodName?: string
  rating: number
  images: string[]
  tags: IExploreTag[]
  content?: string
  price?: number
  location?: ILocation
  createdAt: string
  updatedAt: string
}

export interface ICreateExploreRecordDto {
  restaurantId: string
  restaurantName: string
  restaurantAddress: string
  foodName?: string
  rating: number
  images: string[]
  tags: IExploreTag[]
  content?: string
  price?: number
  location?: ILocation
}

export interface IUpdateExploreRecordDto {
  restaurantName?: string
  restaurantAddress?: string
  foodName?: string
  rating?: number
  images?: string[]
  tags?: IExploreTag[]
  content?: string
  price?: number
  location?: ILocation
}

export interface IExploreRecordListQuery {
  pageNum: number
  pageSize: number
  sortBy?: 'createdAt' | 'rating' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface IExploreRecordListResponse {
  records: IExploreRecord[]
  total: number
  pageNum: number
  pageSize: number
}

export interface IDeleteResponse {
  success: boolean
  message: string
}
