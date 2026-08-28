import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Виртуальный модуль генерируется vite-плагином mai-config; в Vitest — заглушка.
      'virtual:mai-config': path.resolve(__dirname, 'src/app/__mocks__/mai-config.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/entities/**/*.test.ts', 'src/features/**/*.test.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
})
