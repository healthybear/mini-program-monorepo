import { useTokenStore } from '@/store/token'
/**
 * by 菲鸽 on 2025-08-19
 * 路由拦截，通常也是登录拦截
 * 黑、白名单的配置，请看 config.ts 文件， EXCLUDE_LOGIN_PATH_LIST
 */
import { tabbarStore } from '@/tabbar/store'
import { getLastPage, parseUrlToObj } from '@/utils/index'
import { toLoginPage } from '@/utils/toLoginPage'

export const FG_LOG_ENABLE = false

// 不需要登录的页面白名单
const LOGIN_WHITELIST = [
  '/pages/login/index',
]

export const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  // 增加对相对路径的处理，BY 网友 @ideal
  invoke({ url, query }: { url: string, query?: Record<string, string> }) {
    if (url === undefined) {
      return
    }
    let { path, query: _query } = parseUrlToObj(url)

    const myQuery = { ..._query, ...query }

    // 处理相对路径
    if (!path.startsWith('/')) {
      const currentPath = getLastPage()?.route || ''
      const normalizedCurrentPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
      const baseDir = normalizedCurrentPath.substring(0, normalizedCurrentPath.lastIndexOf('/'))
      path = `${baseDir}/${path}`
    }

    // 登录状态检查
    const isInWhitelist = LOGIN_WHITELIST.some(whitePath => path.startsWith(whitePath))
    if (!isInWhitelist) {
      const tokenStore = useTokenStore()
      const hasLogin = tokenStore.updateNowTime().hasLogin

      if (!hasLogin) {
        toLoginPage({
          mode: 'navigateTo',
          queryString: `?redirect=${encodeURIComponent(path)}`,
        })
        return false
      }
    }

    // 处理直接进入路由非首页时，tabbarIndex 不正确的问题
    tabbarStore.setAutoCurIdx(path)
  },
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)
  },
}
