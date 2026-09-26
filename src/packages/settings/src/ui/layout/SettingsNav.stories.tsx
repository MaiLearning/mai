import { Icon } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
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

const disabledGroups: SettingsNavGroup[] = [
  {
    title: 'Плагины',
    items: [
      { id: 'theory', label: 'Теория', icon: <Icon name="puzzle" />, disabled: true },
      { id: 'tasks', label: 'Задачи', icon: <Icon name="bookOpen" /> },
    ],
  },
]
const disabledSelect = fn()

const meta = {
  title: 'Settings/Layout/SettingsNav',
  component: SettingsNav,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    groups,
    activeId: 'system',
    onSelect: fn(),
    ariaLabel: 'Разделы настроек',
  },
  argTypes: {
    groups: { control: 'object' },
    onSelect: { control: false },
  },
} satisfies Meta<typeof SettingsNav>

export default meta

type Story = StoryObj<typeof meta>

/** Группы с заголовками и вложенные пункты (разделы с подпунктами). */
export const Default: Story = {}

/** Ни один пункт не активен. */
export const NoActive: Story = {
  args: { activeId: undefined },
}

/** Плоский список без вложенности. */
export const Flat: Story = {
  args: {
    groups: [
      {
        items: groups
          .flatMap((group) => group.items)
          .map(({ children: _children, ...item }) => item),
      },
    ],
  },
}

export const Disabled: Story = {
  args: {
    groups: disabledGroups,
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
