import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'
import type { SharedTabBarItem, SharedTabbarItemBadge } from '@repo/shared/components/tabbar'
import type { UserRole } from '@/api/types/login'
import type { RemoveLeadingSlashFromUnion } from '@/typings'

/**
 * 原生 tabbar 的单个选项配置
 */
export type NativeTabBarItem = TabBar['list'][number] & {
  pagePath: RemoveLeadingSlashFromUnion<_LocationUrl>
}

/** badge 显示一个数字或 小红点 */
export type CustomTabBarItemBadge = SharedTabbarItemBadge

/** 自定义 tabbar 的单个选项配置（在共享 Tabbar 项上增加路由与角色） */
export interface CustomTabBarItem extends Omit<SharedTabBarItem, 'pagePath'> {
  pagePath: RemoveLeadingSlashFromUnion<_LocationUrl>
  /** roles 不写 → 所有用户都能看到；roles 写了 → 只有匹配角色可见 */
  roles?: UserRole[]
}
