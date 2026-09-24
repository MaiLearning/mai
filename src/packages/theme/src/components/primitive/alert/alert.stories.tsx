import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './alert'

/**
 * Alert — неблокирующее уведомление дизайн-системы Mai. Семантические
 * варианты (error/warning/info/success) маппятся на цветовые токены темы:
 * граница, текст и тематическая иконка слева берутся из одной палитры.
 * Фон прозрачный — уведомление не выделяется цветовым блоком.
 */
const meta = {
  title: 'UI/Primitive/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Неблокирующее уведомление. Семантические варианты берут из одной палитры границу, текст и тематическую иконку слева; фон прозрачный — alert не выделяется цветовым блоком.',
      },
    },
  },
  args: {
    children: 'Уведомление для пользователя.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Семантический вариант уведомления',
    },
    icon: { control: false, description: 'Своя иконка вместо иконки варианта' },
    hideIcon: { control: 'boolean', description: 'Скрыть иконку варианта' },
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Информационное уведомление — вариант по умолчанию. */
export const Info: Story = {
  args: {
    variant: 'info',
  },
}

/** Успешное завершение операции. */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Курс успешно сохранён.',
  },
}

/** Предупреждение — операция возможна, но есть нюансы. */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Несохранённые изменения будут потеряны.',
  },
}

/** Ошибка — действие не выполнено. */
export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Не удалось загрузить курс.',
  },
}

/** Все варианты рядом — для сравнения палитры. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, width: 420 }}>
      <Alert {...args} variant="info">
        Информация о структуре курса.
      </Alert>
      <Alert {...args} variant="success">
        Урок опубликован.
      </Alert>
      <Alert {...args} variant="warning">
        Урок ещё в черновике.
      </Alert>
      <Alert {...args} variant="error">
        Плагин не загрузился.
      </Alert>
    </div>
  ),
}

/** Без иконки — когда тематическая иконка не нужна. */
export const WithoutIcon: Story = {
  args: {
    hideIcon: true,
    children: 'Уведомление без иконки.',
  },
}

/** Своя иконка вместо тематической. */
export const CustomIcon: Story = {
  args: {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12M12 15l-4-4M12 15l4-4M5 21h14" />
      </svg>
    ),
    children: 'Доступна новая версия курса.',
  },
}
