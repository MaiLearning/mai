import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TextColor } from '../../foundation/text/text'
import { Link } from './link'

const colors: TextColor[] = [
  'primary',
  'muted',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
]

/**
 * Link — ссылка навигации дизайн-системы Mai. По умолчанию — акцентный
 * цвет с подчёркиванием при наведении; внешние ссылки (http*) получают
 * `target="_blank"` и `rel="noreferrer"`.
 */
const meta = {
  title: 'UI/Primitive/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Ссылка навигации: цвет из токенов темы, режим подчёркивания (всегда / при наведении / никогда). Внешние ссылки автоматически открываются в новой вкладке.',
      },
    },
  },
  args: {
    children: 'Открыть курс',
    href: '#',
    color: 'accent',
    underline: 'hover',
  },
  argTypes: {
    color: { control: 'select', options: colors, description: 'Цвет текста ссылки.' },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'none'],
      description: 'Режим подчёркивания: всегда / при наведении / никогда.',
    },
    children: { control: 'text', description: 'Текст ссылки.' },
    href: { control: 'text', description: 'Адрес перехода.' },
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Режимы подчёркивания. */
export const Underline: Story = {
  args: { href: '#', color: 'accent' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Link {...args} underline="always">
        always — подчёркнута всегда
      </Link>
      <Link {...args} underline="hover">
        hover — подчёркнута при наведении
      </Link>
      <Link {...args} underline="none">
        none — без подчёркивания
      </Link>
    </div>
  ),
}

/** Семантические цвета ссылки. */
export const Colors: Story = {
  args: { href: '#' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      {colors.map((color) => (
        <Link key={color} {...args} color={color} underline="always">
          {`${color} — ссылка`}
        </Link>
      ))}
    </div>
  ),
}

/** Внешняя ссылка открывается в новой вкладке. */
export const External: Story = {
  args: {
    href: 'https://example.com',
    children: 'Внешняя ссылка (target="_blank")',
  },
}
