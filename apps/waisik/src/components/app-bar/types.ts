/**
 * AppBar Component Type Definitions
 */

/**
 * 图标配置接口
 */
export interface IconConfig {
  /** Carbon 图标名称（如 'search', 'add'） */
  icon: string
  /** 点击回调函数 */
  onClick: () => void
  /** 角标（可选，未来扩展） */
  badge?: string | number
}

/**
 * AppBar 组件 Props 接口
 */
export interface AppBarProps {
  /** 标题文本（必填） */
  title: string
  /** 左侧图标（Carbon 图标名，如 'arrow-left'） */
  leftIcon?: string
  /** 左侧图标点击回调（可选，默认执行 uni.navigateBack()） */
  leftIconClick?: () => void
  /** 右侧图标配置数组 */
  rightIcons?: IconConfig[]
  /** 背景颜色（默认白色） */
  backgroundColor?: string
  /** 是否固定定位（默认 false） */
  fixed?: boolean
}

/**
 * AppBar 组件事件接口
 */
export interface AppBarEmits {
  /** 左侧图标点击事件 */
  (e: 'left-click'): void
  /** 右侧图标点击事件 */
  (e: 'right-icon-click', index: number): void
}
