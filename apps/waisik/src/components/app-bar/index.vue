<script setup lang="ts">
import type { AppBarEmits, AppBarProps, IconConfig } from './types'

defineOptions({
  name: 'AppBar',
})

const props = withDefaults(defineProps<AppBarProps>(), {
  backgroundColor: '#ffffff',
  fixed: false,
})

const emit = defineEmits<AppBarEmits>()

// Popover 显示状态
const showPopover = ref(false)

// 计算直接显示的图标（最多2个）
const visibleIcons = computed(() => props.rightIcons?.slice(0, 2) || [])

// 计算溢出的图标（第3个开始）
const overflowIcons = computed(() => props.rightIcons?.slice(2) || [])

// 是否显示"更多"按钮
const hasOverflow = computed(() => (props.rightIcons?.length || 0) > 2)

/**
 * 左侧图标点击处理
 */
function handleLeftClick() {
  emit('left-click')
  if (props.leftIconClick) {
    props.leftIconClick()
  }
  else {
    // 默认行为：返回上一页
    uni.navigateBack()
  }
}

/**
 * 右侧图标点击处理
 */
function handleRightIconClick(index: number, icon: IconConfig) {
  emit('right-icon-click', index)
  icon.onClick?.()
}

/**
 * 溢出菜单图标点击处理
 */
function handleOverflowClick(index: number, icon: IconConfig) {
  emit('right-icon-click', index)
  icon.onClick?.()
  // 关闭 Popover
  showPopover.value = false
}
</script>

<template>
  <view
    class="app-bar flex-between"
    :class="{ 'app-bar-fixed': fixed }"
    :style="{ backgroundColor }"
  >
    <!-- 左侧图标区域 -->
    <view v-if="leftIcon" class="left-area">
      <view
        class="icon-button w-48rpx h-48rpx flex-center rounded-full active:bg-hover transition-colors"
        @click="handleLeftClick"
      >
        <view :class="`i-carbon-${leftIcon}`" class="text-48rpx text-text-primary" />
      </view>
    </view>

    <!-- 标题区域 -->
    <view class="title-area flex-1 text-ellipsis" :class="{ 'ml-8rpx': leftIcon }">
      <text class="title-text text-32rpx text-text-primary font-medium">{{ title }}</text>
    </view>

    <!-- 右侧图标组区域 -->
    <view v-if="rightIcons && rightIcons.length > 0" class="right-area flex items-center">
      <!-- 直接显示的图标（最多2个） -->
      <view
        v-for="(icon, index) in visibleIcons"
        :key="index"
        class="icon-button w-48rpx h-48rpx flex-center rounded-full active:bg-hover transition-colors"
        :class="{ 'ml-24rpx': index > 0 }"
        @click="handleRightIconClick(index, icon)"
      >
        <view :class="`i-carbon-${icon.icon}`" class="text-48rpx text-text-primary" />
      </view>

      <!-- 更多按钮（超过2个图标时显示） -->
      <wd-popover
        v-if="hasOverflow"
        v-model="showPopover"
        placement="bottom-end"
        :offset="[0, 8]"
      >
        <template #content>
          <view class="overflow-menu">
            <view
              v-for="(icon, index) in overflowIcons"
              :key="index"
              class="menu-item h-88rpx flex-center active:bg-hover transition-colors"
              @click="handleOverflowClick(index + 2, icon)"
            >
              <view :class="`i-carbon-${icon.icon}`" class="text-48rpx text-text-primary" />
            </view>
          </view>
        </template>
        <view class="icon-button w-48rpx h-48rpx flex-center rounded-full active:bg-hover transition-colors ml-24rpx">
          <view class="i-carbon-overflow-menu-vertical text-48rpx text-text-primary" />
        </view>
      </wd-popover>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.app-bar {
  height: 112rpx;
  padding: 0 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.app-bar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.left-area {
  flex-shrink: 0;
}

.title-area {
  min-width: 0; /* 允许 flex 子元素收缩 */
}

.title-text {
  display: block;
  line-height: 112rpx;
}

.right-area {
  flex-shrink: 0;
  margin-left: 16rpx;
}

.icon-button {
  cursor: pointer;
  user-select: none;
}

.overflow-menu {
  min-width: 88rpx;
}

.menu-item {
  cursor: pointer;
  user-select: none;
}
</style>
