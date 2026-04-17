import type { CustomTabBarItem, CustomTabBarItemBadge } from '@/config/tab-bar.types'
import { computed, reactive } from 'vue'
import { useUserStore } from '@/store/user'

import { tabbarList as _tabbarList, selectedTabbarStrategy, TABBAR_STRATEGY_MAP } from '@/config/tab-bar'

/** tabbarList 里面的 path 从 pages.config.ts 得到 */
const baseTabbarList = reactive<CustomTabBarItem[]>(_tabbarList.map(item => ({
  ...item,
  pagePath: item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`,
})))

const userRoles = computed(() => {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo.value
  if (Array.isArray(userInfo?.roles) && userInfo.roles.length > 0) {
    return userInfo.roles
  }
  if (userInfo?.role) {
    return [userInfo.role]
  }
  return []
})

const tabbarList = computed(() => {
  const roles = userRoles.value
  if (roles.length === 0) {
    return baseTabbarList.filter(item => !item.roles || item.roles.length === 0)
  }
  return baseTabbarList.filter(item => !item.roles || item.roles.length === 0 || item.roles.some(role => roles.includes(role)))
})

export function isPageTabbar(path: string) {
  if (selectedTabbarStrategy === TABBAR_STRATEGY_MAP.NO_TABBAR) {
    return false
  }
  const _path = path.split('?')[0]
  return tabbarList.value.some(item => item.pagePath === _path)
}

const tabbarStore = reactive({
  curIdx: uni.getStorageSync('app-tabbar-index') || 0,
  prevIdx: uni.getStorageSync('app-tabbar-index') || 0,
  setCurIdx(idx: number) {
    this.curIdx = idx
    uni.setStorageSync('app-tabbar-index', idx)
  },
  setTabbarItemBadge(idx: number, badge: CustomTabBarItemBadge) {
    const list = tabbarList.value
    if (list[idx]) {
      list[idx].badge = badge
    }
  },
  setAutoCurIdx(path: string) {
    const list = tabbarList.value
    if (list.length === 0) {
      this.setCurIdx(0)
      return
    }
    if (path === '/') {
      this.setCurIdx(0)
      return
    }
    const index = list.findIndex(item => item.pagePath === path)
    if (index === -1) {
      const pagesPathList = getCurrentPages().map(item => item.route.startsWith('/') ? item.route : `/${item.route}`)
      const flag = list.some(item => pagesPathList.includes(item.pagePath))
      if (!flag) {
        this.setCurIdx(0)
        return
      }
    }
    else {
      this.setCurIdx(index)
    }
  },
  restorePrevIdx() {
    if (this.prevIdx === this.curIdx)
      return
    this.setCurIdx(this.prevIdx)
    this.prevIdx = uni.getStorageSync('app-tabbar-index') || 0
  },
})

export { tabbarList, tabbarStore }
