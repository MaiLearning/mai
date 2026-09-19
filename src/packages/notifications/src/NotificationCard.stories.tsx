import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotificationCard } from './NotificationCard'

/**
 * NotificationCard — содержимое уведомления дизайн-системы Mai: иконка
 * семантического варианта, заголовок, поясняющий текст, кнопка действия
 * и закрытие. Рендерится внутри sonner через `toast.custom`, поэтому
 * закрывается через `toast.dismiss(id)`.
 */
const meta = {
  title: 'Notifications/NotificationCard',
  component: NotificationCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    id: 'story',
    variant: 'info',
    title: 'Уведомление для пользователя',
    message: 'Поясняющий текст под заголовком.',
  },
  argTypes: {
    id: { control: false },
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info', 'loading'],
      description: 'Семантический вариант уведомления',
    },
    action: { control: false, description: 'Кнопка действия' },
    closeButton: { control: 'boolean', description: 'Показывать кнопку закрытия' },
  },
} satisfies Meta<typeof NotificationCard>

export default meta

type Story = StoryObj<typeof meta>

/** Успешное завершение операции. */
export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Курс сохранён',
    message: 'Изменения применены.',
  },
}

/** Ошибка — действие не выполнено. */
export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Не удалось загрузить курс',
    message: 'Сервер вернул ошибку.',
  },
}

/** Предупреждение — конфликт или нюанс. */
export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Конфликт версий',
    message: 'Курс изменён в другой сессии.',
  },
}

/** Информационное сообщение — вариант по умолчанию. */
export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Доступна новая версия',
    message: 'Обновите приложение, чтобы получить изменения.',
  },
}

/** Загрузка — уведомление держится до завершения операции. */
export const Loading: Story = {
  args: {
    variant: 'loading',
    title: 'Импорт курса…',
    message: 'Это может занять несколько секунд.',
  },
}

/** Только заголовок, без поясняющего текста. */
export const TitleOnly: Story = {
  args: {
    message: undefined,
    title: 'Файл удалён',
  },
}

/** Длинный текст: заголовок и сообщение переносятся по строкам. */
export const LongText: Story = {
  args: {
    title: 'Не удалось синхронизировать структуру курса с внешним хранилищем',
    message:
      'Проверьте подключение к сети и повторите попытку. Если ошибка повторяется, обратитесь к администратору.',
  },
}

/** Кнопка действия, например «Повторить». */
export const WithAction: Story = {
  args: {
    variant: 'error',
    title: 'Не удалось сохранить ресурс',
    message: 'Повторите попытку.',
    action: { label: 'Повторить', onClick: () => {} },
  },
}

/** Кнопка закрытия. */
export const WithClose: Story = {
  args: {
    closeButton: true,
  },
}

/** Действие и закрытие вместе. */
export const WithActionAndClose: Story = {
  args: {
    variant: 'warning',
    title: 'Несохранённые изменения',
    message: 'Закрыть без сохранения?',
    closeButton: true,
    action: { label: 'Сохранить', onClick: () => {} },
  },
}

/** Все варианты рядом — для сравнения палитры. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, width: 420 }}>
      <NotificationCard {...args} id="success" variant="success" title="Курс сохранён" />
      <NotificationCard {...args} id="error" variant="error" title="Не удалось загрузить курс" />
      <NotificationCard {...args} id="warning" variant="warning" title="Конфликт версий" />
      <NotificationCard {...args} id="info" variant="info" title="Доступна новая версия" />
      <NotificationCard {...args} id="loading" variant="loading" title="Импорт курса…" />
    </div>
  ),
}
