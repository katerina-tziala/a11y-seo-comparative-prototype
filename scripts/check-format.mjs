import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import prettier from 'prettier'

import { collectFiles, formatTailwindApply } from './format-tailwind-apply.mjs'

const rootDir = process.cwd()
const prettierExtensions = new Set([
  '.cjs',
  '.css',
  '.cts',
  '.html',
  '.js',
  '.json',
  '.jsonc',
  '.md',
  '.mjs',
  '.mts',
  '.ts',
  '.vue',
  '.yaml',
  '.yml',
])
const changedFiles = []

for (const filePath of await collectFiles(rootDir, prettierExtensions)) {
  const fileInfo = await prettier.getFileInfo(filePath, {
    ignorePath: path.join(rootDir, '.prettierignore'),
  })

  if (fileInfo.ignored || fileInfo.inferredParser == null) {
    continue
  }

  const source = await readFile(filePath, 'utf8')
  const options = (await prettier.resolveConfig(filePath)) ?? {}
  const prettierFormatted = await prettier.format(source, {
    ...options,
    filepath: filePath,
  })
  const formatted = formatTailwindApply(prettierFormatted, filePath)

  if (formatted !== source) {
    changedFiles.push(path.relative(rootDir, filePath))
  }
}

if (changedFiles.length > 0) {
  console.error('Code style issues found. Run npm run format to fix:')

  for (const filePath of changedFiles) {
    console.error(`  ${filePath}`)
  }

  process.exitCode = 1
}
