<script lang="ts" setup>
export interface RecordCardProps {
  /** 记录ID */
  id: string
  /** 图片URL（显示第一张） */
  image?: string
  /** 餐厅名称 */
  restaurantName: string
  /** 评分 */
  rating: number
  /** 标签列表 */
  tags: string[]
  /** 评价内容 */
  notes: string
}

const props = defineProps<RecordCardProps>()

const emit = defineEmits<{
  click: [id: string]
}>()

// 处理卡片点击
function handleCardClick() {
  emit('click', props.id)
  uni.navigateTo({
    url: `/pages/record/detail?id=${props.id}`,
  })
}

// 显示的标签（最多显示2个）
const displayTags = computed(() => props.tags.slice(0, 2))
</script>

<template>
  <view class="record-card" @click="handleCardClick">
    <!-- 左侧图片 -->
    <view class="card-image-container">
      <image
        v-if="image"
        :src="image"
        mode="aspectFill"
        class="card-image"
      />
      <view v-else class="card-image-placeholder">
        <view class="i-carbon-restaurant icon-placeholder" />
      </view>
    </view>

    <!-- 右侧内容 -->
    <view class="card-content">
      <!-- 餐厅名称 -->
      <view class="restaurant-name text-ellipsis">
        {{ restaurantName }}
      </view>

      <!-- 评分与标签 -->
      <view class="rating-tags-row">
        <view class="rating-section">
          <view class="i-carbon-star-filled icon-star-small" />
          <text class="rating-value">{{ rating }}</text>
        </view>
        <view class="tags-section">
          <view
            v-for="tag in displayTags"
            :key="tag"
            class="tag-chip"
          >
            {{ tag }}
          </view>
        </view>
      </view>

      <!-- 评价 -->
      <view class="notes-text text-ellipsis-2">
        {{ notes }}
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.record-card {
  display: flex;
  background: #ffffff;
  border-radius: 12rpx;
  padding: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.12);
  }
}

.card-image-container {
  flex-shrink: 0;
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background: #f7f8fa;
  margin-right: 16rpx;

  .card-image {
    width: 100%;
    height: 100%;
  }

  .card-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f8fa;

    .icon-placeholder {
      width: 64rpx;
      height: 64rpx;
      color: #c8c9cc;
    }
  }
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0; // 允许 flex 子元素收缩
  padding: 4rpx 0;
}

.restaurant-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #323233;
  line-height: 1.4;
  margin-bottom: 8rpx;
}

.rating-tags-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;

  .rating-section {
    display: flex;
    align-items: center;
    gap: 4rpx;
    flex-shrink: 0;

    .icon-star-small {
      width: 28rpx;
      height: 28rpx;
      color: #ffd21e;
    }

    .rating-value {
      font-size: 24rpx;
      font-weight: 500;
      color: #323233;
    }
  }

  .tags-section {
    display: flex;
    align-items: center;
    gap: 8rpx;
    flex: 1;
    min-width: 0;
    overflow: hidden;

    .tag-chip {
      flex-shrink: 0;
      padding: 4rpx 12rpx;
      background: #f7f8fa;
      border-radius: 4rpx;
      font-size: 22rpx;
      color: #646566;
      white-space: nowrap;
    }
  }
}

.notes-text {
  font-size: 24rpx;
  line-height: 1.5;
  color: #969799;
}
</style>
