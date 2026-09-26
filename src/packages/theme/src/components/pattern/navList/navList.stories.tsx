import { Icon } from '@mai/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { NavList, type NavListGroup } from './navList'

const groups: NavListGroup[] = [
  {
    id: 'system',
    title: 'Настройки',
    items: [
      { id: 'general', label: 'Общие', icon: <Icon name="settings" /> },
      { id: 'appearance', label: 'Оформление', icon: <Icon name="palette" /> },
      { id: 'editor', label: 'Редактор', icon: <Icon name="pencil" /> },
    ],
  },
  {
    id: 'plugins',
    title: 'Плагины',
    items: [
      { id: 'theory', label: 'Теория', icon: <Icon name="lightbulb" /> },
      { id: 'tasks', label: 'Задачи', icon: <Icon name="check" />, disabled: true },
    ],
  },
]

/**
 * NavList — вертикальный список навигации с группами и вложенными пунктами.
 * Активный пункт выделяется акцентной подложкой; disabled — недоступен.
 */
const meta = {
  title: 'UI/Pattern/NavList',
  component: NavList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Навигационный список: группы с заголовками, пункты с иконкой и подписью, вложенные подпункты. Активный пункт получает акцентную подложку и aria-current, отключённый — приглушается и не реагирует на выбор.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    groups,
    activeId: 'general',
    onSelect: fn(),
    ariaLabel: 'Разделы настроек',
  },
  argTypes: {
    groups: { control: 'object' },
    onSelect: { control: false },
  },
} satisfies Meta<typeof NavList>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Ни один пункт не активен. */
export const NoActive: Story = {
  args: { activeId: undefined },
}

/** Плоский список без заголовков групп. */
export const Flat: Story = {
  args: {
    groups: [{ items: groups.flatMap((group) => group.items) }],
  },
}

/** Вложенные пункты отображаются с отступом. */
export const Nested: Story = {
  args: {
    groups: [
      {
        title: 'Настройки',
        items: [
          { id: 'general', label: 'Общие', icon: <Icon name="settings" /> },
          {
            id: 'advanced',
            label: 'Дополнительно',
            icon: <Icon name="slidersHorizontal" />,
            children: [
              { id: 'network', label: 'Сеть' },
              { id: 'cache', label: 'Кэш' },
            ],
          },
        ],
      },
    ],
    activeId: 'network',
  },
}

const selectSpy = fn()

/** Отключённый пункт не выбирается и не является активным. */
export const Disabled: Story = {
  args: {
    activeId: 'tasks',
    onSelect: selectSpy,
    groups: [
      {
        title: 'Плагины',
        items: [{ id: 'tasks', label: 'Задачи', icon: <Icon name="check" />, disabled: true }],
      },
    ],
  },
  play: async ({ canvas }) => {
    const item = canvas.getByRole('button', { name: 'Задачи' })
    await userEvent.click(item)
    expect(item).toBeDisabled()
    expect(item).toHaveAttribute('data-active', 'false')
    await expect(selectSpy).not.toHaveBeenCalled()
  },
}
