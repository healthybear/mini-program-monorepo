# Waisik 项目代码规范

> 本文档基于 2026-05-17 的项目审查结果生成，明确项目的代码规范和最佳实践。

## 📋 目录

- [代码风格规范](#代码风格规范)
- [TypeScript 规范](#typescript-规范)
- [Vue 组件规范](#vue-组件规范)
- [注释规范](#注释规范)
- [导入导出规范](#导入导出规范)
- [错误处理规范](#错误处理规范)
- [性能优化规范](#性能优化规范)
- [安全规范](#安全规范)

---

## 代码风格规范

### 基本格式

```typescript
// ✅ 正确
const userName = "John";
const userAge = 25;

// ❌ 错误
const userName = "John"; // 不使用双引号和分号
const user_name = "John"; // 不使用下划线命名
```

**规则：**

- **缩进**：2 空格
- **引号**：单引号（JS/TS），双引号（JSON）
- **分号**：不使用分号（依赖 ASI）
- **行尾**：LF（Unix 风格）
- **尾逗号**：ES5+ 支持的地方都使用

### 命名规范

| 类型          | 规范                     | 示例                                 |
| ------------- | ------------------------ | ------------------------------------ |
| 变量/函数     | camelCase                | `userName`, `getUserInfo()`          |
| 常量          | UPPER_SNAKE_CASE         | `API_BASE_URL`, `MAX_RETRY_COUNT`    |
| 类/接口/类型  | PascalCase               | `UserInfo`, `ApiResponse`            |
| 组件文件      | PascalCase 或 kebab-case | `UserCard.vue`, `user-card.vue`      |
| 普通文件      | kebab-case               | `user-service.ts`, `api-client.ts`   |
| 私有属性/方法 | 前缀 `_`                 | `_privateMethod()`, `_internalState` |

**示例：**

```typescript
// ✅ 正确
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const COUNTDOWN_SECONDS = 60;

interface UserProfile {
  userId: string;
  userName: string;
}

class UserService {
  private _cache: Map<string, any>;

  getUserById(id: string): Promise<UserProfile> {
    // ...
  }
}

// ❌ 错误
const max_upload_size = 5242880; // 应该使用 UPPER_SNAKE_CASE
const CountdownSeconds = 60; // 常量不应该用 PascalCase

interface userProfile {
  // 接口应该用 PascalCase
  user_id: string; // 属性应该用 camelCase
}
```

---

## TypeScript 规范

### 类型定义

**原则：明确类型，避免 `any`**

```typescript
// ❌ 错误 - 使用 any
function handleData(data: any) {
  return data.value;
}

const formData: any = {};

// ✅ 正确 - 明确类型
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

function handleData(data: ApiResponse<UserInfo>) {
  return data.data;
}

const formData: Record<string, string | number> = {};
```

### 类型断言

**原则：优先使用类型守卫，避免过度使用 `as`**

```typescript
// ❌ 错误 - 过度使用类型断言
const user = data as User;
const id = (user as any).id;

// ✅ 正确 - 使用类型守卫
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}

if (isUser(data)) {
  const id = data.id; // TypeScript 知道这里是 User 类型
}

// ✅ 正确 - 必要时使用类型断言（确保类型安全）
const user = data as User; // 仅在确定类型时使用
```

### 接口 vs 类型别名

```typescript
// ✅ 推荐 - 对象结构使用 interface
interface UserInfo {
  id: string;
  name: string;
  email: string;
}

// ✅ 推荐 - 联合类型、工具类型使用 type
type Status = "pending" | "success" | "error";
type Nullable<T> = T | null;
type ReadonlyUser = Readonly<UserInfo>;

// ❌ 避免 - 不要混用
type UserInfo = {
  // 对象结构应该用 interface
  id: string;
};
```

### 泛型使用

```typescript
// ✅ 正确 - 合理使用泛型
interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

function request<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}

// 使用时指定具体类型
const response = await request<UserInfo>("/api/user");

// ❌ 错误 - 泛型约束不足
function getData<T>(data: T): T {
  return (data as any).value; // 应该添加约束
}

// ✅ 正确 - 添加泛型约束
function getData<T extends { value: any }>(data: T): T["value"] {
  return data.value;
}
```

---

## Vue 组件规范

### 组件结构

```vue
<script lang="ts" setup>
// 1. 导入（按顺序：类型 → 第三方库 → 本地模块）
import type { PropType } from "vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "@/router";
import { useUserStore } from "@/store";

// 2. 类型定义
interface FormData {
  username: string;
  password: string;
}

// 3. Props 定义
interface Props {
  userId: string;
  mode?: "edit" | "view";
}

const props = withDefaults(defineProps<Props>(), {
  mode: "view",
});

// 4. Emits 定义
interface Emits {
  (e: "submit", data: FormData): void;
  (e: "cancel"): void;
}

const emit = defineEmits<Emits>();

// 5. 响应式数据
const loading = ref(false);
const formData = ref<FormData>({
  username: "",
  password: "",
});

// 6. 计算属性
const isValid = computed(() => {
  return formData.value.username && formData.value.password;
});

// 7. 方法
function handleSubmit() {
  if (!isValid.value) return;
  emit("submit", formData.value);
}

// 8. 生命周期
onMounted(() => {
  // 初始化逻辑
});
</script>

<template>
  <view class="container">
    <!-- 模板内容 -->
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
</style>
```

### 组件职责

**原则：单一职责，组件不超过 300 行**

```typescript
// ❌ 错误 - 组件职责过重（756 行）
// pages/record/new.vue 包含：表单验证、图片上传、地图选择、标签管理

// ✅ 正确 - 拆分为多个子组件
// pages/record/new.vue (主组件)
//   ├── components/ImageUploader.vue
//   ├── components/TagSelector.vue
//   ├── components/LocationPicker.vue
//   └── components/RecordForm.vue
```

### Props 验证

```typescript
// ✅ 正确 - 完整的 Props 定义
interface Props {
  // 必需属性
  userId: string;

  // 可选属性（提供默认值）
  mode?: "edit" | "view";
  maxLength?: number;

  // 复杂类型
  user?: UserInfo;
  options?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  mode: "view",
  maxLength: 100,
  options: () => [],
});

// ❌ 错误 - 缺少类型定义
const props = defineProps({
  userId: String, // 应该使用 TypeScript 类型
});
```

---

## 注释规范

### 基本原则

**默认不写注释，只在必要时添加**

- ✅ **需要注释**：复杂业务逻辑、临时方案、性能优化、非常规用法
- ❌ **不需要注释**：重复代码内容、显而易见的逻辑、过时的注释

### 函数注释

```typescript
// ❌ 错误 - 无用的注释
// 获取用户名
function getUserName(user: User) {
  return user.name;
}

// ✅ 正确 - 不需要注释（函数名已经说明了意图）
function getUserName(user: User) {
  return user.name;
}

// ✅ 正确 - 复杂逻辑需要注释
/**
 * 刷新 token
 *
 * 使用队列机制防止并发刷新：
 * 多个请求同时 401 时，只发起一次刷新请求，其他请求等待
 */
function refreshToken() {
  if (refreshing) {
    return new Promise((resolve) => {
      taskQueue.push(resolve);
    });
  }
  // ...
}
```

### 业务逻辑注释

```typescript
// ✅ 正确 - 解释 WHY，不是 WHAT
// 高德地图 H5 端需要手动初始化，否则会报错
if (import.meta.env.UNI_PLATFORM === "h5") {
  await initAMapLoader();
}

// ❌ 错误 - 重复代码内容
// 如果是 H5 平台，初始化高德地图
if (import.meta.env.UNI_PLATFORM === "h5") {
  await initAMapLoader();
}
```

### TODO 注释

```typescript
// ✅ 正确 - 明确的 TODO，包含上下文
// TODO: 实现退出登录逻辑
// 需要清除 token、用户信息，并跳转到登录页
// 参考：https://github.com/xxx/issue/123
function logout() {
  // 临时实现
}

// ❌ 错误 - 模糊的 TODO
// TODO: 修复这里
function someFunction() {
  // ...
}
```

### 禁止的注释

```typescript
// ❌ 禁止 - 注释掉的代码（使用 Git 管理历史）
// const oldFunction = () => {
//   return 'old'
// }

// ❌ 禁止 - 调试代码
// console.log('debug:', data)

// ❌ 禁止 - 过时的注释
// 2025-01-01: 这个功能已经废弃，请使用新的 API
```

---

## 导入导出规范

### 导入顺序

```typescript
// 1. 类型导入
import type { PropType } from "vue";
import type { UserInfo } from "@/types";

// 2. 第三方库
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// 3. 本地模块（按层级：@/ → ../ → ./）
import { useUserStore } from "@/store";
import { formatDate } from "@/utils";
import { API_BASE_URL } from "../config";
import { helper } from "./helper";
```

### 路径别名

```typescript
// ✅ 正确 - 使用 @/ 别名
import { useUserStore } from "@/store";
import { formatDate } from "@/utils";

// ❌ 错误 - 使用相对路径（跨多层目录时）
import { useUserStore } from "../../../store";
import { formatDate } from "../../utils";

// ✅ 正确 - 同级或父级目录可以使用相对路径
import { helper } from "./helper";
import { config } from "../config";
```

### 导出规范

```typescript
// ✅ 推荐 - 命名导出（便于 tree-shaking）
export function formatDate(date: Date): string {
  // ...
}

export const API_BASE_URL = "https://api.example.com";

// ✅ 可以 - 默认导出（组件、类）
export default defineComponent({
  name: "UserCard",
});

// ❌ 避免 - export * 可能导致循环依赖
export * from "./user";
export * from "./auth";

// ✅ 正确 - 明确导出
export { getUserInfo, updateUser } from "./user";
export { login, logout } from "./auth";
```

---

## 错误处理规范

### 异步错误处理

```typescript
// ✅ 正确 - 完整的错误处理
async function fetchUserData(userId: string) {
  try {
    const response = await request<UserInfo>(`/api/user/${userId}`);

    if (response.code !== 0) {
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    if (error instanceof NetworkError) {
      uni.showToast({ title: "网络错误，请检查网络连接", icon: "none" });
    } else if (error instanceof AuthError) {
      // 跳转到登录页
      toLoginPage();
    } else {
      console.error("获取用户数据失败:", error);
      uni.showToast({ title: "获取数据失败", icon: "none" });
    }

    throw error; // 重新抛出，让调用者处理
  }
}

// ❌ 错误 - 吞掉错误
async function fetchUserData(userId: string) {
  try {
    const response = await request(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error); // 只打印，不处理
  }
}
```

### 边界条件检查

```typescript
// ✅ 正确 - 在函数入口检查参数
function calculateDiscount(price: number, discountRate: number): number {
  if (price < 0) {
    throw new Error("价格不能为负数");
  }

  if (discountRate < 0 || discountRate > 1) {
    throw new Error("折扣率必须在 0-1 之间");
  }

  return price * (1 - discountRate);
}

// ❌ 错误 - 不检查边界条件
function calculateDiscount(price: number, discountRate: number): number {
  return price * (1 - discountRate); // 可能产生负数或异常结果
}
```

---

## 性能优化规范

### 避免魔法数字

```typescript
// ❌ 错误 - 魔法数字
countdown.value = 60;
if (code.length !== 6) {
  // ...
}

// ✅ 正确 - 使用常量
const COUNTDOWN_SECONDS = 60;
const VERIFICATION_CODE_LENGTH = 6;

countdown.value = COUNTDOWN_SECONDS;
if (code.length !== VERIFICATION_CODE_LENGTH) {
  // ...
}
```

### 计算属性 vs 方法

```typescript
// ✅ 正确 - 使用计算属性（有缓存）
const fullName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`;
});

// ❌ 错误 - 使用方法（每次都重新计算）
function getFullName() {
  return `${user.value.firstName} ${user.value.lastName}`;
}
```

### 列表渲染优化

```vue
<template>
  <!-- ✅ 正确 - 使用 key -->
  <view v-for="item in list" :key="item.id">
    {{ item.name }}
  </view>

  <!-- ❌ 错误 - 使用 index 作为 key（列表会变化时） -->
  <view v-for="(item, index) in list" :key="index">
    {{ item.name }}
  </view>
</template>
```

---

## 安全规范

### 敏感信息处理

```typescript
// ✅ 正确 - 使用环境变量
const API_KEY = import.meta.env.VITE_AMAP_KEY;

// ❌ 错误 - 硬编码敏感信息
const API_KEY = "abc123xyz456"; // 不要提交到代码库
```

### XSS 防护

```vue
<template>
  <!-- ✅ 正确 - 默认转义 -->
  <view>{{ userInput }}</view>

  <!-- ⚠️ 危险 - 使用 v-html 时确保内容已消毒 -->
  <view v-html="sanitizedHtml"></view>

  <!-- ❌ 错误 - 直接渲染用户输入 -->
  <view v-html="userInput"></view>
</template>
```

### API 请求安全

```typescript
// ✅ 正确 - 参数验证和转义
function searchUsers(keyword: string) {
  // 验证输入
  if (!keyword || keyword.length > 50) {
    throw new Error("搜索关键词无效");
  }

  // 转义特殊字符
  const safeKeyword = encodeURIComponent(keyword);

  return request(`/api/users/search?q=${safeKeyword}`);
}

// ❌ 错误 - 直接拼接用户输入
function searchUsers(keyword: string) {
  return request(`/api/users/search?q=${keyword}`); // 可能导致注入攻击
}
```

---

## 调试代码清理

### Console 使用规范

```typescript
// ✅ 正确 - 保留必要的错误日志
console.error("API 请求失败:", error);
console.warn("Token 即将过期");

// ❌ 错误 - 调试用的 console.log（提交前删除）
console.log("debug:", data);
console.log("进入这个函数了");

// ✅ 正确 - 使用条件编译
// #ifdef DEV
console.log("开发环境调试信息:", data);
// #endif
```

### 提交前检查清单

- [ ] 删除所有 `console.log` 调试代码
- [ ] 删除所有注释掉的代码
- [ ] 处理所有 TODO 注释
- [ ] 运行 `pnpm lint --fix`
- [ ] 运行 `pnpm type-check`
- [ ] 测试修改的功能

---

## 工具和命令

### 代码检查

```bash
# ESLint 检查
pnpm lint

# 自动修复
pnpm lint --fix

# TypeScript 类型检查
pnpm type-check

# 格式化代码
pnpm format
```

### Git 提交规范

```bash
# 提交格式
<type>(<scope>): <subject>

# 示例
feat(waisik): 添加用户认证功能
fix(waisik): 修复登录页面跳转问题
docs: 更新代码规范文档
refactor(waisik): 重构用户服务模块
```

---

## 附录：常见问题

### Q: 什么时候使用 `any`？

A: 尽量避免使用 `any`。如果确实需要，使用 `unknown` 并配合类型守卫。

### Q: 组件多大需要拆分？

A: 超过 300 行或包含 3 个以上独立功能时，考虑拆分。

### Q: 什么时候需要写注释？

A: 只在代码本身无法清晰表达意图时写注释，解释 WHY 而非 WHAT。

### Q: 如何处理第三方库的类型问题？

A: 优先使用 `@types/*` 包，如果没有，在 `typings.d.ts` 中声明。

---

**最后更新：** 2026-05-17  
**维护者：** Waisik 开发团队
