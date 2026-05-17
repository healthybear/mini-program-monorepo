<script lang="ts" setup>
import type { AmapPOI } from '../types'
import { getCurrentLocation, parseLocation, searchPOI } from '../api'

export interface LocationPickerProps {
  /** 是否显示选择器 */
  modelValue: boolean
  /** 默认位置（可选） */
  defaultLocation?: {
    longitude: number
    latitude: number
    address?: string
  }
}

export interface LocationPickerEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', location: {
    name: string
    address: string
    latitude: number
    longitude: number
  }): void
}

const props = defineProps<LocationPickerProps>()
const emit = defineEmits<LocationPickerEmits>()

// 搜索关键词
const searchKeyword = ref('')

// 搜索结果列表
const searchResults = ref<AmapPOI[]>([])

// 搜索加载状态
const searching = ref(false)

// 当前选中的位置
const selectedLocation = ref<{
  name: string
  address: string
  latitude: number
  longitude: number
} | null>(null)

// 地图中心点
const mapCenter = ref({
  latitude: props.defaultLocation?.latitude || 39.90923,
  longitude: props.defaultLocation?.longitude || 116.397428,
})

// 地图标记点
const markers = computed(() => {
  if (!selectedLocation.value)
    return []

  return [{
    id: 1,
    latitude: selectedLocation.value.latitude,
    longitude: selectedLocation.value.longitude,
    iconPath: '',
    width: 30,
    height: 30,
  }]
})

// 显示状态
const show = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

// 搜索 POI
async function handleSearch() {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none',
    })
    return
  }

  searching.value = true
  try {
    const result = await searchPOI({
      keywords: searchKeyword.value,
      city: '全国',
      offset: 20,
    })

    searchResults.value = result.pois
    if (result.pois.length === 0) {
      uni.showToast({
        title: '未找到相关地点',
        icon: 'none',
      })
    }
  }
  catch (error: any) {
    console.error('搜索失败:', error)
    uni.showToast({
      title: error.message || '搜索失败',
      icon: 'none',
    })
  }
  finally {
    searching.value = false
  }
}

// 选择搜索结果
function handleSelectPOI(poi: AmapPOI) {
  const { longitude, latitude } = parseLocation(poi.location)

  selectedLocation.value = {
    name: poi.name,
    address: poi.address,
    latitude,
    longitude,
  }

  // 更新地图中心点
  mapCenter.value = { latitude, longitude }

  // 清空搜索结果
  searchResults.value = []
  searchKeyword.value = ''
}

// 地图点击事件
function handleMapTap(e: any) {
  const { latitude, longitude } = e.detail

  selectedLocation.value = {
    name: '选中位置',
    address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    latitude,
    longitude,
  }

  mapCenter.value = { latitude, longitude }
}

// 获取当前位置
async function handleGetCurrentLocation() {
  uni.showLoading({ title: '定位中...' })
  try {
    const location = await getCurrentLocation()

    selectedLocation.value = {
      name: '当前位置',
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    }

    mapCenter.value = {
      latitude: location.latitude,
      longitude: location.longitude,
    }

    uni.hideLoading()
    uni.showToast({
      title: '定位成功',
      icon: 'success',
    })
  }
  catch (error: any) {
    uni.hideLoading()
    console.error('定位失败:', error)

    // 检查是否是 H5 HTTPS 错误
    const isHttpsError = error.message?.includes('HTTPS') || error.message?.includes('secure origins')

    uni.showModal({
      title: '定位失败',
      content: isHttpsError
        ? 'H5 环境需要 HTTPS 协议才能使用定位功能，请使用搜索功能选择位置'
        : error.message || '定位失败，请使用搜索功能选择位置',
      showCancel: false,
      confirmText: '知道了',
    })
  }
}

// 确认选择
function handleConfirm() {
  if (!selectedLocation.value) {
    uni.showToast({
      title: '请选择位置',
      icon: 'none',
    })
    return
  }

  emit('confirm', selectedLocation.value)
  show.value = false
}

// 取消选择
function handleCancel() {
  show.value = false
}

