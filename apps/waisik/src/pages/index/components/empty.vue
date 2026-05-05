<script lang="ts" setup>
// 方式1: 使用绝对路径（推荐，适用于所有平台）
// const imgURL = '/static/my-icons/empty-record.svg'

// 方式2: 使用 @ 别名
import emptyRecord from '@/static/my-icons/empty-record.svg'
const imgURL = emptyRecord
</script>

<template>
  <view class="flex-col-center">
    <wd-img :width="190" :height="190" :src="imgURL" />
    <view class="mt-8 text-text-primary text-xl">暂无记录</view>
    <view class="mt-1 text-text-secondary text-xs">记录你第一顿美餐吧</view>
    <wd-button class="mt-10" size="large" block>去新增记录</wd-button>
  </view>
</template>
