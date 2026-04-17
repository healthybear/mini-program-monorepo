<script setup lang="ts">
import { ref } from 'vue'
import { customTabbarEnable, needHideNativeTabbar, tabbarCacheEnable, tabbarUiTheme } from '@/config/tab-bar'
import { isPageTabbar, tabbarList, tabbarStore } from '@/store/tab-bar'
import { getI18nText, setTabbarItem } from '@/utils/tab-bar-i18n'
import { currRoute } from './utils'

const isCurrentPageTabbar = ref(true)
onShow(() => {
  console.log('App.ku.vue onShow', currRoute())
  const { path } = currRoute()
  // “蜡笔小开心”提到本地是 '/pages/index/index'，线上是 '/' 导致线上 tabbar 不见了
  // 所以这里需要判断一下，如果是 '/' 就当做首页，也要显示 tabbar
  if (path === '/') {
    isCurrentPageTabbar.value = true
  }
  else {
    isCurrentPageTabbar.value = isPageTabbar(path)
  }
  setTabbarItem()
})

const helloKuRoot = ref('Hello AppKuVue')

const exposeRef = ref('this is form app.Ku.vue')

function handleClickBulge() {
  uni.showToast({
    title: '点击了中间的鼓包tabbarItem',
    icon: 'none',
  })
}

function handleTabChange(index: number) {
  if (index === tabbarStore.curIdx) {
    return
  }
  const list = tabbarList.value
  if (!list[index]) {
    return
  }
  if (list[index].isBulge) {
    handleClickBulge()
    return
  }
  const url = list[index].pagePath
  tabbarStore.setCurIdx(index)
  if (tabbarCacheEnable) {
    uni.switchTab({ url })
  }
  else {
    uni.navigateTo({ url })
  }
}

// #ifndef MP-WEIXIN || MP-ALIPAY
onLoad(() => {
  needHideNativeTabbar
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      // console.log('hideTabBar success: ', res)
    },
  })
})
// #endif

// #ifdef MP-ALIPAY
onMounted(() => {
  customTabbarEnable
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      // console.log('hideTabBar success: ', res)
    },
  })
})
// #endif

defineExpose({
  exposeRef,
})
</script>

<template>
  <view>
    <!-- 这个先隐藏了，知道这样用就行 -->
    <view class="hidden text-center">
      {{ helloKuRoot }}，这里可以配置全局的东西
    </view>

    <KuRootView />

    <SharedTabbar
      v-if="isCurrentPageTabbar && customTabbarEnable"
      :items="tabbarList"
      :current-index="tabbarStore.curIdx"
      :theme="tabbarUiTheme"
      :resolve-text="getI18nText"
      @change="handleTabChange"
    />
  </view>
</template>
