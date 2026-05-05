/**
 * SearchBar Component Type Definitions
 */

/**
 * SearchBar 组件 Props 接口
 */
export interface SearchBarProps {
  /** v-model 绑定值 */
  modelValue?: string
  /** 占位符文本（默认：'搜索...'） */
  placeholder?: string
  /** 禁用状态（默认：false） */
  disabled?: boolean
  /** 只读状态（默认：false） */
  readonly?: boolean
  /** 是否显示清空按钮（默认：true） */
  clearable?: boolean
  /** 右侧图标（Carbon 图标名） */
  rightIcon?: string
  /** 右侧图标点击回调 */
  rightIconClick?: () => void
  /** 背景颜色（默认：#f5f5f5） */
  backgroundColor?: string
}

/**
 * SearchBar 组件事件接口
 */
export interface SearchBarEmits {
  /** v-model 更新事件 */
  (e: 'update:modelValue', value: string): void
  /** 聚焦事件 */
  (e: 'focus', event: any): void
  /** 失焦事件 */
  (e: 'blur', event: any): void
  /** 搜索确认事件（键盘搜索按钮） */
  (e: 'search', value: string): void
  /** 清空事件 */
  (e: 'clear'): void
  /** 右侧图标点击事件 */
  (e: 'right-icon-click'): void
}
