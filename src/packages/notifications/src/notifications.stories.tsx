import { Button } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  NotificationsHost,
  notifyConflict,
  notifyError,
  notifyInfo,
  notifyLoading,
  notifyPromise,
  notifySuccess,
} from './index'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function failing(ms: number): Promise<never> {
  return delay(ms).then(() => {
    throw new Error('Сеть недоступна')
  })
}

/** Демо-панель: кнопки запускают уведомления через публичный API пакета. */
function NotificationsDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 560 }}>
      <Button onClick={() => notifySuccess('Курс сохранён', 'Изменения применены.')}>
        success
      </Button>
      <Button
        variant="secondary"
        onClick={() => notifyError('Не удалось загрузить курс', 'Сервер вернул ошибку.')}
      >
        error
      </Button>
      <Button
        variant="secondary"
        onClick={() => notifyConflict('Конфликт версий', 'Курс изменён в другой сессии.')}
      >
        warning
      </Button>
      <Button variant="secondary" onClick={() => notifyInfo('Доступна новая версия')}>
        info
      </Button>
      <Button variant="outline" onClick={() => notifyLoading('Импорт курса…')}>
        loading
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          notifyPromise(delay(2000), {
            loading: 'Экспорт курса…',
            success: 'Курс экспортирован',
            error: 'Экспорт не удался',
          })
        }
      >
        promise
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          notifyError({
            title: 'Не удалось удалить ресурс',
            message: 'Файл занят другим процессом.',
            closeButton: true,
            action: { label: 'Повторить', onClick: () => notifySuccess('Повторено') },
          })
        }
      >
        action + close
      </Button>
      <NotificationsHost />
    </div>
  )
}

/**
 * Интерактивная площадка уведомлений: каждый вид запускается кнопкой,
 * `NotificationsHost` смонтирован рядом со сценой.
 */
const meta = {
  title: 'Notifications/Playground',
  component: NotificationsDemo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NotificationsDemo>

export default meta

type Story = StoryObj<typeof meta>

/** Все виды уведомлений по кнопкам. */
export const Playground: Story = {}

/** Несколько уведомлений в стеке одновременно. */
export const Stacked: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        onClick={() => {
          notifySuccess('Курс сохранён')
          notifyInfo('Доступна новая версия')
          notifyConflict('Конфликт версий', 'Курс изменён в другой сессии.')
          notifyError('Не удалось загрузить ресурс')
        }}
      >
        Показать стек
      </Button>
      <NotificationsHost />
    </div>
  ),
}

/** Промис-операция: загрузка переходит в успех. */
export const PromiseSuccess: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        onClick={() =>
          notifyPromise(
            delay(1500).then(() => '42 узла'),
            {
              loading: 'Синхронизация структуры…',
              success: (data) => `Синхронизация завершена: ${data}`,
              error: 'Синхронизация не удалась',
            },
          )
        }
      >
        promise → success
      </Button>
      <NotificationsHost />
    </div>
  ),
}

/** Промис-операция: загрузка переходит в ошибку. */
export const PromiseError: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        variant="secondary"
        onClick={() =>
          notifyPromise(failing(1500), {
            loading: 'Экспорт курса…',
            success: 'Курс экспортирован',
            error: (error) => (error instanceof Error ? error.message : 'Экспорт не удался'),
          }).catch(() => {})
        }
      >
        promise → error
      </Button>
      <NotificationsHost />
    </div>
  ),
}
