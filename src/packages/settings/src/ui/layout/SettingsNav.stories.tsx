import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpen, Monitor, Puzzle, Settings, User } from 'lucide-react'
import { expect, fn, userEvent } from 'storybook/test'
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

const disabledItems: SettingsNavItem[] = [
  { id: 'theory', label: 'Теория', icon: <Puzzle size={16} />, disabled: true },
  { id: 'tasks', label: 'Задачи', icon: <BookOpen size={16} /> },
]
const disabledSelect = fn()

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

export const Disabled: Story = {
  args: {
    items: disabledItems,
    activeId: 'theory',
    onSelect: disabledSelect,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Теория' })
    await userEvent.click(button)
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-active', 'false')
    await expect(disabledSelect).not.toHaveBeenCalled()
  },
}
