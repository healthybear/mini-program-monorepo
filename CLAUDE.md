# CLAUDE.md

This file provides context and guidelines for AI assistants working on this monorepo project.

## 语言偏好

**请始终使用中文与用户交流。**

所有回复、说明、代码注释、文档都应使用中文。

## Project Overview

This is a **mini-program monorepo** built with pnpm workspaces, designed to manage multiple mini-program applications and shared packages efficiently.

**Tech Stack:**

- **Package Manager:** pnpm (v10.10.0+)
- **Node.js:** v20.0.0+
- **Monorepo Tool:** pnpm workspaces
- **Version Management:** Changesets
- **Code Quality:** ESLint, Prettier, Commitlint, Husky, lint-staged
- **Primary Framework:** uni-app (for cross-platform mini-programs)

## Project Structure

```
mini-program-monorepo/
├── apps/                      # Applications
│   └── waisik/               # Waisik mini-program (uni-app)
├── .changeset/               # Changesets configuration
├── .husky/                   # Git hooks
├── .commitlintrc.cjs         # Commit message linting
├── .editorconfig             # Editor configuration
├── .lintstagedrc.json        # Lint-staged configuration
├── eslint.config.js          # Base ESLint config
├── tsconfig.base.json        # Base TypeScript config
├── pnpm-workspace.yaml       # Workspace definition
├── pnpm-lock.yaml            # Single lock file for entire monorepo
└── package.json              # Root package.json with shared dependencies
```

## Architecture Decisions

### Monorepo Structure

1. **Single Lock File:** Only `pnpm-lock.yaml` at root. No lock files in sub-packages.
2. **Dependency Hoisting:** Shared dependencies (husky, commitlint, changesets, etc.) are in root `devDependencies`.
3. **Workspace Naming:** Apps use scoped names: `@mini-program-monorepo/waisik`.
4. **Configuration Inheritance:** Sub-packages extend root configs (tsconfig, eslint).

### Why This Structure?

- **Consistency:** Single source of truth for versions
- **Efficiency:** Shared dependencies installed once
- **Maintainability:** Update tools in one place
- **Scalability:** Easy to add new apps/packages

## Development Guidelines

### Adding Dependencies

```bash
# Root-level shared tools
pnpm add -w <package>

# App-specific dependencies
pnpm --filter @mini-program-monorepo/waisik add <package>
```

### Creating New Apps

1. Create directory under `apps/`
2. Use scoped name: `@mini-program-monorepo/<app-name>`
3. Add `"private": true` to package.json
4. Extend root configs (tsconfig.base.json, eslint.config.js)
5. No `packageManager` field in app package.json
6. No separate lock file or git repository

### Git Commit Convention

**Format:** `<type>(<scope>): <subject>`

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/tooling

**Examples:**

```
feat(waisik): add user authentication
fix(waisik): resolve navigation bug
docs: update README with deployment steps
chore: upgrade dependencies
```

### Code Style

- **Indentation:** 2 spaces
- **Line Endings:** LF (Unix-style)
- **Quotes:** Single quotes for JS/TS, double for JSON
- **Trailing Commas:** Yes (ES5+)
- **Semicolons:** No (rely on ASI)

### Code Comments Guidelines

**注释原则：**

- **默认不写注释**：优先通过清晰的命名和代码结构表达意图
- **只在必要时添加注释**：解释 WHY（为什么这样做），而非 WHAT（做了什么）
- **使用中文注释**：项目团队使用中文，注释也应使用中文

**何时需要注释：**

✅ **复杂业务逻辑**：非显而易见的业务规则或算法
✅ **临时方案/Workaround**：解释为什么使用临时方案，以及未来的改进方向
✅ **性能优化**：说明优化的原因和权衡
✅ **外部依赖的特殊用法**：第三方库的非常规使用方式
✅ **公共 API/工具函数**：使用 JSDoc 格式，说明参数、返回值、用法示例
✅ **类型定义**：复杂的 TypeScript 类型需要说明用途

