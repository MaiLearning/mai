import type { Preview } from '.pnpm/@storybook+react-vite@10.6.0_@types+react-dom@19.3.0_@types+react@19.3.0__@types+react@_9a094eedb3c3113d9864ac74301868d5/node_modules/@storybook/react-vite/dist'
import { courseI18NResources } from '@mai/course'
import { initI18n } from '@mai/i18n'
import { sidebarI18NResources } from '@mai/sidebar'
import type { ThemePreference } from '@mai/theme'
import { ThemeProvider } from '@mai/theme'

/** Инициализация i18next для пакетных компонентов (idempotent). */
initI18n({
  resources: { course: courseI18NResources, sidebar: sidebarI18NResources },
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
      <ThemeProvider theme={context.globals.colorScheme as ThemePreference}>
        <Story />
      </ThemeProvider>
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
