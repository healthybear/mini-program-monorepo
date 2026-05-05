<script lang="ts" setup>
import AppBar from '@/components/app-bar/index.vue'
import { useRecordStore } from '@/store/record'
import type { ICreateExploreRecordDto, IExploreTag } from '@/api/types/record'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '新建探店记录',
  },
})

const recordStore = useRecordStore()

// 表单数据
const formData = reactive({
  images: [] as string[],
  restaurantName: '',
  foodNames: '',
  rating: 0,
  price: '',
  tags: [] as string[],
  notes: '',
  location: {
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
  },
})

// 预设标签
const presetTags = ref([
  '环境好',
  '服务好',
  '性价比高',
  '味道好',
  '分量足',
  '停车方便',
  '适合聚会',
  '适合约会',
  '网红店',
  '老字号',
])

// 显示添加标签弹窗
const showAddTag = ref(false)
const newTagName = ref('')

// 地图相关
const showMap = ref(false)

// 选择图片
const handleChooseImage = () => {
  uni.chooseImage({
    count: 6 - formData.images.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.images.push(...res.tempFilePaths)
    },
  })
}

// 删除图片
const handleDeleteImage = (index: number) => {
  formData.images.splice(index, 1)
}

// 预览图片
const handlePreviewImage = (index: number) => {
  uni.previewImage({
    current: index,
    urls: formData.images,
  })
}

// 评分变化
const handleRatingChange = (e: any) => {
  formData.rating = e.detail.value
}

// 切换标签选择
const toggleTag = (tag: string) => {
  const index = formData.tags.indexOf(tag)
  if (index > -1) {
    formData.tags.splice(index, 1)
  }
  else {
    formData.tags.push(tag)
  }
}

// 添加自定义标签
const handleAddCustomTag = () => {
  if (!newTagName.value.trim()) {
    uni.showToast({
      title: '请输入标签名称',
      icon: 'none',
    })
    return
  }

  if (presetTags.value.includes(newTagName.value.trim())) {
    uni.showToast({
      title: '标签已存在',
      icon: 'none',
    })
    return
  }

  presetTags.value.push(newTagName.value.trim())
  formData.tags.push(newTagName.value.trim())
  newTagName.value = ''
  showAddTag.value = false

  uni.showToast({
    title: '标签添加成功',
    icon: 'success',
  })
}

// 选择位置
const handleChooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      formData.location = {
        name: res.name,
        address: res.address,
        latitude: res.latitude,
        longitude: res.longitude,
      }
      showMap.value = true

      // 询问是否使用位置名称作为餐厅名称
      if (!formData.restaurantName && res.name) {
        uni.showModal({
          title: '提示',
          content: `是否使用"${res.name}"作为餐厅名称？`,
          success: (modalRes) => {
            if (modalRes.confirm) {
              formData.restaurantName = res.name
            }
          },
        })
      }
    },
  })
}

// 地图标记点击
const handleMarkerTap = () => {
  // 可以在这里处理标记点击事件
}

// 提交表单
const handleSubmit = async () => {
  // 验证必填项
  if (formData.images.length === 0) {
    uni.showToast({
      title: '请至少上传一张照片',
      icon: 'none',
    })
    return
  }

  if (!formData.restaurantName) {
    uni.showToast({
      title: '请输入餐厅名称',
      icon: 'none',
    })
    return
  }

  if (!formData.foodNames) {
    uni.showToast({
      title: '请输入食物名称',
      icon: 'none',
    })
    return
  }

  if (formData.rating === 0) {
    uni.showToast({
      title: '请选择评分',
      icon: 'none',
    })
    return
  }

  // 显示加载提示
  uni.showLoading({
    title: '保存中...',
    mask: true,
  })

  try {
    // 构建创建记录的数据
    const tags: IExploreTag[] = formData.tags.map(name => ({
      name,
      count: 1,
    }))

    const createData: ICreateExploreRecordDto = {
      restaurantId: `temp-${Date.now()}`,
      restaurantName: formData.restaurantName,
      restaurantAddress: formData.location?.address || '未知地址',
      foodName: formData.foodNames,
      rating: formData.rating,
      images: formData.images,
      tags,
      content: formData.notes || undefined,
      price: formData.price ? Number(formData.price) : undefined,
      location: formData.location.name ? {
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        address: formData.location.address,
      } : undefined,
    }

    // 调用 store 创建记录
    await recordStore.addRecord(createData)

    uni.hideLoading()
    uni.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      },
    })
  }
  catch (error) {
    uni.hideLoading()
    console.error('保存失败:', error)
    uni.showToast({
      title: '保存失败，请重试',
      icon: 'none',
      duration: 2000,
    })
  }
}
</script>

