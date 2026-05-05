<script setup lang="ts">
import type { SearchBarEmits, SearchBarProps } from './types'

defineOptions({
  name: 'SearchBar',
})

const props = withDefaults(defineProps<SearchBarProps>(), {
  placeholder: '搜索...',
  disabled: false,
  readonly: false,
  clearable: true,
  backgroundColor: '#f5f5f5',
})

const emit = defineEmits<SearchBarEmits>()

const slots = useSlots()

// 内部输入值
const inputValue = ref(props.modelValue || '')

// 监听外部 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal || ''
})

// 是否显示清空按钮
const showClear = computed(() => {
  return props.clearable &&
         !props.disabled &&
         !props.readonly &&
         !!inputValue.value
})

// 是否显示右侧区域
const showRightArea = computed(() => {
  return props.rightIcon || slots.right
})

// 是否显示分割线
const showDivider = computed(() => {
  return showRightArea.value
})

/**
 * 输入事件处理
 */
function handleInput(e: any) {
  const value = e.detail.value
  inputValue.value = value
  emit('update:modelValue', value)
}

/**
 * 聚焦事件处理
 */
function handleFocus(e: any) {
  emit('focus', e)
}

/**
 * 失焦事件处理
 */
function handleBlur(e: any) {
  emit('blur', e)
}

/**
 * 搜索确认事件处理（键盘搜索按钮）
 */
function handleSearch(e: any) {
  emit('search', inputValue.value)
}

/**
 * 清空按钮点击处理
 */
function handleClear() {
  inputValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

/**
 * 右侧图标点击处理
 */
function handleRightIconClick() {
  emit('right-icon-click')
  props.rightIconClick?.()
}
</script>

<template>
  <view
    class="search-bar flex items-center"
    :class="{ 'search-bar-disabled': disabled }"
    :style="{ backgroundColor }"
  >
    <!-- 左侧搜索图标 -->
    <view class="search-icon w-48rpx h-48rpx flex-center">
      <view class="i-carbon-search text-48rpx text-text-secondary" />
    </view>

    <!-- 输入框区域 -->
    <view class="input-wrapper flex-1 flex items-center mx-16rpx">
      <input
        v-model="inputValue"
        class="input flex-1"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        confirm-type="search"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleSearch"
      />

      <!-- 清空按钮 -->
      <view
        v-if="showClear"
        class="clear-button w-40rpx h-40rpx flex-center rounded-full bg-[#d0d0d0] active:opacity-70 transition-opacity ml-8rpx"
        @click="handleClear"
      >
        <view class="i-carbon-close text-32rpx text-white" />
      </view>
    </view>

    <!-- 分割线 -->
    <view
      v-if="showDivider"
      class="divider w-1px h-40rpx bg-border-light"
    />

    <!-- 右侧区域 -->
    <view v-if="showRightArea" class="right-area ml-12rpx">
      <!-- 插槽优先 -->
      <slot name="right">
        <!-- 回退到图标 -->
        <view
          v-if="rightIcon"
          class="icon-button w-48rpx h-48rpx flex-center rounded-full active:bg-hover transition-colors"
          @click="handleRightIconClick"
        >
          <view :class="`i-carbon-${rightIcon} text-48rpx text-text-secondary`" />
        </view>
      </slot>
    </view>
  </view>
</template>

<style scoped lang="scss">
.search-bar {
  height: 96rpx;
  padding: 0 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.08);
  transition: opacity 0.2s;
}

.search-bar-disabled {
  opacity: 0.3;
  pointer-events: none;
}

.input-wrapper {
  min-width: 0; /* 允许 flex 子元素收缩 */
}

.input {
  flex: 1;
  min-width: 0;
  height: 96rpx;
  font-size: 28rpx;
  color: #323233;
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: #c8c9cc;
  }
}

.clear-button {
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}

.icon-button {
  cursor: pointer;
  user-select: none;
}

.right-area {
  flex-shrink: 0;
}
</style>
