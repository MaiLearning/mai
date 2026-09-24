import { Icon } from '@mai/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Button } from './button'

/**
 * Button — кнопка действия дизайн-системы Mai. Пять размеров, пять
 * визуальных вариантов, состояния disabled/loading/selected и иконки
 * до, после или вместо текста. Клик — стандартный `onClick`.
 */
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

const icon = (children: ReactNode) => <Icon>{children}</Icon>

const meta = {
  title: 'UI/Primitive/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Кнопка запускает действие и поддерживает пять размеров, пять визуальных вариантов, состояния disabled, loading и selected, а также иконки до, после или вместо текста.',
      },
    },
  },
  args: {
    children: 'Сохранить',
    size: 'md',
    variant: 'primary',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Размер кнопки.',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'outline'],
      description: 'Визуальный вариант кнопки.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает взаимодействие с кнопкой.',
    },
    loading: {
      control: 'boolean',
      description: 'Показывает индикатор загрузки и блокирует кнопку.',
    },
    selected: {
      control: 'boolean',
      description: 'Отображает кнопку как выбранную и выставляет aria-pressed.',
    },
    children: {
      control: 'text',
      description: 'Текст кнопки.',
    },
    onlyIcon: {
      control: false,
      description: 'Иконка без текста. Для доступности добавьте aria-label.',
    },
    startIcon: {
      control: false,
      description: 'Иконка перед текстом.',
    },
    endIcon: {
      control: false,
      description: 'Иконка после текста.',
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button>Обычная</Button>
      <Button disabled>Отключена</Button>
      <Button loading>Загрузка</Button>
      <Button selected>Выбрана</Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button startIcon={icon(<PlusIcon />)}>Создать</Button>
      <Button endIcon={icon(<ArrowRightIcon />)}>Продолжить</Button>
      <Button startIcon={icon(<PlusIcon />)} endIcon={icon(<ArrowRightIcon />)}>
        Добавить
      </Button>
      <Button onlyIcon={icon(<PlusIcon />)} aria-label="Добавить" />
    </div>
  ),
}

export const Toggle: Story = {
  render: function ToggleStory() {
    const [selected, setSelected] = useState(false)

    return (
      <Button
        selected={selected}
        startIcon={icon(selected ? <CheckIcon /> : <PlusIcon />)}
        onClick={() => setSelected((value) => !value)}
      >
        {selected ? 'Включено' : 'Выключено'}
      </Button>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Пример управляемого selected-состояния для кнопки Enable/Disable.',
      },
    },
  },
}

/** Клик по кнопке вызывает onClick. */
export const Play: Story = {
  args: {
    children: 'Нажми меня',
    onClick: fn(),
  },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Нажми меня' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
