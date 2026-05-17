import type { CustomRequestOptions } from '@/http/types'
import { useTokenStore } from '@/store'
import { getEnvBaseUrl } from '@/utils'
import { stringifyQuery } from './tools/queryString'

const baseUrl = getEnvBaseUrl()

/**
 * uni.request 拦截器配置
 * 统一处理：URL 拼接、query 参数、token 注入、超时设置
 */
const httpInterceptor = {
  invoke(options: CustomRequestOptions) {
    // 处理 query 参数，转换为 URL queryString
    if (options.query) {
      const queryStr = stringifyQuery(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      }
      else {
        options.url += `?${queryStr}`
      }
    }
    // 拼接完整 URL（非 http 开头需拼接 baseUrl）
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      if (JSON.parse(import.meta.env.VITE_APP_PROXY_ENABLE)) {
        // H5 开发环境使用代理前缀
        options.url = import.meta.env.VITE_APP_PROXY_PREFIX + options.url
      }
      else {
        options.url = baseUrl + options.url
      }
      // #endif
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
    }
    options.timeout = 60000
    options.header = {
      ...options.header,
    }
    // 注入 token 到请求头
    const tokenStore = useTokenStore()
    const token = tokenStore.updateNowTime().validToken

    if (token) {
      options.header.Authorization = `Bearer ${token}`
    }
    return options
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
