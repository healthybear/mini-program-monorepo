<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'
import { useTokenStore } from '@/store'

onLaunch(async (options) => {
  console.log('App.vue onLaunch', options)

  // 微信小程序自动登录
  // #ifdef MP-WEIXIN
  const tokenStore = useTokenStore()
  if (!tokenStore.updateNowTime().hasLogin) {
    try {
      console.log('检测到未登录，尝试微信自动登录...')
      await tokenStore.wxLogin()
      console.log('微信自动登录成功')
    }
    catch (error) {
      console.error('微信自动登录失败:', error)
    }
  }
  // #endif
})
onShow((options) => {
  console.log('App.vue onShow', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* 全局样式 */
</style>
