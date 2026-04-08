import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const [, , appNameArg, displayNameArg] = process.argv

if (!appNameArg) {
  console.error('Usage: pnpm new:app -- <app-name> [DisplayName]')
  process.exit(1)
}

const appName = appNameArg.trim()
const displayName = (displayNameArg || appName).trim()

if (!/^[a-z0-9-]+$/.test(appName)) {
  console.error('app-name must match: ^[a-z0-9-]+$')
  process.exit(1)
}

const rootDir = process.cwd()
const templateDir = path.resolve(rootDir, '_templates/unibest')
const targetDir = path.resolve(rootDir, `apps/${appName}`)

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  }
  catch {
    return false
  }
}

async function replaceInFile(filePath, replacer) {
  if (!await pathExists(filePath))
    return
  const source = await fs.readFile(filePath, 'utf8')
  const updated = replacer(source)
  if (updated !== source)
    await fs.writeFile(filePath, updated)
}

if (!await pathExists(templateDir)) {
  console.error(`Template not found: ${templateDir}`)
  process.exit(1)
}

if (await pathExists(targetDir)) {
  console.error(`Target exists: ${targetDir}`)
  process.exit(1)
}

await fs.cp(templateDir, targetDir, { recursive: true })

const targetLockfile = path.resolve(targetDir, 'pnpm-lock.yaml')
if (await pathExists(targetLockfile))
  await fs.rm(targetLockfile, { force: true })

const packageJsonPath = path.resolve(targetDir, 'package.json')
await replaceInFile(packageJsonPath, (source) => {
  const pkg = JSON.parse(source)
  pkg.name = `@repo/${appName}`
  return `${JSON.stringify(pkg, null, 2)}\n`
})

for (const envFile of ['.env.example', '.env']) {
  await replaceInFile(path.resolve(targetDir, 'env', envFile), source =>
    source.replace(/VITE_APP_TITLE\s*=\s*'[^']*'/, `VITE_APP_TITLE = '${displayName}'`))
}

await replaceInFile(path.resolve(targetDir, 'pages.config.ts'), source =>
  source.replace(/navigationBarTitleText:\s*'[^']*'/, `navigationBarTitleText: '${displayName}'`))

await replaceInFile(path.resolve(targetDir, 'src/pages.json'), source =>
  source.replace(/"navigationBarTitleText":\s*"[^"]*"/, `"navigationBarTitleText": "${displayName}"`))

await replaceInFile(path.resolve(targetDir, 'src/manifest.json'), source =>
  source.replace(/"name":\s*"[^"]*"/, `"name": "${displayName}"`))

console.log(`Created app: apps/${appName}`)
console.log(`Package name: @repo/${appName}`)
console.log(`Display name: ${displayName}`)
console.log('Next steps:')
console.log('1) pnpm install')
console.log(`2) pnpm --filter @repo/${appName} dev:h5`)
