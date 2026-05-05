/**
 * 设计规范配置 - 唯一数据源
 * 基于 wot-design-uni 组件库规范
 *
 * 此文件是项目样式配置的唯一数据源，所有样式相关配置都应该从这里读取
 * - uno.config.ts 直接导入使用
 * - uni.scss 通过脚本自动生成（运行 pnpm generate:scss）
 */

export const designTokens = {
  /** 颜色系统 */
  colors: {
    // 主题色
    primary: '#0957DE',

    // 功能色
    success: '#07c160',
    warning: '#ff976a',
    danger: '#ee0a24',
    error: '#ee0a24', // 与 danger 保持一致
    info: '#1989fa',

    // 文本颜色
    textPrimary: '#323233',
    textSecondary: '#646566',
    textPlaceholder: '#c8c9cc',
    textDisabled: '#c8c9cc',
    textInverse: '#ffffff',

    // 背景颜色
    bgPage: '#f7f8fa',
    bgCard: '#ffffff',
    bgGrey: '#f8f8f8',
    bgHover: '#f1f1f1',
    bgMask: 'rgba(0, 0, 0, 0.4)',

    // 边框颜色
    borderLight: '#ebedf0',
    borderBase: '#dcdee0',
  },

  /** 字体大小 */
  fontSize: {
    '3xs': ['18rpx', '26rpx'],
    '2xs': ['20rpx', '28rpx'],
    xs: ['24rpx', '32rpx'],
    sm: ['26rpx', '36rpx'],
    base: ['28rpx', '40rpx'],
    lg: ['32rpx', '44rpx'],
    xl: ['36rpx', '48rpx'],
    '2xl': ['40rpx', '52rpx'],
  },

  /** 间距系统 */
  spacing: {
    xs: '8rpx',
    sm: '12rpx',
    base: '16rpx',
    md: '20rpx',
    lg: '24rpx',
    xl: '32rpx',
    '2xl': '40rpx',
    '3xl': '48rpx',

    // 语义化间距
    item: '12rpx',
    section: '16rpx',
    card: '24rpx',
    page: '32rpx',
  },

  /** 圆角 */
  borderRadius: {
    none: '0',
    sm: '4rpx',
    base: '8rpx',
    md: '12rpx',
    lg: '16rpx',
    xl: '20rpx',
    full: '9999rpx',

    // 语义化圆角
    tag: '4rpx',
    button: '8rpx',
    card: '16rpx',
  },

  /** 阴影 */
  boxShadow: {
    sm: '0 2rpx 8rpx rgba(0, 0, 0, 0.08)',
    base: '0 4rpx 12rpx rgba(0, 0, 0, 0.12)',
    lg: '0 8rpx 24rpx rgba(0, 0, 0, 0.16)',
  },

  /** 透明度 */
  opacity: {
    disabled: 0.3,
    hover: 0.7,
  },

  /** z-index 层级 */
  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 100,
    fixed: 1000,
    modal: 2000,
    popover: 3000,
    toast: 4000,
  },
}

export type DesignTokens = typeof designTokens
