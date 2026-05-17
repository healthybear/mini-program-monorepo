import type { IDoubleTokenRes } from '@/api/types/login'
import type { CustomRequestOptions, IResponse } from '@/http/types'
import { nextTick } from 'vue'
import { useTokenStore } from '@/store/token'
import { isDoubleTokenMode } from '@/utils'
import { toLoginPage } from '@/utils/toLoginPage'
import { ResultEnum } from './tools/enum'

// 使用队列机制防止并发刷新 token
// 多个请求同时 401 时，只发起一次刷新请求，其他请求进入队列等待
let refreshing = false
let taskQueue: (() => void)[] = []

/**
 * 统一的 HTTP 请求封装
 * 支持 token 无感刷新、自动错误提示、业务码处理
 */
export function http<T>(options: CustomRequestOptions) {
  // 1. 返回 Promise 对象
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success: async (res) => {
        const responseData = res.data as IResponse<T>
        const { code } = responseData

        const isTokenExpired = res.statusCode === 401 || code === 401

        if (isTokenExpired) {
          const tokenStore = useTokenStore()
          if (!isDoubleTokenMode) {
            tokenStore.logout()
            toLoginPage()
            return reject(res)
          }

          // 无感刷新 token：使用 refreshToken 换取新的 accessToken
          const { refreshToken } = tokenStore.tokenInfo as IDoubleTokenRes || {}
          if (refreshToken) {
            taskQueue.push(() => {
              resolve(http<T>(options))
            })
          }

          if (refreshToken && !refreshing) {
            refreshing = true
            try {
              await tokenStore.refreshToken()
              refreshing = false
              nextTick(() => {
                uni.hideToast()
                uni.showToast({
                  title: 'token 刷新成功',
                  icon: 'none',
                })
              })
              taskQueue.forEach(task => task())
            }
            catch (refreshErr) {
              console.error('刷新 token 失败:', refreshErr)
              refreshing = false
              nextTick(() => {
                uni.hideToast()
                uni.showToast({
                  title: '登录已过期，请重新登录',
                  icon: 'none',
                })
              })
              await tokenStore.logout()
              setTimeout(() => {
                toLoginPage()
              }, 2000)
            }
            finally {
              taskQueue = []
            }
          }

          return reject(res)
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (code !== ResultEnum.Success0 && code !== ResultEnum.Success200) {
            const errorMsg = 'msg' in responseData ? responseData.msg : responseData.message
            uni.showToast({
              icon: 'none',
              title: errorMsg || '请求错误',
            })
            return reject(responseData.data)
          }
          return resolve(responseData.data)
        }

        if (!options.hideErrorToast) {
          const errorMsg = 'msg' in responseData ? responseData.msg : responseData.message
          uni.showToast({
            icon: 'none',
            title: errorMsg || '请求错误',
          })
        }
        reject(res)
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpGet<T>(url: string, query?: unknown, header?: Record<string, string>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query: query as Record<string, unknown>,
    method: 'GET',
    header,
    ...options,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpPost<T>(url: string, data?: unknown, query?: unknown, header?: Record<string, string>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query: query as Record<string, unknown>,
    data,
    method: 'POST',
    header,
    ...options,
  })
}
/**
 * PUT 请求
 */
export function httpPut<T>(url: string, data?: unknown, query?: unknown, header?: Record<string, string>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    data,
    query: query as Record<string, unknown>,
    method: 'PUT',
    header,
    ...options,
  })
}

/**
 * DELETE 请求（无请求体，仅 query）
 */
export function httpDelete<T>(url: string, query?: unknown, header?: Record<string, string>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query: query as Record<string, unknown>,
    method: 'DELETE',
    header,
    ...options,
  })
}

// 支持与 axios 类似的API调用
http.get = httpGet
http.post = httpPost
http.put = httpPut
http.delete = httpDelete

// 支持与 alovaJS 类似的API调用
http.Get = httpGet
http.Post = httpPost
http.Put = httpPut
http.Delete = httpDelete
