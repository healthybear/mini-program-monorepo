<script lang="ts" setup>
import SearchBar from '@/components/searchBar/search-bar.vue'

const handleMenuClick = () => {
  uni.showToast({
    title: '菜单点击',
    icon: 'none',
  })
}

const handleMessageClick = () => {
  uni.showToast({
    title: '消息点击',
    icon: 'none',
  })
}
</script>

<template>
  <view class="demo-page">
    <view class="demo-section">
      <view class="section-title">
        默认配置
      </view>
      <SearchBar
        title="首页"
        @menu-click="handleMenuClick"
        @message-click="handleMessageClick"
      />
    </view>

    <view class="demo-section">
      <view class="section-title">
        自定义标题
      </view>
      <SearchBar
        title="我的订单"
        @menu-click="handleMenuClick"
        @message-click="handleMessageClick"
      />
    </view>

    <view class="demo-section">
      <view class="section-title">
        仅显示标题
      </view>
      <SearchBar
        title="设置"
        :show-menu="false"
        :show-message="false"
      />
    </view>

    <view class="demo-section">
      <view class="section-title">
        无菜单图标
      </view>
      <SearchBar
        title="个人中心"
        :show-menu="false"
        @message-click="handleMessageClick"
      />
    </view>

    <view class="demo-section">
      <view class="section-title">
        长标题测试
      </view>
      <SearchBar
        title="这是一个非常长的标题用来测试文本溢出效果"
        @menu-click="handleMenuClick"
        @message-click="handleMessageClick"
      />
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
    color: #646566;
  }
}
</style>
