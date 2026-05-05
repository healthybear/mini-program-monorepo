<script lang="ts" setup>
import AppBar from '@/components/app-bar/index.vue'
import type { IconConfig } from '@/components/app-bar/types'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'AppBar 组件演示',
  },
})

const handleSearch = () => {
  uni.showToast({
    title: '搜索',
    icon: 'none',
  })
}

const handleAdd = () => {
  uni.showToast({
    title: '添加',
    icon: 'none',
  })
}

const handleFilter = () => {
  uni.showToast({
    title: '筛选',
    icon: 'none',
  })
}

const handleSettings = () => {
  uni.showToast({
    title: '设置',
    icon: 'none',
  })
}

const handleHelp = () => {
  uni.showToast({
    title: '帮助',
    icon: 'none',
  })
}

const handleCustomBack = () => {
  uni.showModal({
    title: '提示',
    content: '确定要返回吗？',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    },
  })
}

// 两个图标
const twoIcons: IconConfig[] = [
  { icon: 'search', onClick: handleSearch },
  { icon: 'add', onClick: handleAdd },
]

// 多个图标（测试溢出）
const manyIcons: IconConfig[] = [
  { icon: 'search', onClick: handleSearch },
  { icon: 'filter', onClick: handleFilter },
  { icon: 'settings', onClick: handleSettings },
  { icon: 'help', onClick: handleHelp },
]
</script>

<template>
  <view class="demo-page">
    <!-- 示例1: 仅标题 -->
    <view class="demo-section">
      <view class="section-title">
        1. 仅标题
      </view>
      <AppBar title="首页" />
      <view class="section-desc">
        最简单的用法，只显示标题
      </view>
    </view>

    <!-- 示例2: 带返回按钮 -->
    <view class="demo-section">
      <view class="section-title">
        2. 带返回按钮
      </view>
      <AppBar title="详情页" left-icon="arrow-left" />
      <view class="section-desc">
        左侧显示返回按钮，点击默认返回上一页
      </view>
    </view>

    <!-- 示例3: 自定义返回行为 -->
    <view class="demo-section">
      <view class="section-title">
        3. 自定义返回行为
      </view>
      <AppBar title="编辑资料" left-icon="arrow-left" :left-icon-click="handleCustomBack" />
      <view class="section-desc">
        自定义返回按钮点击行为（弹出确认对话框）
      </view>
    </view>

    <!-- 示例4: 带右侧图标 -->
    <view class="demo-section">
      <view class="section-title">
        4. 带右侧图标（2个）
      </view>
      <AppBar title="消息列表" :right-icons="twoIcons" />
      <view class="section-desc">
        右侧显示2个操作图标
      </view>
    </view>

    <!-- 示例5: 完整配置 -->
    <view class="demo-section">
      <view class="section-title">
        5. 完整配置
      </view>
      <AppBar title="我的订单" left-icon="arrow-left" :right-icons="twoIcons" />
      <view class="section-desc">
        左侧返回按钮 + 标题 + 右侧操作图标
      </view>
    </view>

    <!-- 示例6: 溢出菜单（3+图标） -->
    <view class="demo-section">
      <view class="section-title">
        6. 溢出菜单（4个图标）
      </view>
      <AppBar title="设置" :right-icons="manyIcons" />
      <view class="section-desc">
        超过2个图标时，显示第1个图标 + 更多按钮（⋮）
      </view>
    </view>

    <!-- 示例7: 长标题测试 -->
    <view class="demo-section">
      <view class="section-title">
        7. 长标题测试
      </view>
      <AppBar
        title="这是一个非常长的标题用来测试文本溢出效果当标题过长时会自动截断"
        left-icon="arrow-left"
        :right-icons="twoIcons"
      />
      <view class="section-desc">
        标题过长时自动截断显示省略号
      </view>
    </view>

    <!-- 示例8: 固定定位 -->
    <view class="demo-section">
      <view class="section-title">
        8. 固定定位
      </view>
      <view class="section-desc mb-16rpx">
        设置 fixed 属性后，标题栏固定在页面顶部
      </view>
      <AppBar title="固定标题栏" left-icon="arrow-left" :right-icons="twoIcons" :fixed="true" />
      <view class="section-desc mt-120rpx">
        （此示例标题栏固定在页面顶部）
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.demo-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 32rpx 0;
}

.demo-section {
  margin-bottom: 48rpx;

  .section-title {
    padding: 0 24rpx 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #323233;
  }

  .section-desc {
    padding: 16rpx 24rpx 0;
    font-size: 24rpx;
    color: #969799;
    line-height: 1.6;
  }
}
</style>
