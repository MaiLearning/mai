import { Text } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpen, Monitor, Puzzle, Settings, User } from 'lucide-react'
import { fn } from 'storybook/test'
import { SettingsLayout } from './SettingsLayout'
import { SettingsNav, type SettingsNavItem } from './SettingsNav'

const items: SettingsNavItem[] = [
  {
    id: 'general',
    label: 'Общие',
    icon: <Settings size={16} />,
    children: [
      { id: 'system', label: 'Системные', icon: <Monitor size={16} /> },
      { id: 'profile', label: 'Профиль', icon: <User size={16} /> },
    ],
  },
  { id: 'courses', label: 'Курсы', icon: <BookOpen size={16} /> },
  { id: 'plugins', label: 'Плагины', icon: <Puzzle size={16} /> },
]

const meta = {
  title: 'Settings/Layout/SettingsLayout',
  component: SettingsLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    nav: <SettingsNav items={items} activeId="system" onSelect={fn()} />,
    children: <Text size="sm">Содержимое выбранного пункта настроек.</Text>,
  },
  argTypes: {
    nav: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof SettingsLayout>

export default meta

type Story = StoryObj<typeof meta>

/** Навигация слева, содержимое справа. */
export const Default: Story = {}
