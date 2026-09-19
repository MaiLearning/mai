import { I18nProvider, initI18n } from '@mai/i18n'
import { ThemeProvider } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { homeI18NResources } from '../../locales'
import { HomeShell } from './HomeShell'

initI18n({ resources: { home: homeI18NResources } })

const meta = {
  title: 'Pages/Home/HomeShell',
  component: HomeShell,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <I18nProvider>
          <Story />
        </I18nProvider>
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  args: {
    // TODO: мок пользователя — заменить реальными данными, когда появится модель
    userName: 'Алексей',
    userInitials: 'АК',
    children: <div style={{ marginTop: 28, color: '#64748b' }}>Контент страницы</div>,
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof HomeShell>

export default meta
type Story = StoryObj<typeof meta>

/** Каркас главной: сайдбар, приветствие, слот контента. */
export const Default: Story = {}
