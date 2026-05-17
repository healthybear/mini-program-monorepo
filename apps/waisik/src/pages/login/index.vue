<script setup lang="ts">
import { reactive, ref, computed, onUnmounted } from 'vue'
import { useTokenStore } from '@/store/token'
import { sendVerificationCode } from '@/api/login'

definePage({
  style: {
    navigationBarTitleText: '登录',
    navigationBarBackgroundColor: '#ffffff',
  },
})

// 表单数据
const formData = reactive({
  phone: '',
  code: '',
  agreedToTerms: false,
})

// 状态管理
const countdown = ref(0)
const sending = ref(false)
const logging = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

// 重定向路径
const redirectPath = ref('')

// 获取重定向参数
onLoad((options: any) => {
  if (options?.redirect) {
    redirectPath.value = decodeURIComponent(options.redirect)
  }
})

// 手机号验证
const phoneError = computed(() => {
  if (!formData.phone) return ''
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    return '请输入正确的手机号'
  }
  return ''
})

// 发送验证码按钮文本
const sendCodeText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}秒后重试`
  }
  return '获取验证码'
})

// 发送验证码按钮是否禁用
const sendCodeDisabled = computed(() => {
  return !!phoneError.value || sending.value || countdown.value > 0
})

// 登录按钮是否禁用
const loginDisabled = computed(() => {
  return !formData.phone || !formData.code || !!phoneError.value || logging.value
})

// 发送验证码
async function handleSendCode() {
  if (sendCodeDisabled.value) return

  sending.value = true
  try {
    await sendVerificationCode(formData.phone, 'login')
    countdown.value = 60
    startCountdown()
    uni.showToast({ title: '验证码已发送', icon: 'success' })
  }
  catch (error) {
    console.error('发送验证码失败:', error)
    uni.showToast({ title: '发送失败，请重试', icon: 'none' })
  }
  finally {
    sending.value = false
  }
}

// 倒计时
function startCountdown() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
    }
  }, 1000)
}

// 登录
async function handleLogin() {
  // 表单验证
  if (phoneError.value) {
    uni.showToast({ title: phoneError.value, icon: 'none' })
    return
  }
  if (!formData.code || formData.code.length !== 6) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }
  if (!formData.agreedToTerms) {
    uni.showToast({ title: '请阅读并同意用户协议', icon: 'none' })
    return
  }

  logging.value = true
  uni.showLoading({ title: '登录中...', mask: true })

  try {
    const tokenStore = useTokenStore()
    await tokenStore.phoneLogin({
      phone: formData.phone,
      code: formData.code,
      projectName: import.meta.env.VITE_APP_TITLE || 'Waisik',
    })

    uni.hideLoading()

    // 登录成功后跳转
    setTimeout(() => {
      if (redirectPath.value) {
        // 有重定向路径，跳转到指定页面
        uni.reLaunch({ url: redirectPath.value })
      }
      else {
        // 没有重定向路径，返回上一页或跳转到首页
        const pages = getCurrentPages()
        if (pages.length > 1) {
          uni.navigateBack()
        }
        else {
          uni.reLaunch({ url: '/pages/index/index' })
        }
      }
    }, 500)
  }
  catch (error) {
    uni.hideLoading()
    console.error('登录失败:', error)
  }
  finally {
    logging.value = false
  }
}

// 清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <view class="login-page">
    <!-- Logo 区域 -->
    <view class="logo-section">
      <view class="logo-icon">📱</view>
      <view class="logo-title">欢迎使用 Waisik</view>
      <view class="logo-subtitle">手机号登录即可开始探店之旅</view>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <!-- 手机号输入 -->
      <view class="form-item">
        <wd-input
          v-model="formData.phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          clearable
          :error="!!phoneError"
          :error-message="phoneError"
        />
      </view>

      <!-- 验证码输入 -->
      <view class="form-item code-item">
        <wd-input
          v-model="formData.code"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
          clearable
        />
        <wd-button
          type="primary"
          size="small"
          :disabled="sendCodeDisabled"
          :loading="sending"
          @click="handleSendCode"
        >
          {{ sendCodeText }}
        </wd-button>
      </view>

      <!-- 用户协议 -->
      <view class="agreement-section">
        <wd-checkbox v-model="formData.agreedToTerms" />
        <text class="agreement-text">
          我已阅读并同意
          <text class="link">《用户协议》</text>
          和
          <text class="link">《隐私政策》</text>
        </text>
      </view>

      <!-- 登录按钮 -->
      <wd-button
        type="primary"
        size="large"
        block
        :disabled="loginDisabled"
        :loading="logging"
        @click="handleLogin"
      >
        登录
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  padding: 60rpx 40rpx;
}

.logo-section {
  text-align: center;
  margin-bottom: 80rpx;

  .logo-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
  }

  .logo-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .logo-subtitle {
    font-size: 28rpx;
    color: #999;
  }
}

.form-section {
  .form-item {
    margin-bottom: 32rpx;

    &.code-item {
      display: flex;
      gap: 16rpx;

      :deep(.wd-input) {
        flex: 1;
      }

      .wd-button {
        flex-shrink: 0;
        width: 200rpx;
      }
    }
  }

  .agreement-section {
    display: flex;
    align-items: center;
    margin-bottom: 48rpx;
    font-size: 24rpx;
    color: #666;

    .agreement-text {
      margin-left: 12rpx;

      .link {
        color: #0066ff;
      }
    }
  }
}
</style>
