# SearchBar Component Design Specification

**Date:** 2026-05-05  
**Component:** Material Design Search Bar  
**Location:** `apps/waisik/src/components/search-bar/`

## Overview

A Material Design inspired search bar component for the Waisik mini-program. The component provides a flexible, reusable search input with support for clear button, right-side icons or custom content, and comprehensive interaction states.

## Requirements

### Functional Requirements

1. Display a fixed search icon on the left
2. Provide an input field with placeholder text
3. Support v-model two-way binding
4. Show clear button when input has content (inside input area)
5. Support right-side icon or custom slot content
6. Show divider between input area and right content when needed
7. Emit focus, blur, search, and clear events
8. Support disabled and readonly states
9. Configurable background color

### Non-Functional Requirements

1. Follow Material Design principles
2. Use project design tokens for consistency
3. TypeScript type safety
4. Cross-platform compatibility (H5, WeChat, Alipay mini-programs)
5. Consistent with existing AppBar component design patterns

## Design Decisions

### Visual Design

**Dimensions:**

- Height: 96rpx (48dp - Material Design standard)
- Border radius: 16rpx (design-tokens.borderRadius.card)
- Horizontal padding: 24rpx
- Icon size: 48rpx × 48rpx (24dp)
- Clear button size: 40rpx × 40rpx

**Colors:**

- Background: `#f5f5f5` (configurable, default light grey)
- Search icon: `#646566` (design-tokens.colors.textSecondary)
- Input text: `#323233` (design-tokens.colors.textPrimary)
- Placeholder: `#c8c9cc` (design-tokens.colors.textPlaceholder)
- Clear button background: `#d0d0d0`
- Clear button icon: `#ffffff`
- Divider: `#ebedf0` (design-tokens.colors.borderLight)
- Disabled opacity: 0.3

**Shadow:**

- Box shadow: `0 2rpx 4rpx rgba(0, 0, 0, 0.08)` (design-tokens.boxShadow.sm)

**Typography:**

- Input font size: 28rpx (design-tokens.fontSize.base)
- Placeholder font size: 28rpx

**Icons:**

- Icon set: @iconify/carbon (via UnoCSS)
- Search icon: `i-carbon-search`
- Clear icon: `i-carbon-close` (inside circular background)

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  [🔍]  [  输入框内容...  ] [×]  │  [图标] │  96rpx
└─────────────────────────────────────────────────────────┘
   24rpx  16rpx   flex-1      (动态)  分割线  24rpx
```

**Five-section layout:**

1. **Left icon area:** Fixed search icon (48rpx × 48rpx), left padding 24rpx
2. **Input area:** Flex-grow: 1, left/right margin 16rpx
3. **Clear button:** 40rpx × 40rpx circular, shown only when has content
4. **Divider:** 1px × 40rpx, shown only when right area has content
5. **Right area:** Icon or slot content, right padding 24rpx

### Component API

**Props Interface:**

```typescript
interface SearchBarProps {
  // Input related
  modelValue?: string; // v-model binding value
  placeholder?: string; // Placeholder text (default: '搜索...')
  disabled?: boolean; // Disabled state (default: false)
  readonly?: boolean; // Readonly state (default: false)
  clearable?: boolean; // Show clear button (default: true)

  // Right area
  rightIcon?: string; // Right icon (Carbon icon name)
  rightIconClick?: () => void; // Right icon click callback

  // Styling
  backgroundColor?: string; // Background color (default: #f5f5f5)
}
```

**Events:**

```typescript
interface SearchBarEmits {
  "update:modelValue": [value: string]; // v-model update
  focus: [event: any]; // Focus event
  blur: [event: any]; // Blur event
  search: [value: string]; // Search confirm (keyboard search button)
  clear: []; // Clear event
  "right-icon-click": []; // Right icon click
}
```

**Slots:**

```typescript
// Right area custom content slot
#right;
```

**Slot vs Prop Priority:**

- If `#right` slot is provided, use slot content
- Otherwise, if `rightIcon` prop is provided, render icon
- If neither, right area is not rendered

### Interaction Behavior

**Input Interaction:**

