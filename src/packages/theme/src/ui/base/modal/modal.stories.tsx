import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Button } from '../button/button'
import type { ModalProps } from './modal'
import { Modal } from './modal'

/**
 * Modal — модальное окно дизайн-системы Mai. Портал в body, ловушка фокуса,
 * закрытие по Esc/оверлею/кнопке, блокировка скролла. Управляется пропом
 * `opened`, поэтому в живом коде состояние держит вызывающий компонент.
 */
const meta = {
  title: 'Theme/Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Модальное окно. Портал в body, ловушка фокуса, закрытие по Esc/оверлею/кнопке, блокировка скролла. Управляется пропом `opened` — состояние держит вызывающий компонент.',
      },
    },
  },
  args: {
    opened: true,
    onClose: fn(),
    title: 'Подтверждение',
    children: 'Вы уверены, что хотите удалить этот урок? Действие необратимо.',
  },
  argTypes: {
    opened: {
      control: 'boolean',
      description: 'Показывает или скрывает модальное окно.',
    },
    dismissible: {
      control: 'boolean',
      description: 'Разрешает закрытие по Esc, оверлею и кнопке.',
    },
    width: {
      control: { type: 'number', min: 280, max: 960, step: 20 },
      description: 'Максимальная ширина панели в пикселях.',
    },
    onClose: {
      action: 'close',
      description: 'Вызывается при закрытии окна.',
    },
  },
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

/** Базовое окно: заголовок, текст, закрытие по Esc/оверлею/крестику. */
export const Basic: Story = {
  play: async ({ args }) => {
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Закрыть' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}

/** С футером — действия вызывающего экрана, а не только крестик. */
export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button variant="ghost" onClick={fn()}>
          Отмена
        </Button>
        <Button variant="danger" onClick={fn()}>
          Удалить
        </Button>
      </>
    ),
  },
}

/** Неотключаемое окно: без крестика, Esc и клик по оверлею не закрывают. */
export const NotDismissible: Story = {
  args: {
    dismissible: false,
    title: 'Идёт сохранение',
    children: 'Пожалуйста, подождите — окно закроется автоматически.',
  },
}

/** Своё значение ширины через проп `width` (px). */
export const CustomWidth: Story = {
  args: {
    width: 420,
    title: 'Короткое окно',
  },
}

/** Окно без заголовка — контент рендерится напрямую в панель. */
export const WithoutTitle: Story = {
  args: {
    title: undefined,
    children: <p>Произвольное содержимое без шапки.</p>,
  },
}

/** Закрытое состояние — ничего не рендерится. */
export const Closed: Story = {
  args: {
    opened: false,
  },
}

function ModalPlayground(props: ModalProps) {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Button onClick={() => setOpened(true)}>Открыть модалку</Button>
      <Modal {...props} opened={opened} onClose={() => setOpened(false)} />
    </>
  )
}

/** Живой сценарий: открытие кнопкой и закрытие крестиком (локальный стейт). */
export const Interactive: Story = {
  render: (args) => <ModalPlayground {...args} />,
  args: {
    opened: false,
  },
}
