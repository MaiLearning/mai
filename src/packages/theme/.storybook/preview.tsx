import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/base/provider'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Тема Storybook',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={context.globals.theme ?? 'light'}>
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
