import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { IResponse } from './types'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { toLoginPage } from '@/utils/toLoginPage'
import { ContentTypeEnum, ResultEnum, ShowMessage } from './tools/enum'

// 常量定义
const REQUEST_TIMEOUT = 5000 // 请求超时时间（毫秒）

export const API_DOMAINS = {
  DEFAULT: import.meta.env.VITE_SERVER_BASEURL,
  SECONDARY: import.meta.env.VITE_SERVER_BASEURL_SECONDARY,
}

/**
 * alova 的 token 认证配置
 * 当 token 过期时自动刷新
 */
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  // 判断是否需要刷新 token（响应状态码为 401）
  refreshTokenOnError: {
    isExpired: (error) => {
      return error.response?.status === ResultEnum.Unauthorized
    },
    handler: async () => {
      try {
        // await authLogin();
      }
      catch (error) {
        // 切换到登录页
        toLoginPage({ mode: 'reLaunch' })
        throw error
      }
    },
  },
})

/**
 * alova 请求实例
 * 基于 uni-app 适配器，支持 Vue 3 响应式
 */
const alovaInstance = createAlova({
  baseURL: API_DOMAINS.DEFAULT,
  ...AdapterUniapp(),
  timeout: REQUEST_TIMEOUT,
  statesHook: VueHook,

  beforeRequest: onAuthRequired((method) => {
    method.config.headers = {
      ContentType: ContentTypeEnum.JSON,
      Accept: 'application/json, text/plain, */*',
      ...method.config.headers,
    }

    const { config } = method
    const ignoreAuth = !config.meta?.ignoreAuth
    if (ignoreAuth) {
      const token = 'getToken()'
      if (!token) {
        throw new Error('[请求错误]：未登录')
      }
    }

    // 支持动态切换 API 域名
    if (config.meta?.domain) {
      method.baseURL = config.meta.domain
    }
  }),

  responded: onResponseRefreshToken((response, method) => {
    const { config } = method
    const { requestType } = config
    const {
      statusCode,
      data: rawData,
      errMsg,
    } = response as UniNamespace.RequestSuccessCallbackResult

    if (requestType === 'upload' || requestType === 'download') {
      return response
    }

    if (statusCode !== 200) {
      const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
      console.error('errorMessage===>', errorMessage)
      uni.showToast({
        title: errorMessage,
        icon: 'error',
      })
      throw new Error(`${errorMessage}：${errMsg}`)
    }

    const { code, message, data } = rawData as IResponse
    // 兼容业务码 0 和 200 两种成功状态
    if (code !== ResultEnum.Success0 && code !== ResultEnum.Success200) {
      if (config.meta?.toast !== false) {
        uni.showToast({
          title: message,
          icon: 'none',
        })
      }
      throw new Error(`请求错误[${code}]：${message}`)
    }
    return data
  }),
})

export const http = alovaInstance
