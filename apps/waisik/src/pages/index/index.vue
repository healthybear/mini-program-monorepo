<script lang="ts" setup>
defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

import { storeToRefs } from 'pinia'
import Empty from './components/empty.vue'
import AppBar from '@/components/app-bar/index.vue'
import SearchBar from '@/components/search-bar/index.vue'
import { useRecordStore } from '@/store'

const recordStore = useRecordStore()
const { records, loading, hasMore } = storeToRefs(recordStore)

const refreshing = ref(false)

onLoad(async () => {
  console.log('测试 uni API 自动引入: onLoad')
  try {
    await recordStore.fetchRecords(true)
  }
  catch (error) {
    console.error('首页加载数据失败:', error)
    // HTTP 拦截器会自动处理 401 错误并跳转到登录页
  }
})

const onRefresh = async () => {
  refreshing.value = true
  try {
    await recordStore.fetchRecords(true)
  }
  finally {
    refreshing.value = false
  }
}

const onLoadMore = async () => {
  if (!loading.value && hasMore.value) {
    await recordStore.fetchRecords(false)
  }
}

const goToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/record/detail?id=${id}`,
  })
}

const goToNew = () => {
  uni.navigateTo({
    url: '/pages/record/new',
  })
}
</script>

<template>
  <view class="flex-col wh-full bg-gray-50">
    <AppBar title="为食" />

    <view class="flex-1 overflow-hidden">
      <scroll-view
        scroll-y
        class="wh-full"
        refresher-enabled
        :refresher-triggered="refreshing"
        @refresherrefresh="onRefresh"
        @scrolltolower="onLoadMore"
      >
        <view v-if="records.length === 0 && !loading" class="center wh-full">
          <Empty />
        </view>

        <view v-else class="p-4 space-y-3">
          <view class="p-4 bg-white border-t border-gray-100">
            <SearchBar />
          </view>
          <view
            v-for="record in records"
            :key="record.id"
            class="bg-white rounded-2 p-3 shadow-sm"
            @tap="goToDetail(record.id)"
          >
            <view class="flex items-start gap-3">
              <image
                v-if="record.images?.[0]"
                :src="record.images[0]"
                class="w-20 h-20 rounded-2 flex-shrink-0"
                mode="aspectFill"
              />

              <view class="flex-1 min-w-0">
                <view class="text-base font-medium text-gray-900 mb-1">
                  {{ record.restaurantName }}
                </view>

                <view class="flex items-center gap-2 mb-2">
                  <view class="flex items-center">
                    <text
                      v-for="i in 5"
                      :key="i"
                      class="text-yellow-500"
                      :class="i <= Math.floor(record.rating) ? 'i-carbon-star-filled' : (i - 0.5 === record.rating ? 'i-carbon-star-half' : 'i-carbon-star')"
                    />
                  </view>
                  <text class="text-sm text-gray-600">{{ record.rating }}</text>
                </view>

                <view v-if="record.tags?.length" class="flex flex-wrap gap-2 mb-2">
                  <view
                    v-for="tag in record.tags"
                    :key="tag.name"
                    class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded"
                  >
                    {{ tag.name }}
                  </view>
                </view>

                <view v-if="record.content" class="text-sm text-gray-600 line-clamp-2 mb-1">
                  {{ record.content }}
                </view>

                <view class="text-xs text-gray-400">
                  {{ new Date(record.createdAt).toLocaleDateString() }}
                </view>
              </view>
            </view>
          </view>

          <view v-if="loading" class="text-center py-4 text-gray-500">
            加载中...
          </view>

          <view v-else-if="!hasMore && records.length > 0" class="text-center py-4 text-gray-400">
            没有更多了
          </view>
        </view>
      </scroll-view>
    </view>

    <view
      class="fixed right-4 bottom-20 w-14 h-14 bg-primary rounded-full center shadow-lg"
      @tap="goToNew"
    >
      <text class="i-carbon-add text-white text-2xl" />
    </view>
  </view>
</template>
