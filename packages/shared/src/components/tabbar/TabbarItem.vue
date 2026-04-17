<script setup lang="ts">
import type { SharedTabBarItem } from './types'

const props = defineProps<{
  item: SharedTabBarItem
  index: number
  isBulge?: boolean
  isSelected: boolean
  resolveText: (key: string) => string
}>()

function getImageSrc(item: SharedTabBarItem, isSelected: boolean) {
  if (!item.iconActive) {
    if (item.iconType === 'image') {
      console.warn('[tabbar] image 模式建议配置 iconActive，否则无法切换高亮图')
    }
    return item.icon
  }
  return isSelected ? item.iconActive : item.icon
}

function iconClass(item: SharedTabBarItem, isSelected: boolean) {
  if (item.iconType !== 'unocss' && item.iconType !== 'iconfont')
    return ''
  if (item.iconActive && isSelected)
    return item.iconActive
  return item.icon
}

function displayText(item: SharedTabBarItem, isSelected: boolean) {
  const key = isSelected && item.textActive ? item.textActive : item.text
  return props.resolveText(key)
}
</script>

<template>
  <view class="flex flex-col items-center justify-center">
    <template v-if="item.iconType === 'uiLib'">
      <!-- 由宿主应用替换为 wd-icon / uv-icon 等 -->
      <slot name="uiLib-icon" :icon="item.icon" :is-bulge="isBulge" />
    </template>
    <template v-if="item.iconType === 'unocss' || item.iconType === 'iconfont'">
      <view :class="[iconClass(item, isSelected), isBulge ? 'text-80px' : 'text-20px']" />
    </template>
    <template v-if="item.iconType === 'image'">
      <image
        :src="getImageSrc(item, isSelected)"
        mode="scaleToFill"
        :class="isBulge ? 'h-80px w-80px' : 'h-24px w-24px'"
      />
    </template>
    <view v-if="!isBulge" class="mt-2px text-12px">
      {{ displayText(item, isSelected) }}
    </view>
    <view v-if="item.badge">
      <template v-if="item.badge === 'dot'">
        <view class="absolute right-0 top-0 h-2 w-2 rounded-full bg-#f56c6c" />
      </template>
      <template v-else>
        <view class="absolute top-0 box-border h-5 min-w-5 center rounded-full bg-#f56c6c px-1 text-center text-xs text-white -right-3">
          {{ item.badge > 99 ? '99+' : item.badge }}
        </view>
      </template>
    </view>
  </view>
</template>
