import type { Preset } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

// https://www.npmjs.com/package/@uni-helper/unocss-preset-uni
import { presetUni } from '@uni-helper/unocss-preset-uni'
// @see https://unocss.dev/presets/legacy-compat
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'
import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { designTokens } from './src/config/design-tokens'

export default defineConfig({
  presets: [
    presetUni({
      attributify: false,
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        // 注册本地 SVG 图标集合, 从本地文件系统加载图标
        // 在 './src/static/my-icons' 目录下的所有 svg 文件将被注册为图标，
        // my-icons 是图标集合名称，使用 `i-my-icons-图标名` 调用
        'my-icons': FileSystemIconLoader(
          './src/static/my-icons',
          // 可选的，你可以提供一个 transform 回调来更改每个图标
          (svg) => {
            let svgStr = svg

            // 如果 SVG 文件未定义 `fill` 属性，则默认填充 `currentColor`, 这样图标颜色会继承文本颜色，方便在不同场景下适配
            svgStr = svgStr.includes('fill="')
              ? svgStr
              : svgStr.replace(/^<svg /, '<svg fill="currentColor" ')

            // 如果 svg 有 width, 和 height 属性，将这些属性改为 1em，否则无法显示图标
            svgStr = svgStr
              .replace(/(<svg.*?width=)"(.*?)"/, '$1"1em"')
              .replace(/(<svg.*?height=)"(.*?)"/, '$1"1em"')

            return svgStr
          },
        ),
      },
    }),
    // TODO: check 是否会有别的影响
    // 处理低端安卓机的样式问题
    // 将颜色函数 (rgb()和hsl()) 从空格分隔转换为逗号分隔，更好的兼容性app端，example：
    // `rgb(255 0 0)` -> `rgb(255, 0, 0)`
    // `rgba(255 0 0 / 0.5)` -> `rgba(255, 0, 0, 0.5)`
    presetLegacyCompat({
      commaStyleColorFunction: true,
      legacyColorSpace: true, // by QQ4群-量子蔷薇
      // @菲鸽 unocss 配置中，建议在 presetLegacyCompat 中添加 legacyColorSpace: true，以去除生成的颜色样式中的 in oklch 关键字，现在发现有些渐变色生成不符合预期
    }) as Preset,
  ],
  transformers: [
    // 启用指令功能：主要用于支持 @apply、@screen 和 theme() 等 CSS 指令
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
  ],
  shortcuts: [
    // 布局相关
    {
      center: 'flex justify-center items-center',
      'flex-center': 'flex justify-center items-center',
      'flex-col-center': 'flex flex-col justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'flex-around': 'flex justify-around items-center',
      'flex-start': 'flex justify-start items-center',
      'flex-end': 'flex justify-end items-center',
      'flex-col': 'flex flex-col',
      'flex-wrap': 'flex flex-wrap',
      'absolute-center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'absolute-lt': 'absolute left-0 top-0',
      'absolute-rt': 'absolute right-0 top-0',
      'absolute-lb': 'absolute left-0 bottom-0',
      'absolute-rb': 'absolute right-0 bottom-0',
      'fixed-center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    },
    // 文本相关
    {
      'text-ellipsis': 'overflow-hidden whitespace-nowrap text-overflow-ellipsis',
      'text-ellipsis-2': 'overflow-hidden line-clamp-2',
      'text-ellipsis-3': 'overflow-hidden line-clamp-3',
      'text-break': 'break-all whitespace-normal',
    },
    // 尺寸相关
    {
      'wh-full': 'w-full h-full',
      'wh-screen': 'w-screen h-screen',
      'size-full': 'w-full h-full',
    },
    // 交互相关
    {
      'click-active': 'active:opacity-70 transition-opacity',
      'hover-scale': 'hover:scale-105 transition-transform',
    },
  ],
  // 动态图标需要在这里配置，或者写在vue页面中注释掉
  safelist: [
    'i-carbon-code',
    'i-carbon-home',
    'i-carbon-user',
    'i-carbon-location',
    'i-carbon-explore',
    'i-carbon-chart-line',
    'i-carbon-ibm-watson-language-translator',
    'i-carbon-menu',
    // AppBar 组件图标
    'i-carbon-arrow-left',
    'i-carbon-close',
    'i-carbon-search',
    'i-carbon-add',
    'i-carbon-filter',
    'i-carbon-settings',
    'i-carbon-help',
    'i-carbon-notification',
    'i-carbon-overflow-menu-vertical',
    // SearchBar 组件图标
    'i-carbon-microphone',
    // 新建记录页面图标
    'i-carbon-camera',
    'i-carbon-renew',
    // 记录详情页面图标
    'i-carbon-share',
    'i-carbon-star-filled',
    'i-carbon-navigation',
    'i-carbon-edit',
    'i-carbon-trash-can',
    'i-carbon-time',
    // 记录卡片组件图标
    'i-carbon-restaurant',
  ],
  rules: [
    // 安全区域
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    ['pl-safe', { 'padding-left': 'env(safe-area-inset-left)' }],
    ['pr-safe', { 'padding-right': 'env(safe-area-inset-right)' }],
    ['mt-safe', { 'margin-top': 'env(safe-area-inset-top)' }],
    ['mb-safe', { 'margin-bottom': 'env(safe-area-inset-bottom)' }],
    // 1px 边框（解决小程序 0.5px 边框问题）
    ['border-1px', { border: '1rpx solid currentColor' }],
    ['border-t-1px', { 'border-top': '1rpx solid currentColor' }],
    ['border-b-1px', { 'border-bottom': '1rpx solid currentColor' }],
    ['border-l-1px', { 'border-left': '1rpx solid currentColor' }],
    ['border-r-1px', { 'border-right': '1rpx solid currentColor' }],
    // 渐变背景
    [
      /^bg-gradient-(.+)$/,
      ([, colors]) => {
        const colorList = colors.split('-to-')
        if (colorList.length === 2) {
          return {
            'background-image': `linear-gradient(to right, ${colorList[0]}, ${colorList[1]})`,
          }
        }
      },
    ],
  ],
  theme: {
    colors: {
      primary: designTokens.colors.primary,
      success: designTokens.colors.success,
      warning: designTokens.colors.warning,
      danger: designTokens.colors.danger,
      error: designTokens.colors.error,
      info: designTokens.colors.info,

      'text-primary': designTokens.colors.textPrimary,
      'text-secondary': designTokens.colors.textSecondary,
      'text-placeholder': designTokens.colors.textPlaceholder,
      'text-disabled': designTokens.colors.textDisabled,
      'text-inverse': designTokens.colors.textInverse,

      'bg-page': designTokens.colors.bgPage,
      'bg-card': designTokens.colors.bgCard,
      'bg-grey': designTokens.colors.bgGrey,
      'bg-hover': designTokens.colors.bgHover,
      'bg-mask': designTokens.colors.bgMask,

      'border-light': designTokens.colors.borderLight,
      'border-base': designTokens.colors.borderBase,
    },
    fontSize: designTokens.fontSize,
    spacing: designTokens.spacing,
    borderRadius: designTokens.borderRadius,
    boxShadow: designTokens.boxShadow,
    zIndex: designTokens.zIndex,
  },
  // windows 系统会报错：[plugin:unocss:transformers:pre] Cannot overwrite a zero-length range - use append Left or prependRight instead.
  // 去掉下面的就正常了
  // content: {
  //   /**
  //    * 解决小程序报错 `./app.wxss(78:2814): unexpected unexpected at pos 5198`
  //    * 为什么同时使用include和exclude？虽然看起来多余，但同时配置两者是一种常见的 `防御性编程` 做法。
  //      1. 结构变化保障 : 如果未来项目结构发生变化，某些排除目录可能被移动到包含路径下，exclude配置可以确保它们仍被排除
  //      2. 明确性 : 明确列出要排除的目录使配置意图更加清晰
  //      3. 性能优化 : 避免处理不必要的文件，提高构建性能
  //      4. 防止冲突 : 排除第三方库和构建输出目录，避免潜在的CSS冲突
  //    */
  //   pipeline: {
  //     exclude: [
  //       'node_modules/**/*',
  //       'public/**/*',
  //       'dist/**/*',
  //     ],
  //     include: [
  //       './src/**/*',
  //     ],
  //   },
  // },
})
