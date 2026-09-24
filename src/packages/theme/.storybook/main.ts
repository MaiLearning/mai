import path from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

/**
 * Storybook пакета @mai/theme. Изолирован от корневого storybook app/mai:
 * смотрит только на стори собственного src/ и настраивает алиас @/* на src/.
 */
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stor(y|ies).@(js|jsx|mjs|ts|tsx)',
    '../packages/**/*.mdx',
    '../packages/**/*.stor(y|ies).@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        '@': path.resolve(process.cwd(), 'src'),
        '@mai/icons': path.resolve(process.cwd(), 'packages/icons/src/index.ts'),
      },
    },
  }),
}
export default config
