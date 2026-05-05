# AppBar Component Design Specification

**Date:** 2026-05-05  
**Component:** Material Design App Bar  
**Location:** `apps/waisik/src/components/app-bar/`

## Overview

A Material Design compliant app bar (header) component for the Waisik mini-program. The component provides a flexible, reusable navigation header with support for left navigation icon, title, and configurable right action icons with overflow handling.

## Requirements

### Functional Requirements

1. Display a title text in the center-left area
2. Optional left icon (typically back button) with click handling
3. Configurable right action icons (0 to N icons)
4. Automatic overflow handling when more than 2 right icons are provided
5. Popover menu for overflow icons (3rd icon onwards)
6. Default back navigation behavior with override capability
7. Click feedback on all interactive elements

### Non-Functional Requirements

1. Follow Material Design specifications
2. Use project design tokens for consistency
3. TypeScript type safety
4. Cross-platform compatibility (H5, WeChat, Alipay mini-programs)
5. Performance optimized with computed properties

## Design Decisions

### Visual Design

**Dimensions:**

- Height: 112rpx (Material Design standard 56dp)
- Icon size: 48rpx × 48rpx (24dp)
- Icon spacing: 24rpx
- Horizontal padding: 16rpx (design-tokens.spacing.base)

**Colors:**

- Background: `#ffffff` (design-tokens.colors.bgCard)
- Title text: `#323233` (design-tokens.colors.textPrimary)
- Shadow: `0 2rpx 8rpx rgba(0, 0, 0, 0.08)` (design-tokens.boxShadow.sm)
- Active state: `#f1f1f1` (design-tokens.colors.bgHover)

**Typography:**

- Title font size: 32rpx (design-tokens.fontSize.lg)
- Title font weight: 500 (Medium)
- Title overflow: Single line with ellipsis

**Icons:**

- Icon set: @iconify/carbon (via UnoCSS)
- Click area: 48rpx × 48rpx circular
- Click feedback: Circular background highlight on active state

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  [Icon]  Title Text...          [Icon] [Icon] [⋮]  │  112rpx
└─────────────────────────────────────────────────────┘
   16rpx   8rpx    flex-grow-1      24rpx  24rpx  16rpx
```

**Three-column layout:**

1. **Left area:** Optional icon (hidden when not provided, no space reserved)
2. **Center area:** Title text (flex-grow: 1, truncates with ellipsis)
3. **Right area:** Icon group (up to 2 visible + overflow menu button)

### Overflow Handling Strategy

**Icon display logic:**

- 0 icons: Right area not rendered
- 1-2 icons: Display all icons directly
- 3+ icons: Display first icon + overflow menu button (⋮)

**Overflow menu:**

- Component: `wd-popover` from wot-design-uni
- Trigger: Click overflow menu button
- Position: `bottom-end` (aligned to right edge)
- Offset: `[0, 8]` (8rpx below the button)
- Content: Vertical list of remaining icons (3rd onwards)
- Item height: 88rpx
- Close behavior: Click item or click outside

### Component API

**Props Interface:**

```typescript
interface AppBarProps {
  // Title text (required)
  title: string;

  // Left icon configuration
  leftIcon?: string; // Carbon icon name (e.g., 'arrow-left')
  leftIconClick?: () => void; // Custom click handler (optional)

  // Right icons configuration
  rightIcons?: IconConfig[]; // Array of icon configurations

  // Styling
  backgroundColor?: string; // Custom background color (default: white)
  fixed?: boolean; // Fixed positioning (default: false)
}

interface IconConfig {
  icon: string; // Carbon icon name (e.g., 'search')
  onClick: () => void; // Click handler (required)
  badge?: string | number; // Optional badge (future enhancement)
}
```

**Events:**

```typescript
// Emitted when left icon is clicked
emit('left-click')

// Emitted when right icon is clicked (includes icon index)
emit('right-icon-click', index: number)
```

**Slots:**

No slots in initial version. All content configured via props.

### Interaction Behavior

**Left Icon:**

1. Click triggers `left-click` event
2. If `leftIconClick` prop provided: Execute custom handler
3. Otherwise: Execute default behavior `uni.navigateBack()`
4. Visual feedback: Circular background highlight on active state

**Right Icons (Visible):**

1. Click executes corresponding `onClick` callback
2. Emits `right-icon-click` event with icon index
3. Visual feedback: Circular background highlight on active state

**Overflow Menu Button:**

1. Click opens Popover with hidden icons
2. Visual feedback: Circular background highlight on active state

**Overflow Menu Items:**

1. Click executes corresponding `onClick` callback
2. Emits `right-icon-click` event with icon index
3. Automatically closes Popover after click

### Technical Implementation

**File Structure:**

```
src/components/app-bar/
├── index.vue          # Main component (layout, logic, events)
└── types.ts           # TypeScript type definitions
```

**Key Computed Properties:**

```typescript
// First 2 icons (directly visible)
const visibleIcons = computed(() => props.rightIcons?.slice(0, 2) || []);

// Icons from 3rd onwards (shown in overflow menu)
const overflowIcons = computed(() => props.rightIcons?.slice(2) || []);

// Whether to show overflow menu button
const hasOverflow = computed(() => (props.rightIcons?.length || 0) > 2);
```

**State Management:**

```typescript
const showPopover = ref(false); // Controls Popover visibility
```

**Icon Rendering Pattern:**

```vue
<view class="w-48rpx h-48rpx flex-center rounded-full active:bg-hover transition-colors" @click="handleIconClick">
  <view :class="`i-carbon-${iconName} text-48rpx`" />
