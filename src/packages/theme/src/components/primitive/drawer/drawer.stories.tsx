import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Button } from '../button/button'
import { Drawer, type DrawerProps } from './drawer'

/**
 * Drawer — выезжающая панель поверх приложения. Общий с `Modal` механизм:
 * портал в body, блокировка скролла, focus-trap, закрытие по Esc/оверлею.
 */
const meta = {
  title: 'UI/Primitive/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Выезжающая панель (right/left/bottom) на общем с Modal overlay-механизме: портал в body, ловушка фокуса, закрытие по Esc/оверлею/кнопке, блокировка скролла. Тело прокручивается, футер фиксирован. Управляется пропом `opened`.',
      },
    },
  },
  args: {
    opened: true,
    onClose: fn(),
    title: 'Настройки',
    children: 'Содержимое панели настроек.',
  },
  argTypes: {
    opened: { control: 'boolean', description: 'Показывает или скрывает панель.' },
    side: {
      control: 'select',
      options: ['right', 'left', 'bottom'],
      description: 'Сторона выезда панели.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Размер панели: ширина (right/left) или высота (bottom).',
    },
    dismissible: {
      control: 'boolean',
      description: 'Разрешает закрытие по Esc, оверлею и кнопке.',
    },
    onClose: { action: 'close', description: 'Вызывается при закрытии панели.' },
  },
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

/** Панель справа — базовый сценарий настроек. */
export const Basic: Story = {
  play: async ({ args }) => {
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}

/** Панель слева. */
export const Left: Story = {
  args: { side: 'left' },
}

/** Нижняя шторка (bottom sheet). */
export const Bottom: Story = {
  args: { side: 'bottom', size: 'md' },
}

/** Во всю ширину/высоту окна. */
export const Full: Story = {
  args: { size: 'full' },
}

/** С футером действий. */
export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button variant="ghost" onClick={fn()}>
          Отмена
        </Button>
        <Button onClick={fn()}>Сохранить</Button>
      </>
    ),
  },
}

/** Неотключаемая панель: без крестика, Esc и клик по оверлею не закрывают. */
export const NotDismissible: Story = {
  args: {
    dismissible: false,
    children: 'Панель нельзя закрыть, пока операция выполняется.',
  },
}

/** Закрытое состояние — ничего не рендерится. */
export const Closed: Story = {
  args: { opened: false },
}

function DrawerPlayground(props: DrawerProps) {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Button onClick={() => setOpened(true)}>Открыть панель</Button>
      <Drawer {...props} opened={opened} onClose={() => setOpened(false)} />
    </>
  )
}

/** Живой сценарий: открытие кнопкой и закрытие крестиком (локальный стейт). */
export const Interactive: Story = {
  render: (args) => <DrawerPlayground {...args} />,
  args: { opened: false },
}
