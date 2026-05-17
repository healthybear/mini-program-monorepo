<script lang="ts" setup>
import type { IconConfig } from '@/components/app-bar/types'
import type { RecordDetailPageOptions, UniSwiperChangeEvent } from '@/types/uni-app'
import AppBar from '@/components/app-bar/index.vue'
import { useRecordStore } from '@/store'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '探店记录详情',
  },
})

// 常量定义
const TOAST_DURATION = 1500 // Toast 提示持续时间（毫秒）

const recordStore = useRecordStore()

// 记录ID（从路由参数获取）
const recordId = ref<string>('')

// 加载状态
const loading = ref(false)

// 记录数据
const recordData = computed(() => {
  const record = recordStore.currentRecord
  if (!record)
    return null

  return {
    id: record._id,
    images: record.images,
    restaurantName: record.restaurantName,
    foodNames: record.foodName || '',
    rating: record.rating,
    price: record.price?.toString() || '',
    tags: record.tags,
    notes: record.content || '',
    location: {
      name: record.restaurantName,
      address: record.restaurantAddress,
      latitude: record.location?.latitude || 0,
      longitude: record.location?.longitude || 0,
    },
    distance: 0,
    updatedAt: new Date(record.updatedAt).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
})

// 当前位置（用于计算距离和地图显示）
const currentLocation = reactive({
  latitude: 0,
  longitude: 0,
  hasPermission: false,
})

// 轮播当前索引
const currentImageIndex = ref(0)

// AppBar 右侧图标配置
const rightIcons: IconConfig[] = [
  {
    icon: 'share',
    onClick: handleShare,
  },
]

// 分享记录
function handleShare() {
  uni.showShareMenu({
    withShareTicket: true,
    success: () => {
      uni.showToast({
        title: '分享成功',
        icon: 'success',
      })
    },
    fail: () => {
      uni.showToast({
        title: '分享失败',
        icon: 'none',
      })
    },
  })
}

// 轮播变化
function handleSwiperChange(e: UniSwiperChangeEvent) {
  currentImageIndex.value = e.detail.current
}

// 预览图片
function handlePreviewImage(index: number) {
  if (!recordData.value)
    return
  uni.previewImage({
    current: index,
    urls: recordData.value.images,
  })
}

// 导航到餐厅
function handleNavigate() {
  if (!recordData.value)
    return
  uni.openLocation({
    latitude: recordData.value.location.latitude,
    longitude: recordData.value.location.longitude,
    name: recordData.value.location.name,
    address: recordData.value.location.address,
    scale: 15,
  })
}

// 编辑记录
function handleEdit() {
  if (!recordData.value)
    return
  uni.navigateTo({
    url: `/pages/record/edit?id=${recordData.value.id}`,
  })
}

// 删除记录
async function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '删除后将无法恢复，确定要删除这条记录吗？',
    confirmText: '删除',
    confirmColor: '#ee0a24',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '删除中...' })
          await recordStore.removeRecord(recordId.value)
          uni.hideLoading()
          uni.showToast({
            title: '删除成功',
            icon: 'success',
            duration: TOAST_DURATION,
          })
          setTimeout(() => {
            uni.navigateBack()
          }, TOAST_DURATION)
        }
        catch (error) {
          uni.hideLoading()
          uni.showToast({
            title: '删除失败',
            icon: 'error',
          })
        }
      }
    },
  })
}

// 页面加载时获取记录详情
onLoad(async (options: RecordDetailPageOptions) => {
  if (options?.id) {
    recordId.value = options.id
    loading.value = true
    try {
      await recordStore.fetchRecordDetail(recordId.value)
    }
    catch (error) {
      uni.showToast({
        title: '加载失败',
        icon: 'error',
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
    finally {
      loading.value = false
    }
  }
})

// 获取当前位置
onMounted(() => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      currentLocation.latitude = res.latitude
      currentLocation.longitude = res.longitude
      currentLocation.hasPermission = true
    },
    fail: () => {
      currentLocation.hasPermission = false
    },
  })
})
</script>