<template>
  <view class="page-container">
    <AppBar title="新建探店记录" :show-back-icon="true" fixed "/>

    <view class="form-container">
      <!-- 1. 照片 -->
      <view class="form-item">
        <view class="form-label required">
          照片
        </view>
        <view class="form-desc">
          最多上传6张照片
        </view>
        <view class="image-grid">
          <view
            v-for="(image, index) in formData.images"
            :key="index"
            class="image-item"
            @click="handlePreviewImage(index)"
          >
            <image :src="image" mode="aspectFill" class="image" />
            <view class="image-delete" @click.stop="handleDeleteImage(index)">
              <view class="i-carbon-close icon-close" />
            </view>
          </view>
          <view
            v-if="formData.images.length < 6"
            class="image-item image-add"
            @click="handleChooseImage"
          >
            <view class="i-carbon-camera icon-camera" />
            <text class="add-text">拍照/选择</text>
          </view>
        </view>
      </view>

      <!-- 2. 餐厅名称 -->
      <view class="form-item">
        <view class="form-label required">
          餐厅名称
        </view>
        <wd-input
          v-model="formData.restaurantName"
          placeholder="请输入餐厅名称"
          clearable
        />
      </view>

      <!-- 3. 食物名称 -->
      <view class="form-item">
        <view class="form-label required">
          食物名称
        </view>
        <view class="form-desc">
          可输入多个食物名称，用逗号或空格分隔
        </view>
        <wd-textarea
          v-model="formData.foodNames"
          placeholder="例如：宫保鸡丁、麻婆豆腐、水煮鱼"
          :maxlength="200"
          show-word-limit
          :rows="3"
        />
      </view>

      <!-- 4. 评分与价格 -->
      <view class="form-item">
        <view class="rating-price-row">
          <!-- 评分 -->
          <view class="rating-col">
            <view class="form-label required">
              评分
            </view>
            <wd-rate v-model="formData.rating" size="24" />
          </view>

          <!-- 价格 -->
          <view class="price-col">
            <view class="form-label">
              人均消费
            </view>
            <wd-input
              v-model="formData.price"
              type="number"
              placeholder="金额"
              clearable
            >
              <template #suffix>
                <text class="price-unit">元</text>
              </template>
            </wd-input>
          </view>
        </view>
      </view>

      <!-- 5. 标签 -->
      <view class="form-item">
        <view class="form-label-row">
          <view class="form-label">
            标签
          </view>
          <view class="add-tag-btn" @click="showAddTag = true">
            <view class="i-carbon-add icon-add-small" />
            <text>添加标签</text>
          </view>
        </view>
        <view class="tags-container">
          <view
            v-for="tag in presetTags"
            :key="tag"
            class="tag-item"
            :class="{ 'tag-active': formData.tags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>

      <!-- 6. 评价 -->
      <view class="form-item">
        <view class="form-label">
          评价
        </view>
        <wd-textarea
          v-model="formData.notes"
          placeholder="分享你的探店体验..."
          :maxlength="500"
          show-word-limit
          :rows="5"
        />
      </view>

      <!-- 7. 地理位置 -->
      <view class="form-item">
        <view class="form-label">
          地理位置
        </view>

        <!-- 未定位状态 - 显示占位卡片 -->
        <view v-if="!showMap" class="location-placeholder-card" @click="handleChooseLocation">
          <view class="i-carbon-location icon-location-large" />
          <text class="placeholder-text">点击选择位置</text>
          <text class="placeholder-hint">获取餐厅地理位置信息</text>
        </view>

        <!-- 已定位状态 - 显示地图卡片 -->
        <view v-else class="map-card">
          <view class="map-info">
            <view class="map-header">
              <view class="map-name">
                {{ formData.location.name || '已选位置' }}
              </view>
              <view class="map-reselect" @click="handleChooseLocation">
                <view class="i-carbon-renew icon-renew" />
                <text>重新选择</text>
              </view>
            </view>
            <view class="map-address">
              {{ formData.location.address }}
            </view>
            <view class="map-coords">
              经度: {{ formData.location.longitude.toFixed(6) }} | 纬度: {{ formData.location.latitude.toFixed(6) }}
            </view>
          </view>
          <map
            class="map-view"
            :latitude="formData.location.latitude"
            :longitude="formData.location.longitude"
            :markers="[{
              id: 1,
              latitude: formData.location.latitude,
              longitude: formData.location.longitude,
              iconPath: '',
              width: 30,
              height: 30,
            }]"
            :show-location="true"
            @markertap="handleMarkerTap"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-container">
        <wd-button type="primary" size="large" block @click="handleSubmit">
          保存记录
        </wd-button>
      </view>
    </view>

    <!-- 添加标签弹窗 -->
    <wd-popup v-model="showAddTag" position="bottom" :safe-area-inset-bottom="true">
      <view class="add-tag-popup">
        <view class="popup-header">
          <text class="popup-title">添加自定义标签</text>
          <view class="popup-close" @click="showAddTag = false">
            <view class="i-carbon-close" />
          </view>
        </view>
        <view class="popup-content">
          <wd-input
            v-model="newTagName"
            placeholder="请输入标签名称"
            clearable
            maxlength="10"
          />
        </view>
        <view class="popup-footer">
          <wd-button type="primary" size="large" block @click="handleAddCustomTag">
            确定
          </wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background: #f7f8fa;
}

