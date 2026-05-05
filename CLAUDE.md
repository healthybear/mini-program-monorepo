# CLAUDE.md

This file provides context and guidelines for AI assistants working on this monorepo project.

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
