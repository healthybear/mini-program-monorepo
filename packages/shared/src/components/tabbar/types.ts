/** 角标：数字或红点 */
export type SharedTabbarItemBadge = number | 'dot'

/** 与 app 路由无关的 TabBar 单项（业务侧可扩展 roles、更严格的 pagePath 等） */
export interface SharedTabBarItem {
  text: string
  pagePath: string
  iconType: 'uiLib' | 'unocss' | 'iconfont' | 'image'
  /**
   * - uiLib: UI 库图标名（由宿主自行在 TabbarItem 插槽中渲染）
   * - unocss / iconfont: 类名
   * - image: 图片 URL
   */
  icon: string
  /** image：选中图；unocss/iconfont：选中时的类名 */
  iconActive?: string
  badge?: SharedTabbarItemBadge
  isBulge?: boolean
  /** 覆盖主题中该项选中色 */
  activeColor?: string
  /** 覆盖主题中该项未选中色 */
  inactiveColor?: string
  /** 选中时展示的文案 key（仍由 resolveText 解析） */
  textActive?: string
}

/** 胶囊容器与颜色主题 */
export interface TabbarTheme {
  /** 导航条背景 */
  background: string
  /** 导航条边框 */
  borderColor: string
  /** 默认图标与文字颜色 */
  inactiveColor: string
  /** 选中项颜色 */
  activeColor: string
  /** 胶囊圆角 */
  borderRadius: string
  /** 左右外边距（与屏幕边缘距离） */
  horizontalInset: string
  /** 条与屏幕底之间的额外间距（不含安全区） */
  floatBottomOffset: string
  /** 阴影 */
  shadow: string
  /** 内条最小高度 */
  barMinHeight: string
  /** 胶囊内边距 */
  barPadding: string
  /** 为页面内容预留的底部占位高度（含悬浮间距与安全区的大致补偿） */
  spacerMinHeight: string
}

export const defaultTabbarTheme: TabbarTheme = {
  background: 'rgba(255,255,255,0.9)',
  borderColor: 'rgba(243,244,246,0.5)',
  inactiveColor: '#9CA3AF',
  activeColor: '#3B82F6',
  borderRadius: '9999px',
  horizontalInset: '24rpx',
  floatBottomOffset: '16rpx',
  shadow: '0 8rpx 32rpx rgba(15, 23, 42, 0.08)',
  barMinHeight: '100rpx',
  barPadding: '12rpx 16rpx',
  spacerMinHeight: '140rpx',
}

export function mergeTabbarTheme(partial?: Partial<TabbarTheme>): TabbarTheme {
  return { ...defaultTabbarTheme, ...partial }
}
