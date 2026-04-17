import { t } from '@/locale'
import { isCurrentPageTabbar } from '@/utils'
import { isNativeTabbar, tabbarList } from '@/config/tab-bar'

export function getI18nText(key: string) {
  const match = key.match(/%(.+?)%/)
  if (match) {
    key = match[1]
  }
  console.log('设置多语言：', key)
  return t(key)
}

export function setTabbarItem() {
  console.log('设置多语言：setTabBarItem', isNativeTabbar, isCurrentPageTabbar())
  if (isNativeTabbar && isCurrentPageTabbar()) {
    tabbarList.forEach((item, index) => {
      uni.setTabBarItem({
        index,
        text: getI18nText(item.text),
      })
    })
  }
}
