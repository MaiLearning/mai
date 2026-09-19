import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/packages/**/src/**/*.test.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
})