<template>
  <view class="page-container">
    <AppBar title="探店记录" :show-back-icon="true" :right-icons="rightIcons" fixed />

    <view class="content-container">
      <!-- 1. 图片轮播 -->
      <view v-if="recordData && recordData.images.length > 0" class="image-section">
        <swiper
          class="image-swiper"
          :indicator-dots="true"
          :autoplay="false"
          :circular="true"
          indicator-color="rgba(255, 255, 255, 0.5)"
          indicator-active-color="#ffffff"
          @change="handleSwiperChange"
        >
          <swiper-item
            v-for="(image, index) in recordData?.images"
            :key="index"
            @click="handlePreviewImage(index)"
          >
            <image :src="image" mode="aspectFill" class="swiper-image" />
          </swiper-item>
        </swiper>
        <view class="image-counter">
          {{ currentImageIndex + 1 }} / {{ recordData?.images.length }}
        </view>
      </view>

      <!-- 2. 餐厅信息卡片 -->
      <view v-if="recordData" class="info-card">
        <view class="restaurant-name">
          {{ recordData.restaurantName }}
        </view>

        <!-- 评分和距离 -->
        <view class="rating-distance-row">
          <view class="rating-display">
            <view class="i-carbon-star-filled icon-star" />
            <text class="rating-text">{{ recordData.rating }}</text>
          </view>
          <view v-if="currentLocation.hasPermission && recordData.distance" class="distance-display">
            <view class="i-carbon-location icon-location-small" />
            <text class="distance-text">{{ recordData.distance }}km</text>
          </view>
        </view>

        <!-- 标签 -->
        <view class="tags-scroll-container">
          <scroll-view scroll-y class="tags-scroll">
            <view class="tags-wrapper">
              <view
                v-for="tag in recordData.tags"
                :key="tag"
                class="tag-item-display"
              >
                {{ tag }}
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 3. 个人评价卡片 -->
      <view v-if="recordData" class="review-card">
        <view class="card-title">
          个人评价
        </view>
        <view class="review-content">
          {{ recordData.notes }}
        </view>
        <view class="review-footer">
          <view class="i-carbon-time icon-time" />
          <text class="update-time">最后编辑：{{ recordData.updatedAt }}</text>
        </view>
      </view>

      <!-- 4. 地图卡片 -->
      <view v-if="recordData" class="map-card-detail">
        <view class="map-header-detail">
          <view class="location-info">
            <view class="location-name">
              {{ recordData.location.name }}
            </view>
            <view class="location-address">
              {{ recordData.location.address }}
            </view>
          </view>
          <view class="nav-button" @click="handleNavigate">
            <view class="i-carbon-navigation icon-nav" />
            <text class="nav-text">导航</text>
          </view>
        </view>
        <map
          class="map-view-detail"
          :latitude="recordData.location.latitude"
          :longitude="recordData.location.longitude"
          :markers="[
            {
              id: 1,
              latitude: recordData.location.latitude,
              longitude: recordData.location.longitude,
              iconPath: '',
              width: 30,
              height: 30,
            },
            ...(currentLocation.hasPermission ? [{
              id: 2,
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              iconPath: '',
              width: 20,
              height: 20,
            }] : []),
          ]"
          :show-location="currentLocation.hasPermission"
        />
      </view>

      <!-- 5. 操作按钮 -->
      <view class="action-buttons">
        <wd-button class="action-btn" size="large" @click="handleEdit">
          <view class="btn-content">
            <view class="i-carbon-edit icon-btn" />
            <text>编辑记录</text>
          </view>
        </wd-button>
        <wd-button class="action-btn" size="large" type="error" @click="handleDelete">
          <view class="btn-content">
            <view class="i-carbon-trash-can icon-btn" />
            <text>删除记录</text>
          </view>
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.content-container {
  padding-top: 112rpx; // AppBar height
}

// 1. 图片轮播
.image-section {
  position: relative;
  width: 100%;
  height: 500rpx;
  background: #000;

  .image-swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-image {
    width: 100%;
    height: 100%;
  }

  .image-counter {
    position: absolute;
    bottom: 24rpx;
    right: 24rpx;
    padding: 8rpx 16rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 24rpx;
    font-size: 24rpx;
    color: #ffffff;
  }
}

// 2. 餐厅信息卡片
.info-card {
  background: #ffffff;
  padding: 32rpx 24rpx;
  margin: 24rpx 24rpx 0;
  border-radius: 16rpx;

  .restaurant-name {
    font-size: 36rpx;
    font-weight: 600;
    color: #323233;
    margin-bottom: 16rpx;
  }

  .rating-distance-row {
    display: flex;
    align-items: center;
    gap: 32rpx;
    margin-bottom: 24rpx;

    .rating-display {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .icon-star {
        width: 32rpx;
        height: 32rpx;
        color: #ffd21e;
      }

      .rating-text {
        font-size: 28rpx;
        font-weight: 500;
        color: #323233;
      }
    }

    .distance-display {
      display: flex;
      align-items: center;
      gap: 4rpx;

      .icon-location-small {
        width: 28rpx;
        height: 28rpx;
        color: #969799;
      }

      .distance-text {
        font-size: 26rpx;
        color: #646566;
      }
    }
  }

  .tags-scroll-container {
    max-height: 160rpx; // 2 rows max
    overflow: hidden;

    .tags-scroll {
      max-height: 160rpx;
    }

    .tags-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;

      .tag-item-display {
        padding: 12rpx 24rpx;
        background: #f7f8fa;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #646566;
      }
    }
  }
}

// 3. 个人评价卡片
.review-card {
  background: #ffffff;
  padding: 24rpx;
  margin: 24rpx;
  border-radius: 16rpx;

  .card-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #323233;
    margin-bottom: 16rpx;
  }

  .review-content {
    font-size: 28rpx;
    line-height: 1.6;
    color: #646566;
    margin-bottom: 16rpx;
  }

  .review-footer {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #ebedf0;

    .icon-time {
      width: 28rpx;
      height: 28rpx;
      color: #969799;
    }

    .update-time {
      font-size: 24rpx;
      color: #969799;
    }
  }
}

// 4. 地图卡片
.map-card-detail {
  background: #ffffff;
  margin: 0 24rpx 24rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .map-header-detail {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 24rpx;
    background: #fafbfc;

    .location-info {
      flex: 1;
      min-width: 0;

      .location-name {
        font-size: 28rpx;
        font-weight: 500;
        color: #323233;
        margin-bottom: 8rpx;
      }

      .location-address {
        font-size: 24rpx;
        color: #646566;
        line-height: 1.5;
      }
    }

    .nav-button {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4rpx;
      padding: 8rpx 16rpx;
      background: #0957de;
      border-radius: 8rpx;
      cursor: pointer;
      margin-left: 16rpx;

      .icon-nav {
        width: 32rpx;
        height: 32rpx;
        color: #ffffff;
      }

      .nav-text {
        font-size: 22rpx;
        color: #ffffff;
      }
    }
  }

  .map-view-detail {
    width: 100%;
    height: 400rpx;
  }
}

// 5. 操作按钮
.action-buttons {
  display: flex;
  gap: 24rpx;
  padding: 0 24rpx 48rpx;

  .action-btn {
    flex: 1;

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;

      .icon-btn {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
}
</style>
