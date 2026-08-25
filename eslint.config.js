import stylistic from '@stylistic/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

// ── Локальное правило: пустая строка перед многострочной декларацией ────────
// Требует одну пустую строку перед const/let/var, занимающим несколько строк
// (например, многострочный useCallback), если предыдущий statement — тоже
// декларация и она однострочная (переход «группа однострочных → многострочная»).
// Автофиксируемо.
const padMultilineDeclaration = {
  rules: {
    'pad-multiline-declaration': {
      meta: {
        fixable: 'whitespace',
        schema: [],
        messages: {
          missing: 'Ожидается пустая строка перед многострочной декларацией',
        },
      },
      create(context) {
        return {
          'Program:exit'(program) {
            for (let i = 1; i < program.body.length; i++) {
              const stmt = program.body[i]
              const prev = program.body[i - 1]
              if (stmt.type !== 'VariableDeclaration') continue
              if (stmt.loc.end.line <= stmt.loc.start.line) continue
              if (prev.type !== 'VariableDeclaration') continue
              if (prev.loc.end.line > prev.loc.start.line) continue
              if (stmt.loc.start.line - prev.loc.end.line >= 2) continue
              context.report({
                node: stmt,
                messageId: 'missing',
                fix: (fixer) => fixer.insertTextAfter(prev, '\n'),
              })
            }
          },
        }
      },
    },
  },
}

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'storybook-static/**',
      'node_modules/**',
      'src-tauri/target/**',
      'src-tauri/gen/**',
      'coverage/**',
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
      'react-hooks': reactHooks,
      local: padMultilineDeclaration,
    },
    rules: {
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'never', prev: 'import', next: 'import' },
        // Пустая строка на границе констант и интерфейсов/типов/классов/функций
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: ['interface', 'type', 'class', 'function'],
        },
        {
          blankLine: 'always',
          prev: ['interface', 'type', 'class', 'function'],
          next: ['const', 'let', 'var'],
        },
        // Пустая строка перед return
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      // Пустая строка перед многострочной декларацией (useCallback и т.п.)
      'local/pad-multiline-declaration': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
)
