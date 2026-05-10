/**
 * Shop API Type Definitions
 * 店铺相关接口类型定义
 */

export interface ILocation {
  latitude: number
  longitude: number
  address?: string
  city?: string
  district?: string
}

export interface IShop {
  id: string
  name: string
  categoryId: string
  categoryName?: string
  location: ILocation
  images: string[]
  coverImage?: string
  description?: string
  avgRating: number
  reviewCount: number
  likeCount: number
  favoriteCount: number
  businessHours?: string
  phone?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface IShopTag {
  name: string
  count: number
}

export interface IShopDetail {
  shop: IShop
  tags: IShopTag[]
  isFavorited: boolean
  isLiked: boolean
}

export interface ICreateShopDto {
  name: string
  categoryId: string
  location: ILocation
  images: string[]
  coverImage?: string
  description?: string
  businessHours?: string
  phone?: string
}

export interface IUpdateShopDto {
  name?: string
  categoryId?: string
  location?: ILocation
  images?: string[]
  coverImage?: string
  description?: string
  businessHours?: string
  phone?: string
}

export interface IShopListQuery {
  pageNum: number
  pageSize: number
  categoryId?: string
  keyword?: string
  lat?: number
  lng?: number
  radius?: number
  sortBy?: 'rating' | 'reviewCount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface IShopListResponse {
  shops: IShop[]
  total: number
  pageNum: number
  pageSize: number
}

export interface IDeleteResponse {
  success: boolean
  message: string
}
