import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stor(y|ies).@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname.replace('.storybook', 'src'),
      // Виртуальный модуль из vite.config.ts в сторибуке не генерируется —
      // подставляем заглушку (браузерное окружение, fakeData: true)
      'virtual:mai-config': resolve(__dirname, 'mai-config.ts'),
    }

    return config
  },
}
export default config
