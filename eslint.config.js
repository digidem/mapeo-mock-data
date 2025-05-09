import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

const gitignorePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '.gitignore',
)

const gitExcludePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '.git',
  'info',
  'exclude',
)

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  includeIgnoreFile(gitExcludePath),
  js.configs.recommended,
  {
    name: 'node',
    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...globals.nodeBuiltin,
      },
    },
  },
])
