// Minimal flat ESLint config (Next.js preset removed).
// Parses JS/JSX across the project for syntax checking; server + build
// artifacts are ignored.
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'build/**',
    '.next/**',
    'public/**',
  ]),
  {
    files: ['**/*.{js,jsx,mjs}'],
    ignores: ['server/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])

export default eslintConfig
