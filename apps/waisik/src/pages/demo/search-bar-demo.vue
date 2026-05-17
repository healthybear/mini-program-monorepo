<script lang="ts" setup>
import SearchBar from '@/components/search-bar/index.vue'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'SearchBar 组件演示',
  },
})

const searchText1 = ref('')
const searchText2 = ref('')
const searchText3 = ref('')
const searchText4 = ref('')
const searchText5 = ref('预设内容')
const searchText6 = ref('')
const searchText7 = ref('')

function handleSearch(value: string) {
  uni.showToast({
    title: `搜索: ${value}`,
    icon: 'none',
  })
}

function handleBlur() {
  // 输入框失焦
}

function handleClear() {
  uni.showToast({
    title: '已清空',
    icon: 'none',
  })
}

function handleVoiceSearch() {
  uni.showToast({
    title: '语音搜索',
    icon: 'none',
  })
}

function handleRightIconClick() {
  uni.showToast({
    title: '右侧图标点击',
    icon: 'none',
  })
}

function navigateToSearchPage() {
  uni.showToast({
    title: '跳转到搜索页面',
    icon: 'none',
  })
}
</script>

<template>
  <view class="demo-page">
    <!-- 示例1: 基础用法 -->
    <view class="demo-section">
      <view class="section-title">
        1. 基础用法
      </view>
      <SearchBar v-model="searchText1" placeholder="搜索商品、店铺..." />
      <view class="section-desc">
        最简单的用法，支持 v-model 双向绑定
      </view>
      <view v-if="searchText1" class="section-desc">
        当前输入: {{ searchText1 }}
      </view>
    </view>

    <!-- 示例2: 带事件监听 -->
    <view class="demo-section">
      <view class="section-title">
        2. 带事件监听
      </view>
      <SearchBar
        v-model="searchText2"
        placeholder="输入后按搜索键..."
        @search="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
        @clear="handleClear"
      />
      <view class="section-desc">
        监听搜索、聚焦、失焦、清空事件（查看控制台和 Toast）
      </view>
    </view>

    <!-- 示例3: 带右侧图标 -->
    <view class="demo-section">
      <view class="section-title">
        3. 带右侧图标
      </view>
      <SearchBar
        v-model="searchText3"
        placeholder="搜索..."
        right-icon="microphone"
        :right-icon-click="handleVoiceSearch"
        @right-icon-click="handleRightIconClick"
      />
      <view class="section-desc">
        右侧显示语音搜索图标，点击触发回调
      </view>
    </view>

    <!-- 示例4: 自定义右侧内容（插槽） -->
    <view class="demo-section">
      <view class="section-title">
        4. 自定义右侧内容
      </view>
      <SearchBar v-model="searchText4" placeholder="搜索...">
        <template #right>
          <view class="flex items-center" style="gap: 8rpx;" @click="handleVoiceSearch">
            <text class="text-24rpx text-text-secondary">语音</text>
            <view class="h-32rpx w-32rpx flex-center rounded-full bg-primary">
              <view class="i-carbon-microphone text-24rpx text-white" />
            </view>
          </view>
        </template>
      </SearchBar>
      <view class="section-desc">
        使用插槽自定义右侧内容，可以放置任意组件
      </view>
    </view>

    <!-- 示例5: 预设内容 + 清空按钮 -->
    <view class="demo-section">
      <view class="section-title">
        5. 预设内容 + 清空按钮
      </view>
      <SearchBar
        v-model="searchText5"
        placeholder="搜索..."
        @clear="handleClear"
      />
      <view class="section-desc">
        有内容时显示清空按钮，点击清空输入
      </view>
    </view>

    <!-- 示例6: 只读状态 -->
    <view class="demo-section">
      <view class="section-title">
        6. 只读状态
      </view>
      <SearchBar
        v-model="searchText6"
        placeholder="点击跳转到搜索页面"
        readonly
        @click="navigateToSearchPage"
      />
      <view class="section-desc">
        只读状态，常用于点击后跳转到专门的搜索页面
      </view>
    </view>

    <!-- 示例7: 禁用状态 -->
    <view class="demo-section">
      <view class="section-title">
        7. 禁用状态
      </view>
      <SearchBar
        v-model="searchText7"
        placeholder="搜索功能暂不可用"
        disabled
      />
      <view class="section-desc">
        禁用状态，不可交互，整体透明度降低
      </view>
    </view>

    <!-- 示例8: 自定义背景色 -->
    <view class="demo-section">
      <view class="section-title">
        8. 自定义背景色
      </view>
      <SearchBar
        v-model="searchText1"
        placeholder="白色背景..."
        background-color="#ffffff"
      />
      <view class="section-desc mt-16rpx">
        <SearchBar
          v-model="searchText1"
          placeholder="主题色背景..."
          background-color="#e3f2fd"
        />
      </view>
      <view class="section-desc">
        可以自定义背景颜色以适应不同的页面风格
      </view>
    </view>

    <!-- 示例9: 不显示清空按钮 -->
    <view class="demo-section">
      <view class="section-title">
        9. 不显示清空按钮
      </view>
      <SearchBar
        v-model="searchText1"
        placeholder="搜索..."
        :clearable="false"
      />
      <view class="section-desc">
        设置 clearable 为 false，不显示清空按钮
      </view>
    </view>

    <!-- 示例10: 完整配置 -->
    <view class="demo-section">
      <view class="section-title">
        10. 完整配置
      </view>
      <SearchBar
        v-model="searchText1"
        placeholder="搜索商品、店铺..."
        right-icon="microphone"
        background-color="#ffffff"
        :right-icon-click="handleVoiceSearch"
        @search="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
        @clear="handleClear"
        @right-icon-click="handleRightIconClick"
      />
      <view class="section-desc">
        完整配置：自定义背景 + 右侧图标 + 所有事件监听
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.demo-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 32rpx 24rpx;
}

.demo-section {
  margin-bottom: 48rpx;

  .section-title {
    padding-bottom: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #323233;
  }

  .section-desc {
    padding-top: 16rpx;
    font-size: 24rpx;
    color: #969799;
    line-height: 1.6;
  }
}
</style>