1. User types → Triggers `@input` → Updates `modelValue` → Shows clear button
2. User clicks clear button → Clears input → Emits `clear` event → Hides clear button
3. User presses keyboard search key → Triggers `@confirm` → Emits `search` event with current value

**Clear Button:**

1. Only shown when all conditions met:
   - `clearable` is true (default)
   - Input has content
   - Not disabled
   - Not readonly
2. Click clears input value and emits `clear` event
3. Visual feedback: `active:opacity-70`

**Right Icon:**

1. Click executes `rightIconClick` callback if provided
2. Emits `right-icon-click` event
3. Visual feedback: `active:bg-hover`

**Focus/Blur:**

1. Focus → Emits `focus` event with native event object
2. Blur → Emits `blur` event with native event object
3. Can be used to show/hide search suggestions, history, etc.

**Disabled State:**

- Input is disabled
- Clear button is hidden
- Overall opacity: 0.3
- No interaction allowed

**Readonly State:**

- Input is readonly (can focus but cannot edit)
- Clear button is hidden
- Commonly used for click-to-navigate to dedicated search page

### Technical Implementation

**File Structure:**

```
src/components/search-bar/
├── index.vue          # Main component (layout, logic, events)
└── types.ts           # TypeScript type definitions
```

**Key Computed Properties:**

```typescript
// Whether to show clear button
const showClear = computed(() => {
  return props.clearable && !props.disabled && !props.readonly && !!inputValue.value;
});

// Whether to show divider
const showDivider = computed(() => {
  return showRightArea.value;
});

// Whether to show right area
const showRightArea = computed(() => {
  return props.rightIcon || slots.right;
});
```

**State Management:**

```typescript
const inputValue = ref(props.modelValue || "");

// Watch modelValue changes from parent
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal || "";
  },
);
```

**Input Rendering Pattern:**

```vue
<input v-model="inputValue" type="text" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" confirm-type="search" @focus="handleFocus" @blur="handleBlur" @confirm="handleSearch" @input="handleInput" />
```

**Clear Button Pattern:**

```vue
<view v-if="showClear" class="clear-button w-40rpx h-40rpx flex-center rounded-full bg-[#d0d0d0] active:opacity-70 transition-opacity" @click="handleClear">
  <view class="i-carbon-close text-32rpx text-white" />
</view>
```

**Right Area Pattern:**

```vue
<!-- Divider -->
<view
  v-if="showDivider"
  class="divider w-1px h-40rpx bg-border-light mx-12rpx"
/>

<!-- Right content -->
<view v-if="showRightArea" class="right-area">
  <!-- Slot has priority -->
  <slot name="right">
    <!-- Fallback to icon -->
    <view
      v-if="rightIcon"
      class="icon-button w-48rpx h-48rpx flex-center rounded-full active:bg-hover transition-colors"
      @click="handleRightIconClick"
    >
      <view :class="`i-carbon-${rightIcon} text-48rpx text-text-secondary`" />
    </view>
  </slot>
</view>
```

### Edge Cases & Error Handling

**Empty States:**

- No input content: Clear button hidden
- No right content: Divider and right area hidden
- Empty placeholder: Shows default '搜索...'

**Text Overflow:**

- Input content exceeds width: Input scrolls automatically (native behavior)
- Placeholder text too long: Truncate with ellipsis

**Clear Button Display Conditions:**

- `clearable=true` (default)
- Has input content
- Not disabled
- Not readonly
- All conditions must be met

**Divider Display Conditions:**

- Right area has content (icon or slot)
- Shown between input area and right area

**State Conflicts:**

- If both `disabled` and `readonly` are true, `disabled` takes precedence
- If both `rightIcon` and `#right` slot are provided, slot takes precedence

**Callback Safety:**

- Right icon without `rightIconClick`: Only emits event, no callback execution
- All event handlers check for existence before calling

**Platform Compatibility:**

- Uses uni-app `<input>` component (cross-platform)
- Icons via UnoCSS (configured carbon icon set)
- Shadow via UnoCSS utilities (cross-platform compatible)
- Confirm type "search" shows search button on mobile keyboards

### Performance Considerations

