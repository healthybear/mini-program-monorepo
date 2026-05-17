import { getLastPage } from '@/utils'
import { debounce } from '@/utils/debounce'

// 常量定义
const LOGIN_PAGE = '/pages/login/index'
const DEBOUNCE_DELAY = 500 // 防抖延迟（毫秒）

interface ToLoginPageOptions {
  /**
   * 跳转模式, uni.navigateTo | uni.reLaunch
   * @default 'navigateTo'
   */
  mode?: 'navigateTo' | 'reLaunch'
  /**
   * 查询参数
   * @example '?redirect=/pages/home/index'
   */
  queryString?: string
}

/**
 * 跳转到登录页, 带防抖处理
 *
 * 如果要立即跳转，不做延时，可以使用 `toLoginPage.flush()` 方法
 */
export const toLoginPage = debounce((options: ToLoginPageOptions = {}) => {
  const { mode = 'navigateTo', queryString = '' } = options

  const url = `${LOGIN_PAGE}${queryString}`

  // 获取当前页面路径
  const currentPage = getLastPage()
  const currentPath = `/${currentPage.route}`
  // 如果已经在登录页，则不跳转
  if (currentPath === LOGIN_PAGE) {
    return
  }

  if (mode === 'navigateTo') {
    uni.navigateTo({ url })
  }
  else {
    uni.reLaunch({ url })
  }
}, DEBOUNCE_DELAY)
