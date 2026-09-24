import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpen, Monitor, Puzzle, Settings, User } from 'lucide-react'
import { fn } from 'storybook/test'
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
  title: 'Settings/Layout/SettingsNav',
  component: SettingsNav,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    items,
    activeId: 'system',
    onSelect: fn(),
    ariaLabel: 'Разделы настроек',
  },
  argTypes: {
    items: { control: 'object' },
    onSelect: { control: false },
  },
} satisfies Meta<typeof SettingsNav>

export default meta

type Story = StoryObj<typeof meta>

/** Вложенные пункты (разделы с подпунктами). */
export const Default: Story = {}

/** Ни один пункт не активен. */
export const NoActive: Story = {
  args: { activeId: undefined },
}

/** Плоский список без вложенности. */
export const Flat: Story = {
  args: { items: items.map(({ children: _children, ...item }) => item) },
}