**何时不需要注释：**

❌ **重复代码内容**：`// 设置用户名` 这种注释毫无价值
❌ **显而易见的逻辑**：`if (user) { ... }` 不需要注释"如果用户存在"
❌ **过时的注释**：代码改了但注释没改，误导性极强
❌ **注释掉的代码**：使用 Git 管理历史，不要留注释代码

**注释格式：**

```typescript
// 单行注释：简短说明

/**
 * 函数/类的 JSDoc 注释
 * @param name - 参数说明
 * @returns 返回值说明
 */

// 复杂逻辑的多行注释：
// 1. 第一步做什么
// 2. 第二步做什么
// 3. 为什么这样做
```

**示例：**

```typescript
// ❌ 不好的注释
function getUserName(user: User) {
  // 返回用户名
  return user.name;
}

// ✅ 好的注释（或者不需要注释）
function getUserName(user: User) {
  return user.name;
}

// ✅ 需要注释的场景
function refreshToken() {
  // 使用队列机制防止并发刷新 token
  // 多个请求同时 401 时，只发起一次刷新请求
  if (refreshing) {
    return new Promise((resolve) => {
      taskQueue.push(resolve);
    });
  }
  // ...
}
```

## Working with AI Assistants

### What to Do

✅ **Read before writing:** Always read existing code to understand patterns
✅ **Follow conventions:** Match the project's existing style
✅ **Verify changes:** Run builds and tests after modifications
✅ **Explain decisions:** Document non-obvious choices
✅ **Ask when unclear:** Better to clarify than assume

### What NOT to Do

❌ **Don't create lock files in apps:** Only root should have pnpm-lock.yaml
❌ **Don't duplicate configs:** Extend root configs instead
❌ **Don't add git repos in apps:** Single repo at root only
❌ **Don't skip hooks:** Never use --no-verify unless explicitly asked
❌ **Don't guess package names:** Check actual names in package.json

### Common Tasks

**Running waisik in development:**

```bash
pnpm dev:waisik
# or
cd apps/waisik && pnpm dev:mp-weixin
```

**Building waisik:**

```bash
pnpm build:waisik
```

**Installing dependencies:**

```bash
pnpm install  # Always run at root
```

**Linting:**

```bash
pnpm lint
```

## Project-Specific Context

### Waisik App

- **Framework:** uni-app (cross-platform mini-program framework)
- **UI Library:** wot-ui-v2
- **Platforms:** WeChat, Alipay, Toutiao mini-programs + H5
- **State Management:** Pinia
- **Routing:** vue-router
- **Build Tool:** Vite

### Key Files in Waisik

- `manifest.config.ts`: App manifest configuration
- `pages.config.ts`: Page routing configuration
- `src/main.ts`: Entry point
- `src/pages/`: Page components
- `src/store/`: Pinia stores
- `src/http/`: API client setup

### Build Artifacts

Generated files (ignored by git):

- `src/manifest.json` (generated from manifest.config.ts)
- `src/pages.json` (generated from pages.config.ts)
- `src/types/` (auto-generated types, except auto-import.d.ts)
- `dist/` (build output)

## Troubleshooting

### "pnpm.overrides" warning in apps

**Solution:** Move overrides to root package.json under `pnpm.overrides`.

### Lock file conflicts

**Solution:** Delete app lock files, run `pnpm install` at root.

### Pre-commit hook fails

**Solution:** Check `.lintstagedrc.json` exists and is valid.

### Dependency not found

**Solution:** Ensure you ran `pnpm install` at root, not in app directory.

## References

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Changesets](https://github.com/changesets/changesets)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [uni-app Documentation](https://uniapp.dcloud.net.cn/)

## Version History

- **2026-05-05:** Initial monorepo setup with waisik app
- **2026-05-05:** Configuration optimization and fixes

---

**Last Updated:** 2026-05-05  
**Maintained By:** Project Team
