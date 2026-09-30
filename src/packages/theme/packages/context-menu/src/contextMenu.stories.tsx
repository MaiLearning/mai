import { Icon } from '@mai/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, screen, userEvent } from 'storybook/test'
import { ContextMenu, useContextMenu } from './index'

interface ContextMenuDemoProps {
  onSelect?: () => void
  onDelete?: () => void
}

function ContextMenuDemo({ onSelect, onDelete }: ContextMenuDemoProps) {
  const { state, openFromEvent, openFromButton, close } = useContextMenu()

  return (
    <div style={{ display: 'grid', gap: 12, width: 380 }}>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <strong>Проектная заметка</strong>
        <button aria-label="Открыть меню" onClick={(event) => openFromButton(event)} type="button">
          <Icon aria-hidden="true" name="moreVertical" size={18} />
        </button>
      </div>
      <div
        data-testid="context-menu-area"
        onContextMenu={(event) => openFromEvent(event)}
        style={{ border: '1px dashed currentColor', borderRadius: 8, minHeight: 120, padding: 16 }}
        tabIndex={0}
      >
        Щёлкните здесь правой кнопкой мыши, чтобы открыть контекстное меню.
      </div>
      {state ? (
        <ContextMenu
          ariaLabel="Действия с заметкой"
          onClose={close}
          onDelete={onDelete}
          opened
          title="Заметка"
          x={state.x}
          y={state.y}
        >
          <ContextMenu.Header label="Файл" />
          <ContextMenu.Item
            icon={<Icon name="fileText" size={16} />}
            label="Открыть"
            onSelect={onSelect}
          />
          <ContextMenu.Item icon={<Icon name="pencil" size={16} />} label="Переименовать" />
          <ContextMenu.Separator />
          <ContextMenu.Sub icon={<Icon name="folderOpen" size={16} />} label="Переместить в">
            <ContextMenu.Item label="Входящие" />
            <ContextMenu.Item label="Архив" />
          </ContextMenu.Sub>
        </ContextMenu>
      ) : null}
    </div>
  )
}

const meta = {
  title: 'Theme/Packages/ContextMenu/ContextMenu',
  component: ContextMenuDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onSelect: fn(),
  },
  argTypes: {
    onSelect: { control: false, description: 'Вызывается после выбора действия.' },
    onDelete: { control: false, description: 'Показывает действие удаления в меню.' },
  },
} satisfies Meta<typeof ContextMenuDemo>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Встроенное действие удаления добавляет разделитель и пункт в конец меню. */
export const WithDelete: Story = {
  args: { onDelete: fn() },
}

/** ПКМ открывает меню; выбор пункта вызывает обработчик и закрывает его. */
export const Play: Story = {
  args: { onSelect: fn() },
  play: async ({ args }) => {
    fireEvent.contextMenu(screen.getByTestId('context-menu-area'), {
      clientX: 100,
      clientY: 100,
    })
    await expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('menuitem', { name: 'Открыть' }))
    await expect(args.onSelect).toHaveBeenCalled()
    await expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  },
}

/** Esc закрывает открытое контекстное меню. */
export const PlayEsc: Story = {
  play: async () => {
    fireEvent.contextMenu(screen.getByTestId('context-menu-area'), {
      clientX: 100,
      clientY: 100,
    })
    await expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  },
}
