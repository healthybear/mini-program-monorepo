<script setup lang="ts">
import { computed } from 'vue'
import type { SharedTabBarItem, TabbarTheme } from './types'
import { mergeTabbarTheme } from './types'
import TabbarItem from './TabbarItem.vue'

// #ifdef MP-WEIXIN
defineOptions({
  virtualHost: true,
})
// #endif

const props = withDefaults(
  defineProps<{
    items: SharedTabBarItem[]
    /** 当前选中下标（受控） */
    currentIndex: number
    theme?: Partial<TabbarTheme>
    /** 解析文案，如 i18n：传入 getI18nText */
    resolveText?: (key: string) => string
  }>(),
  {
    resolveText: undefined,
  },
)

const emit = defineEmits<{
  change: [index: number]
}>()

const mergedTheme = computed(() => mergeTabbarTheme(props.theme))

const resolveLabel = computed(() => props.resolveText ?? ((k: string) => k))

function getColorByIndex(index: number) {
  const item = props.items[index]
  const th = mergedTheme.value
  const selected = index === props.currentIndex
  if (!item)
    return th.inactiveColor
  if (selected)
    return item.activeColor ?? th.activeColor
  return item.inactiveColor ?? th.inactiveColor
}

function onItemTap(index: number) {
  emit('change', index)
}

const pillStyle = computed(() => {
  const th = mergedTheme.value
  return {
    background: th.background,
    border: `1px solid ${th.borderColor}`,
    boxShadow: th.shadow,
    borderRadius: th.borderRadius,
    minHeight: th.barMinHeight,
    padding: th.barPadding,
    boxSizing: 'border-box',
  }
})

const insetStyle = computed(() => {
  const th = mergedTheme.value
  return {
    paddingLeft: th.horizontalInset,
    paddingRight: th.horizontalInset,
    paddingBottom: `calc(${th.floatBottomOffset} + env(safe-area-inset-bottom, 0px))`,
  }
})

const spacerStyle = computed(() => ({
  minHeight: `calc(${mergedTheme.value.spacerMinHeight} + env(safe-area-inset-bottom, 0px))`,
}))
</script>

<template>
  <view class="tabbar-root" :style="spacerStyle">
    <view class="tabbar-fixed" :style="insetStyle" @touchmove.stop.prevent>
      <view class="tabbar-pill flex items-center" :style="pillStyle">
        <view
          v-for="(item, index) in items"
          :key="index"
          class="tabbar-cell flex flex-1 flex-col items-center justify-center"
          :style="{ color: getColorByIndex(index) }"
          @click="onItemTap(index)"
        >
          <view v-if="item.isBulge" class="relative">
            <view class="bulge">
              <TabbarItem
                :item="item"
                :index="index"
                class="text-center"
                :is-selected="currentIndex === index"
                :resolve-text="resolveLabel"
                is-bulge
              >
                <template #uiLib-icon="{ icon, isBulge: bulge }">
                  <slot name="uiLib-icon" :icon="icon" :item="item" :index="index" :is-bulge="bulge" />
                </template>
              </TabbarItem>
            </view>
          </view>
          <TabbarItem
            v-else
            :item="item"
            :index="index"
            class="relative px-3 text-center"
            :is-selected="currentIndex === index"
            :resolve-text="resolveLabel"
          >
            <template #uiLib-icon="{ icon, isBulge: bulge }">
              <slot name="uiLib-icon" :icon="icon" :item="item" :index="index" :is-bulge="bulge" />
            </template>
          </TabbarItem>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.tabbar-root {
  box-sizing: border-box;
}

.tabbar-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-sizing: border-box;
}

.tabbar-pill {
  box-sizing: border-box;
}

.tabbar-cell {
  min-width: 0;
}

.bulge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform-origin: top center;
  transform: translateX(-50%) scale(0.5) translateY(-33%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250rpx;
  height: 250rpx;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: inset 0 0 0 1px #fefefe;
}
</style>
