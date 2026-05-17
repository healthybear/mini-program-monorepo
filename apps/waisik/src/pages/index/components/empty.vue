<script lang="ts" setup>
import emptyRecord from '@/static/my-icons/empty-record.svg'

const imgURL = emptyRecord

function handleAddRecord() {
  uni.navigateTo({
    url: '/pages/record/new',
  })
}
</script>

<template>
  <view class="flex-col-center">
    <wd-img :width="190" :height="190" :src="imgURL" />
    <view class="mt-8 text-xl text-text-primary">
      暂无记录
    </view>
    <view class="mt-1 text-xs text-text-secondary">
      记录你第一顿美餐吧
    </view>
    <wd-button class="mt-10" size="large" block @click="handleAddRecord">
      去新增记录
    </wd-button>
  </view>
</template>