// 初始化
onMounted(() => {
  if (props.defaultLocation) {
    selectedLocation.value = {
      name: '默认位置',
      address: props.defaultLocation.address || '',
      latitude: props.defaultLocation.latitude,
      longitude: props.defaultLocation.longitude,
    }
  }
})
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :safe-area-inset-bottom="true"
    :close-on-click-modal="false"
  >
    <view class="location-picker">
      <!-- 头部 -->
      <view class="picker-header">
        <view class="header-title">选择位置</view>
        <view class="header-actions">
          <view class="action-btn" @click="handleCancel">
            取消
          </view>
          <view class="action-btn primary" @click="handleConfirm">
            确定
          </view>
        </view>
      </view>

      <!-- 搜索栏 -->
      <view class="search-bar">
        <wd-input
          v-model="searchKeyword"
          placeholder="搜索地点"
          clearable
          @confirm="handleSearch"
        >
          <template #suffix>
            <view class="search-btn" @click="handleSearch">
              <view class="i-carbon-search icon-search" />
            </view>
          </template>
        </wd-input>
        <view class="location-btn" @click="handleGetCurrentLocation">
          <view class="i-carbon-location icon-location" />
        </view>
      </view>

      <!-- 搜索结果列表 -->
      <view v-if="searchResults.length > 0" class="search-results">
        <scroll-view scroll-y class="results-scroll">
          <view
            v-for="poi in searchResults"
            :key="poi.id"
            class="result-item"
            @click="handleSelectPOI(poi)"
          >
            <view class="result-name">{{ poi.name }}</view>
            <view class="result-address">{{ poi.address }}</view>
          </view>
        </scroll-view>
      </view>

      <!-- 地图 -->
      <!-- #ifndef H5 -->
      <view class="map-container">
        <map
          class="map-view"
          :latitude="mapCenter.latitude"
          :longitude="mapCenter.longitude"
          :markers="markers"
          :show-location="true"
          @tap="handleMapTap"
        />
      </view>
      <!-- #endif -->

      <!-- H5 环境提示 -->
      <!-- #ifdef H5 -->
      <view class="map-placeholder">
        <view class="placeholder-icon">
          <view class="i-carbon-location icon-large" />
        </view>
        <view class="placeholder-text">H5 环境暂不支持地图选点</view>
        <view class="placeholder-hint">请使用搜索功能选择位置</view>
      </view>
      <!-- #endif -->

      <!-- 选中位置信息 -->
      <view v-if="selectedLocation" class="selected-info">
        <view class="info-name">{{ selectedLocation.name }}</view>
        <view class="info-address">{{ selectedLocation.address }}</view>
      </view>
    </view>
  </wd-popup>
</template>

<style scoped lang="scss">
.location-picker {
  display: flex;
  flex-direction: column;
  height: 80vh;
  background: #ffffff;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 1rpx solid #ebedf0;

  .header-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #323233;
  }

  .header-actions {
    display: flex;
    gap: 24rpx;

    .action-btn {
      font-size: 28rpx;
      color: #969799;
      cursor: pointer;

      &.primary {
        color: #0957de;
      }
    }
  }
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  border-bottom: 1rpx solid #ebedf0;

  .search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .icon-search {
      width: 36rpx;
      height: 36rpx;
      color: #969799;
    }
  }

  .location-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 64rpx;
    background: #f7f8fa;
    border-radius: 8rpx;
    cursor: pointer;

    .icon-location {
      width: 40rpx;
      height: 40rpx;
      color: #0957de;
    }
  }
}

.search-results {
  flex-shrink: 0;
  max-height: 400rpx;
  border-bottom: 1rpx solid #ebedf0;

  .results-scroll {
    height: 100%;
  }

  .result-item {
    padding: 24rpx;
    border-bottom: 1rpx solid #f7f8fa;
    cursor: pointer;

    &:active {
      background: #f7f8fa;
    }

    .result-name {
      font-size: 28rpx;
      font-weight: 500;
      color: #323233;
      margin-bottom: 8rpx;
    }

    .result-address {
      font-size: 24rpx;
      color: #969799;
    }
  }
}

.map-container {
  flex: 1;
  position: relative;

  .map-view {
    width: 100%;
    height: 100%;
  }
}

.selected-info {
  flex-shrink: 0;
  padding: 24rpx;
  background: #f7f8fa;
  border-top: 1rpx solid #ebedf0;

  .info-name {
    font-size: 28rpx;
    font-weight: 500;
    color: #323233;
    margin-bottom: 8rpx;
  }

  .info-address {
    font-size: 24rpx;
    color: #646566;
  }
}

.map-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;

  .placeholder-icon {
    margin-bottom: 16rpx;

    .icon-large {
      width: 96rpx;
      height: 96rpx;
      color: #c8c9cc;
    }
  }

  .placeholder-text {
    font-size: 28rpx;
    color: #646566;
    margin-bottom: 8rpx;
  }

  .placeholder-hint {
    font-size: 24rpx;
    color: #969799;
  }
}
</style>
