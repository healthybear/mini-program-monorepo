<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import AppBar from '@/components/app-bar/index.vue'
import SearchBar from '@/components/search-bar/index.vue'
import { useRecordStore } from '@/store'
import Empty from './components/empty.vue'

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

const recordStore = useRecordStore()
const { records, loading, hasMore } = storeToRefs(recordStore)

const refreshing = ref(false)

onLoad(async () => {
  try {
    await recordStore.fetchRecords(true)
  }
  catch (error) {
    console.error('首页加载数据失败:', error)
    // HTTP 拦截器会自动处理 401 错误并跳转到登录页
  }
})

async function onRefresh() {
  refreshing.value = true
  try {
    await recordStore.fetchRecords(true)
  }
  finally {
    refreshing.value = false
  }
}

async function onLoadMore() {
  if (!loading.value && hasMore.value) {
    await recordStore.fetchRecords(false)
  }
}

function goToDetail(id: string) {
  uni.navigateTo({
    url: `/pages/record/detail?id=${id}`,
  })
}

function goToNew() {
  uni.navigateTo({
    url: '/pages/record/new',
  })
}
</script>

<template>
  <view class="wh-full flex-col bg-gray-50">
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
        <view v-if="records.length === 0 && !loading" class="wh-full center">
          <Empty />
        </view>

        <view v-else class="p-4 space-y-3">
          <view class="border-t border-gray-100 bg-white p-4">
            <SearchBar />
          </view>
          <view
            v-for="record in records"
            :key="record.id"
            class="rounded-2 bg-white p-3 shadow-sm"
            @tap="goToDetail(record.id)"
          >
            <view class="flex items-start gap-3">
              <image
                v-if="record.images?.[0]"
                :src="record.images[0]"
                class="h-20 w-20 flex-shrink-0 rounded-2"
                mode="aspectFill"
              />

              <view class="min-w-0 flex-1">
                <view class="mb-1 text-base text-gray-900 font-medium">
                  {{ record.restaurantName }}
                </view>

                <view class="mb-2 flex items-center gap-2">
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

                <view v-if="record.tags?.length" class="mb-2 flex flex-wrap gap-2">
                  <view
                    v-for="tag in record.tags"
                    :key="tag.name"
                    class="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
                  >
                    {{ tag.name }}
                  </view>
                </view>

                <view v-if="record.content" class="line-clamp-2 mb-1 text-sm text-gray-600">
                  {{ record.content }}
                </view>

                <view class="text-xs text-gray-400">
                  {{ new Date(record.createdAt).toLocaleDateString() }}
                </view>
              </view>
            </view>
          </view>

          <view v-if="loading" class="py-4 text-center text-gray-500">
            加载中...
          </view>

          <view v-else-if="!hasMore && records.length > 0" class="py-4 text-center text-gray-400">
            没有更多了
          </view>
        </view>
      </scroll-view>
    </view>

    <view
      class="fixed bottom-20 right-4 h-14 w-14 center rounded-full bg-primary shadow-lg"
      @tap="goToNew"
    >
      <text class="i-carbon-add text-2xl text-white" />
    </view>
  </view>
</template>
