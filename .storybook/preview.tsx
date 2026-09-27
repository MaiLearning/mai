import type { Preview } from '.pnpm/@storybook+react-vite@10.6.0_@types+react-dom@19.3.0_@types+react@19.3.0__@types+react@_9a094eedb3c3113d9864ac74301868d5/node_modules/@storybook/react-vite/dist'
import { courseI18NResources } from '@mai/course'
import { I18nProvider, initI18n } from '@mai/i18n'
import { settingsI18NResources } from '@mai/settings'
import { sidebarI18NResources } from '@mai/sidebar'
import type { ThemePreference } from '@mai/theme'
import { ThemeProvider } from '@mai/theme'
import { codeI18NResources } from '@mai-plugin/code'
import { theoryI18NResources } from '@mai-plugin/theory'
import { mocked, sb } from 'storybook/test'
import {
  sendSettingsDelete,
  sendSettingsGet,
  sendSettingsUpdate,
} from '../src/packages/settings/src/api/index.ts'

sb.mock(import('../src/packages/settings/src/api/index.ts'), { spy: true })
mocked(sendSettingsGet).mockResolvedValue(null)
mocked(sendSettingsDelete).mockResolvedValue(true)
mocked(sendSettingsUpdate).mockImplementation(async (domain, itemId, settings) => ({
  domain,
  itemId,
  settings,
  schemaVersion: 1,
  createdAt: 1,
  updatedAt: 1,
}))

initI18n({
  resources: {
    course: courseI18NResources,
    code: codeI18NResources,
    settings: settingsI18NResources,
    sidebar: sidebarI18NResources,
    theory: theoryI18NResources,
  },
})

const preview: Preview = {
  initialGlobals: {
    colorScheme: 'system',
  },

  globalTypes: {
    colorScheme: {
      name: 'Тема',
      description: 'Цветовая схема оформления',
      toolbar: {
        title: 'Тема',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'Системная', icon: 'browser' },
          { value: 'light', title: 'Светлая', icon: 'sun' },
          { value: 'dark', title: 'Тёмная', icon: 'moon' },
        ],
      },
    },
  },

  decorators: [
    (Story, context) => (
      <I18nProvider>
        <ThemeProvider theme={context.globals.colorScheme as ThemePreference}>
          <Story />
        </ThemeProvider>
      </I18nProvider>
    ),
  ],

  parameters: {
    layout: 'centered',

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
  },
}

export default preview