</view>
```

**Popover Integration:**

```vue
<wd-popover v-model="showPopover" placement="bottom-end" :offset="[0, 8]">
  <template #content>
    <view class="overflow-menu">
      <view 
        v-for="(item, index) in overflowIcons"
        :key="index"
        class="menu-item h-88rpx flex-center"
        @click="handleOverflowClick(index + 2)"
      >
        <view :class="`i-carbon-${item.icon} text-48rpx`" />
      </view>
    </view>
  </template>
  <view class="icon-button">
    <view class="i-carbon-overflow-menu-vertical text-48rpx" />
  </view>
</wd-popover>
```

### Edge Cases & Error Handling

**Empty States:**

- No left icon: Left area not rendered, no space reserved
- No right icons: Right area not rendered, title takes full available width
- Empty title: Renders empty string, no error

**Text Overflow:**

- Title exceeds available width: Truncate with ellipsis (single line)
- Maximum title width: Dynamically calculated based on icon presence

**Icon Count Boundaries:**

- 0 icons: Right area hidden
- 1 icon: Single icon displayed, no overflow button
- 2 icons: Both icons displayed, no overflow button
- 3+ icons: First icon + overflow button displayed

**Callback Safety:**

- Left icon without `leftIconClick`: Uses default `uni.navigateBack()`
- Right icon without `onClick`: No-op (defensive programming)
- Popover item click: Executes callback then closes Popover

**Platform Compatibility:**

- Uses uni-app standard components and APIs
- Icons via UnoCSS (configured carbon icon set)
- Shadow via UnoCSS utilities (cross-platform compatible)
- Popover from wot-design-uni (tested on target platforms)

### Performance Considerations

1. **Computed Properties:** Icon grouping calculated once, cached until props change
2. **Conditional Rendering:** `v-if` for optional elements (not rendered in DOM)
3. **Event Handling:** Direct event binding, no unnecessary wrappers
4. **Popover Lazy Rendering:** Content only rendered when visible

### Testing Strategy

**Unit Tests:**

- Props validation and default values
- Computed properties (visibleIcons, overflowIcons, hasOverflow)
- Event emission (left-click, right-icon-click)
- Default back navigation behavior

**Integration Tests:**

- Popover open/close behavior
- Icon click callbacks execution
- Overflow menu item clicks
- Text truncation with various title lengths

**Visual Tests:**

- Layout with different icon combinations (0, 1, 2, 3+ icons)
- Active state styling
- Shadow rendering
- Text ellipsis behavior

**Platform Tests:**

- H5 browser
- WeChat mini-program
- Alipay mini-program

### Usage Examples

**Basic usage with title only:**

```vue
<app-bar title="首页" />
```

**With back button:**

```vue
<app-bar title="详情页" left-icon="arrow-left" />
```

**With custom back handler:**

```vue
<app-bar title="编辑资料" left-icon="arrow-left" :left-icon-click="handleCustomBack" />
```

**With right action icons:**

```vue
<app-bar
  title="消息列表"
  :right-icons="[
    { icon: 'search', onClick: handleSearch },
    { icon: 'add', onClick: handleAdd },
  ]"
/>
```

**With overflow menu (3+ icons):**

```vue
<app-bar
  title="设置"
  :right-icons="[
    { icon: 'search', onClick: handleSearch },
    { icon: 'filter', onClick: handleFilter },
    { icon: 'settings', onClick: handleSettings },
    { icon: 'help', onClick: handleHelp },
  ]"
/>
```

**Fixed positioning:**

```vue
<app-bar title="首页" :fixed="true" />
```

### Future Enhancements

**Phase 2 (Optional):**

- Badge support on right icons (red dot or number)
- Custom title slot for complex title layouts
- Subtitle support (two-line title)
- Search bar integration
- Gradient background support
- Transparent background with scroll-based opacity

**Phase 3 (Optional):**

- Animation on Popover open/close
- Icon tooltip on long press
- Accessibility improvements (ARIA labels)
- Dark mode support

### Dependencies

**Required:**

- Vue 3 (Composition API)
- uni-app framework
- UnoCSS (with carbon icons preset)
- wot-design-uni (`wd-popover` component)

**Design Tokens:**

- `designTokens.colors.bgCard`
- `designTokens.colors.textPrimary`
- `designTokens.colors.bgHover`
- `designTokens.boxShadow.sm`
- `designTokens.fontSize.lg`
- `designTokens.spacing.base`
- `designTokens.spacing.xs`

### Implementation Checklist

- [ ] Create `src/components/app-bar/` directory
- [ ] Define TypeScript interfaces in `types.ts`
- [ ] Implement main component in `index.vue`
- [ ] Add UnoCSS classes for styling
- [ ] Integrate `wd-popover` for overflow menu
- [ ] Implement left icon default behavior
- [ ] Implement right icon click handling
- [ ] Add computed properties for icon grouping
- [ ] Handle edge cases (empty states, text overflow)
- [ ] Add TypeScript type exports
- [ ] Test on H5 platform
- [ ] Test on WeChat mini-program
- [ ] Test on Alipay mini-program
- [ ] Update component documentation
- [ ] Add usage examples to README

---

**Approved by:** [Pending User Review]  
**Implementation Plan:** [To be created via writing-plans skill]