.form-container {
  padding: 24rpx;
}

.form-item {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;

  .form-label {
    font-size: 28rpx;
    font-weight: 500;
    color: #323233;
    margin-bottom: 16rpx;

    &.required::before {
      content: '*';
      color: #ee0a24;
      margin-right: 4rpx;
    }
  }

  .form-desc {
    font-size: 24rpx;
    color: #969799;
    margin-bottom: 16rpx;
  }

  .form-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .add-tag-btn {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #0957de;
      cursor: pointer;

      .icon-add-small {
        width: 28rpx;
        height: 28rpx;
        margin-right: 4rpx;
      }
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;

    .image-item {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
      background: #f7f8fa;
      border-radius: 12rpx;
      overflow: hidden;

      .image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .image-delete {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 40rpx;
        height: 40rpx;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-close {
          width: 24rpx;
          height: 24rpx;
          color: #ffffff;
        }
      }

      &.image-add {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-bottom: 0;
        height: 200rpx;
        border: 2rpx dashed #dcdee0;
        background: #fafafa;
        cursor: pointer;

        .icon-camera {
          width: 48rpx;
          height: 48rpx;
          color: #c8c9cc;
          margin-bottom: 8rpx;
        }

        .add-text {
          font-size: 24rpx;
          color: #969799;
        }
      }
    }
  }

  .rating-price-row {
    display: flex;
    gap: 24rpx;

    .rating-col,
    .price-col {
      flex: 1;
    }
  }

  .price-unit {
    font-size: 28rpx;
    color: #969799;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .tag-item {
      padding: 12rpx 24rpx;
      background: #f7f8fa;
      border-radius: 8rpx;
      font-size: 26rpx;
      color: #646566;
      cursor: pointer;
      transition: all 0.3s;

      &.tag-active {
        background: #e8f3ff;
        color: #0957de;
        border: 1rpx solid #0957de;
      }
    }
  }

  .location-placeholder-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300rpx;
    background: #fafbfc;
    border: 2rpx dashed #dcdee0;
    border-radius: 12rpx;
    cursor: pointer;
    transition: all 0.3s;

    &:active {
      background: #f7f8fa;
    }

    .icon-location-large {
      width: 80rpx;
      height: 80rpx;
      color: #c8c9cc;
      margin-bottom: 16rpx;
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

  .map-card {
    border-radius: 12rpx;
    overflow: hidden;
    border: 1rpx solid #ebedf0;

    .map-info {
      padding: 16rpx;
      background: #fafbfc;

      .map-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8rpx;

        .map-name {
          flex: 1;
          font-size: 28rpx;
          font-weight: 500;
          color: #323233;
        }

        .map-reselect {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #0957de;
          cursor: pointer;

          .icon-renew {
            width: 28rpx;
            height: 28rpx;
            margin-right: 4rpx;
          }
        }
      }

      .map-address {
        font-size: 24rpx;
        color: #646566;
        margin-bottom: 8rpx;
      }

      .map-coords {
        font-size: 22rpx;
        color: #969799;
      }
    }

    .map-view {
      width: 100%;
      height: 400rpx;
    }
  }
}

.submit-container {
  margin-top: 48rpx;
  padding: 0 24rpx 48rpx;
}

.add-tag-popup {
  padding: 32rpx;

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;

    .popup-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #323233;
    }

    .popup-close {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .popup-content {
    margin-bottom: 32rpx;
  }
}
</style>
