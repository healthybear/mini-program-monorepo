/**
 * 高德地图 API 封装
 *
 * 提供地理编码、逆地理编码、POI 搜索等功能
 */

import type {
  AmapGeocodeParams,
  AmapGeocodeResponse,
  AmapPOISearchParams,
  AmapPOISearchResponse,
  AmapRegeocodeParams,
  AmapRegeocodeResponse,
} from '../types'
import { AMAP_CONFIG, checkApiKey } from '../config'

/**
 * 发送 HTTP 请求
 */
async function request<T>(url: string, params: Record<string, any>): Promise<T> {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  const fullUrl = `${url}?${queryString}`

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data as T
          resolve(data)
        }
        else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(new Error(`网络请求失败: ${err.errMsg}`))
      },
    })
  })
}

/**
 * 地理编码（地址 -> 坐标）
 *
 * @param params 地理编码参数
 * @returns 地理编码结果
 *
 * @example
 * ```ts
 * const result = await geocode({ address: '北京市朝阳区阜通东大街6号' })
 * console.log(result.geocodes[0].location) // "116.480881,39.989410"
 * ```
 */
export async function geocode(params: AmapGeocodeParams): Promise<AmapGeocodeResponse> {
  if (!checkApiKey()) {
    throw new Error('高德地图 API Key 未配置')
  }

  const url = `${AMAP_CONFIG.baseURL}/v3/geocode/geo`
  const requestParams = {
    key: AMAP_CONFIG.webServiceKey,
    address: params.address,
    city: params.city,
    output: AMAP_CONFIG.geocode.output,
  }

  const response = await request<AmapGeocodeResponse>(url, requestParams)

  if (response.status !== '1') {
    throw new Error(`地理编码失败: ${response.info}`)
  }

  return response
}

/**
 * 逆地理编码（坐标 -> 地址）
 *
 * @param params 逆地理编码参数
 * @returns 逆地理编码结果
 *
 * @example
 * ```ts
 * const result = await regeocode({ location: '116.480881,39.989410' })
 * console.log(result.regeocode.formatted_address) // "北京市朝阳区阜通东大街6号"
 * ```
 */
export async function regeocode(params: AmapRegeocodeParams): Promise<AmapRegeocodeResponse> {
  if (!checkApiKey()) {
    throw new Error('高德地图 API Key 未配置')
  }

  const url = `${AMAP_CONFIG.baseURL}/v3/geocode/regeo`
  const requestParams = {
    key: AMAP_CONFIG.webServiceKey,
    location: params.location,
    poitype: params.poitype,
    radius: params.radius || AMAP_CONFIG.regeocode.radius,
    output: AMAP_CONFIG.regeocode.output,
  }

  const response = await request<AmapRegeocodeResponse>(url, requestParams)

  if (response.status !== '1') {
    throw new Error(`逆地理编码失败: ${response.info}`)
  }

  return response
}

/**
 * POI 搜索
 *
 * @param params POI 搜索参数
 * @returns POI 搜索结果
 *
 * @example
 * ```ts
 * // 关键词搜索
 * const result = await searchPOI({ keywords: '肯德基', city: '北京' })
 *
 * // 周边搜索
 * const result = await searchPOI({
 *   keywords: '酒店',
 *   location: '116.480881,39.989410',
 *   radius: 1000
 * })
 * ```
 */
export async function searchPOI(params: AmapPOISearchParams): Promise<AmapPOISearchResponse> {
  if (!checkApiKey()) {
    throw new Error('高德地图 API Key 未配置')
  }

  const url = `${AMAP_CONFIG.baseURL}/v3/place/text`
  const requestParams = {
    key: AMAP_CONFIG.webServiceKey,
    keywords: params.keywords,
    city: params.city,
    types: params.types,
    location: params.location,
    radius: params.radius,
    offset: params.offset || AMAP_CONFIG.poiSearch.offset,
    page: params.page || AMAP_CONFIG.poiSearch.page,
    extensions: AMAP_CONFIG.poiSearch.extensions,
    output: 'JSON',
  }

  const response = await request<AmapPOISearchResponse>(url, requestParams)

  if (response.status !== '1') {
    throw new Error(`POI 搜索失败: ${response.info}`)
  }

  return response
}

/**
 * 获取当前位置
 *
 * 使用 uni.getLocation 获取当前位置，然后通过逆地理编码获取详细地址
 *
 * @returns 当前位置信息
 */
export async function getCurrentLocation(): Promise<{
  longitude: number
  latitude: number
  address: string
  formattedAddress: string
}> {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02', // 高德坐标系
      success: async (res) => {
        try {
          // 通过逆地理编码获取地址
          const regeocodeResult = await regeocode({
            location: `${res.longitude},${res.latitude}`,
          })

          resolve({
            longitude: res.longitude,
            latitude: res.latitude,
            address: regeocodeResult.regeocode.formatted_address,
            formattedAddress: regeocodeResult.regeocode.formatted_address,
          })
        }
        catch (error) {
          // 如果逆地理编码失败，仍然返回坐标
          resolve({
            longitude: res.longitude,
            latitude: res.latitude,
            address: '未知地址',
            formattedAddress: '未知地址',
          })
        }
      },
      fail: (err) => {
        reject(new Error(`获取位置失败: ${err.errMsg}`))
      },
    })
  })
}

/**
 * 解析经纬度字符串
 *
 * @param location 经纬度字符串（格式：经度,纬度）
 * @returns 经纬度对象
 */
export function parseLocation(location: string): { longitude: number, latitude: number } {
  const [longitude, latitude] = location.split(',').map(Number)
  return { longitude, latitude }
}

/**
 * 格式化经纬度为字符串
 *
 * @param longitude 经度
 * @param latitude 纬度
 * @returns 经纬度字符串（格式：经度,纬度）
 */
export function formatLocation(longitude: number, latitude: number): string {
  return `${longitude},${latitude}`
}
