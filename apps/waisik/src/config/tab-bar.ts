import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'
import type { TabbarTheme } from '@repo/shared/components/tabbar'
import type { CustomTabBarItem, NativeTabBarItem } from './tab-bar.types'

/** 自定义 TabBar 外观（胶囊主题），按需覆盖 @repo/shared 默认值 */
export const tabbarUiTheme: Partial<TabbarTheme> = {}

/**
 * tabbar 选择的策略，更详细的介绍见 unibest 文档
 * 0: 'NO_TABBAR' `无 tabbar`
 * 1: 'NATIVE_TABBAR'  `原生 tabbar`
 * 2: 'CUSTOM_TABBAR' `自定义 tabbar`
 *
 * 温馨提示：本文件的任何代码更改了之后，都需要重新运行，否则 pages.json 不会更新导致配置不生效
 */
export const TABBAR_STRATEGY_MAP = {
  NO_TABBAR: 0,
  NATIVE_TABBAR: 1,
  CUSTOM_TABBAR: 2,
}

export const selectedTabbarStrategy = TABBAR_STRATEGY_MAP.CUSTOM_TABBAR

export const nativeTabbarList: NativeTabBarItem[] = [
  {
    iconPath: 'static/tabbar/home.png',
    selectedIconPath: 'static/tabbar/homeHL.png',
    pagePath: 'pages/index/index',
    text: '%tabbar.home%',
  },
  {
    iconPath: 'static/tabbar/personal.png',
    selectedIconPath: 'static/tabbar/personalHL.png',
    pagePath: 'pages/me/me',
    text: '%tabbar.me%',
  },
]

// 鼓包视觉在 `@repo/shared` 的 Tabbar 内；点击逻辑在调用处（如 App.ku.vue）
export const customTabbarList: CustomTabBarItem[] = [
  {
    text: '%tabbar.home%',
    pagePath: 'pages/index/index',
    // unocss 图标：写入 uno.config.ts 的 safelist，或保证 uno 扫描 packages/shared
    iconType: 'unocss',
    icon: 'i-carbon-home',
  },
  {
    pagePath: 'pages/i18n/index',
    text: '%tabbar.i18n%',
    iconType: 'unocss',
    icon: 'i-carbon-ibm-watson-language-translator',
  },
  {
    pagePath: 'pages/about/about',
    text: '%tabbar.about%',
    iconType: 'unocss',
    icon: 'i-carbon-menu',
    roles: ['admin'],
  },
  {
    pagePath: 'pages/me/me',
    text: '%tabbar.me%',
    iconType: 'unocss',
    icon: 'i-carbon-user',
  },
]

export const tabbarCacheEnable
  = [TABBAR_STRATEGY_MAP.NATIVE_TABBAR, TABBAR_STRATEGY_MAP.CUSTOM_TABBAR].includes(selectedTabbarStrategy)

export const customTabbarEnable = [TABBAR_STRATEGY_MAP.CUSTOM_TABBAR].includes(selectedTabbarStrategy)

export const needHideNativeTabbar = selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR

const _tabbarList = customTabbarEnable ? customTabbarList.map(item => ({ text: item.text, pagePath: item.pagePath })) : nativeTabbarList
export const tabbarList = customTabbarEnable ? customTabbarList : nativeTabbarList

export const isNativeTabbar = selectedTabbarStrategy === TABBAR_STRATEGY_MAP.NATIVE_TABBAR

const _tabbar: TabBar = {
  custom: selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR,
  color: '#999999',
  selectedColor: '#018d71',
  backgroundColor: '#F8F8F8',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: _tabbarList as unknown as TabBar['list'],
}

export const tabBar = tabbarCacheEnable ? _tabbar : undefined
