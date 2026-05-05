// Base ESLint configuration for the monorepo
// Individual packages can extend this configuration

export default {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.git/**',
    '**/coverage/**',
  ],
}
