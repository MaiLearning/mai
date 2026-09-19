import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Storybook пакета @mai/notifications. Изолирован от корневого storybook
 * app/mai: смотрит только на стори собственного src/ и резолвит @ на src.
 * Пакеты @mai/* подтягиваются через pnpm-симлинки node_modules.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stor(y|ies).@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      dedupe: ['react', 'react-dom', 'styled-components'],
      alias: {
        ...viteConfig.resolve?.alias,
        '@': resolve(__dirname, '../src'),
      },
    },
  }),
}
export default config