1. **Computed Properties:** Clear button and divider visibility calculated once, cached until props/state change
2. **Conditional Rendering:** `v-if` for optional elements (not rendered in DOM when hidden)
3. **Event Handling:** Direct event binding, no unnecessary wrappers
4. **Debouncing:** Not implemented in component (users can add debounce in parent if needed)

### Testing Strategy

**Unit Tests:**

- Props validation and default values
- Computed properties (showClear, showDivider, showRightArea)
- Event emission (update:modelValue, focus, blur, search, clear, right-icon-click)
- v-model two-way binding

**Integration Tests:**

- Clear button show/hide behavior
- Right icon click callback execution
- Slot vs prop priority
- Disabled/readonly state behavior

**Visual Tests:**

- Layout with different configurations (no right content, with icon, with slot)
- Clear button appearance/disappearance
- Divider display logic
- Text overflow behavior
- Disabled/readonly visual states

**Platform Tests:**

- H5 browser
- WeChat mini-program
- Alipay mini-program

### Usage Examples

**Basic usage:**

```vue
<search-bar v-model="searchText" placeholder="搜索商品、店铺..." />
```

**With events:**

```vue
<search-bar v-model="searchText" placeholder="搜索..." @search="handleSearch" @focus="handleFocus" @blur="handleBlur" @clear="handleClear" />
```

**With right icon:**

```vue
<search-bar v-model="searchText" placeholder="搜索..." right-icon="microphone" :right-icon-click="handleVoiceSearch" @right-icon-click="handleRightIconClick" />
```

**With right slot (custom content):**

```vue
<search-bar v-model="searchText" placeholder="搜索...">
  <template #right>
    <view class="flex items-center gap-8rpx">
      <text class="text-24rpx text-text-secondary">语音</text>
      <view class="w-32rpx h-32rpx bg-primary rounded-full flex-center">
        <view class="i-carbon-microphone text-24rpx text-white" />
      </view>
    </view>
  </template>
</search-bar>
```

**Readonly (click to navigate):**

```vue
<search-bar v-model="searchText" placeholder="搜索商品、店铺..." readonly @click="navigateToSearchPage" />
```

**Disabled state:**

```vue
<search-bar v-model="searchText" placeholder="搜索功能暂不可用" disabled />
```

**Custom background:**

```vue
<search-bar v-model="searchText" placeholder="搜索..." background-color="#ffffff" />
```

**Without clear button:**

```vue
<search-bar v-model="searchText" placeholder="搜索..." :clearable="false" />
```

### Future Enhancements

**Phase 2 (Optional):**

- Search suggestions dropdown
- Search history
- Hot search keywords
- Auto-focus prop
- Max length validation
- Input type configuration (text, number, etc.)
- Custom icon size configuration

**Phase 3 (Optional):**

- Animation on clear button show/hide
- Debounce configuration for search event
- Loading state (searching indicator)
- Voice input integration
- QR code scan integration
- Dark mode support

### Dependencies

**Required:**

- Vue 3 (Composition API)
- uni-app framework
- UnoCSS (with carbon icons preset)

**Design Tokens:**

- `designTokens.colors.textPrimary`
- `designTokens.colors.textSecondary`
- `designTokens.colors.textPlaceholder`
- `designTokens.colors.borderLight`
- `designTokens.colors.bgHover`
- `designTokens.boxShadow.sm`
- `designTokens.fontSize.base`
- `designTokens.borderRadius.card`

### Implementation Checklist

- [ ] Create `src/components/search-bar/` directory
- [ ] Define TypeScript interfaces in `types.ts`
- [ ] Implement main component in `index.vue`
- [ ] Add UnoCSS classes for styling
- [ ] Implement v-model two-way binding
- [ ] Implement clear button logic
- [ ] Implement right area (icon + slot)
- [ ] Implement divider display logic
- [ ] Add computed properties for conditional rendering
- [ ] Handle disabled and readonly states
- [ ] Emit all required events
- [ ] Handle edge cases (empty states, text overflow)
- [ ] Add TypeScript type exports
- [ ] Test on H5 platform
- [ ] Test on WeChat mini-program
- [ ] Test on Alipay mini-program
- [ ] Create demo page
- [ ] Update component documentation

---

**Approved by:** [Pending User Review]  
**Implementation Plan:** [To be created via writing-plans skill]
