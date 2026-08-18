import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'storybook-static/**',
      'node_modules/**',
      'src-tauri/target/**',
      'src-tauri/gen/**',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'never', prev: 'import', next: 'import' },
        {
          blankLine: 'never',
          prev: ['type', 'interface', 'class', 'function', 'const', 'let', 'var'],
          next: ['type', 'interface', 'class', 'function', 'const', 'let', 'var'],
        },
      ],
    },
  },
)
