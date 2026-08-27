import type { Meta, StoryObj } from '@storybook/react-vite'
import { Copy, FileInput, Pen } from 'lucide-react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { ContextMenu } from './ContextMenu'
import { useContextMenu } from './useContextMenu'

/**
 * Обёртка-демо: правый клик по строке открывает меню у курсора,
 * действия показывают полные возможности API (подменю, hotkey, danger, onDelete).
 */
function MenuDemo() {
  const menu = useContextMenu()
  const [lastAction, setLastAction] = useState('—')

  return (
    <div
      style={{
        height: 320,
        display: 'grid',
        placeItems: 'center',
        color: 'var(--demo-muted, #8b91a3)',
        userSelect: 'none',
      }}
      onContextMenu={(event) => menu.openFromEvent(event, 'demo-node')}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0 }}>Правый клик по этой области откроет меню.</p>
        <p style={{ margin: '8px 0 0', fontWeight: 600 }}>
          Последнее действие: <span data-testid="last-action">{lastAction}</span>
        </p>
      </div>

      {menu.state ? (
        <ContextMenu
          opened
          x={menu.state.x}
          y={menu.state.y}
          onClose={menu.close}
          onDelete={() => setLastAction('удалено')}
        >
          <ContextMenu.Item
            label="Переименовать"
            icon={<Pen size={16} />}
            hotkey="F2"
            onSelect={() => setLastAction('переименовано')}
          />
          <ContextMenu.Item
            label="Дублировать"
            icon={<Copy size={16} />}
            hotkey="Ctrl+D"
            onSelect={() => setLastAction('дублировано')}
          />
          <ContextMenu.Sub label="Переместить в" icon={<FileInput size={16} />}>
            <ContextMenu.Item
              label="Введение"
              onSelect={() => setLastAction('перемещено → Введение')}
            />
            <ContextMenu.Item
              label="Продвинутые темы"
              onSelect={() => setLastAction('перемещено → Продвинутые темы')}
            />
            <ContextMenu.Separator />
            <ContextMenu.Header label="Недоступно" />
            <ContextMenu.Item label="Корень курса" disabled />
          </ContextMenu.Sub>
        </ContextMenu>
      ) : null}
    </div>
  )
}

const meta = {
  title: 'Features/ContextMenu',
  component: MenuDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof MenuDemo>

export default meta

type Story = StoryObj<typeof MenuDemo>

/** Полный набор возможностей: подменю, горячие клавиши, встроенное удаление. */
export const Default: Story = {
  args: {},
}

/**
 * Минимальное меню без delete-настройки: только действия потребителя.
 */
export const WithoutDelete: Story = {
  render: () => {
    function Minimal() {
      const menu = useContextMenu()

      return (
        <div
          style={{ height: 320, display: 'grid', placeItems: 'center', color: '#8b91a3' }}
          onContextMenu={(event) => menu.openFromEvent(event)}
        >
          Меню без встроенного удаления (правый клик)
          {menu.state ? (
            <ContextMenu opened x={menu.state.x} y={menu.state.y} onClose={menu.close}>
              <ContextMenu.Item label="Открыть" onSelect={fn()} />
              <ContextMenu.Item label="Скрыть" disabled />
            </ContextMenu>
          ) : null}
        </div>
      )
    }

    return <Minimal />
  },
}
