import { Icon, Text } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { fn } from 'storybook/test'
import { SettingsLayout } from './SettingsLayout'
import { SettingsNav, type SettingsNavGroup } from './SettingsNav'

const groups: SettingsNavGroup[] = [
  {
    id: 'system',
    title: 'Настройки',
    items: [
      {
        id: 'general',
        label: 'Общие',
        icon: <Icon name="settings" />,
        children: [
          { id: 'system', label: 'Системные', icon: <Icon name="monitor" /> },
          { id: 'profile', label: 'Профиль', icon: <Icon name="user" /> },
        ],
      },
      { id: 'courses', label: 'Курсы', icon: <Icon name="bookOpen" /> },
    ],
  },
  {
    id: 'plugins',
    title: 'Плагины',
    items: [{ id: 'plugins', label: 'Плагины', icon: <Icon name="puzzle" /> }],
  },
]

const meta = {
  title: 'Settings/Layout/SettingsLayout',
  component: SettingsLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    nav: <SettingsNav groups={groups} activeId="system" onSelect={fn()} />,
    children: <Text size="sm">Содержимое выбранного пункта настроек.</Text>,
  },
  argTypes: {
    nav: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof SettingsLayout>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Рамка стори: её ширина выбирает ветку раскладки каркаса, потому что порог
 * задан контейнерным запросом и считается от ширины контейнера, а не окна.
 */
function frame(width: number, story: ReactNode) {
  return <div style={{ width }}>{story}</div>
}

/** Панель: навигация слева, содержимое справа. */
export const Default: Story = {
  render: (args) => frame(960, <SettingsLayout {...args} />),
}

/** Узкая раскладка: навигация над содержимым, ширина колонки не участвует. */
export const Narrow: Story = {
  render: (args) => frame(480, <SettingsLayout {...args} />),
}
