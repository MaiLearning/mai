import type { Meta, StoryObj } from '@storybook/react-vite'
import { Copy, Download, FolderPlus, Plus } from 'lucide-react'
import { fn } from 'storybook/test'
import type { SidebarAction } from '../model/types'
import { SidebarActions } from './SidebarActions'

const actions: SidebarAction[] = [
  {
    id: 'create-resource',
    label: 'Ресурс',
    icon: <Plus size={16} strokeWidth={1.5} />,
    variant: 'primary',
    onSelect: fn(),
  },
  {
    id: 'create-folder',
    label: 'Папка',
    icon: <FolderPlus size={16} strokeWidth={1.5} />,
    variant: 'ghost',
    onSelect: fn(),
  },
  {
    id: 'duplicate',
    label: 'Дублировать',
    icon: <Copy size={16} strokeWidth={1.5} />,
    variant: 'ghost',
    onSelect: fn(),
  },
  {
    id: 'export',
    label: 'Экспорт',
    icon: <Download size={16} strokeWidth={1.5} />,
    variant: 'ghost',
    onSelect: fn(),
  },
]
const meta = {
  title: 'Sidebar/SidebarActions',
  component: SidebarActions,
  tags: ['autodocs'],
  args: {
    actions,
    maxVisible: 2,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 288, display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarActions>

export default meta
type Story = StoryObj<typeof meta>

/** Две видимые кнопки + overflow-меню (нажмите «…»). */
export const Default: Story = {}

/** Все действия видимы — overflow скрыт. */
export const AllVisible: Story = {
  args: {
    maxVisible: 4,
  },
}

/** Только одно видимое, три в overflow. */
export const OneVisible: Story = {
  args: {
    maxVisible: 1,
  },
}

/** Действия без иконок — fallback на PlusIcon. */
export const NoIcons: Story = {
  args: {
    actions: [
      { id: 'a1', label: 'Действие 1', variant: 'primary', onSelect: fn() },
      { id: 'a2', label: 'Действие 2', variant: 'ghost', onSelect: fn() },
      { id: 'a3', label: 'Действие 3', variant: 'ghost', onSelect: fn() },
    ],
  },
}

/** Отключённые действия. */
export const Disabled: Story = {
  args: {
    actions: [
      {
        id: 'create-resource',
        label: 'Ресурс',
        icon: <Plus size={16} strokeWidth={1.5} />,
        variant: 'primary',
        disabled: true,
        onSelect: fn(),
      },
      {
        id: 'create-folder',
        label: 'Папка',
        icon: <FolderPlus size={16} strokeWidth={1.5} />,
        variant: 'ghost',
        onSelect: fn(),
      },
    ],
  },
}

/** Пустой список действий. */
export const Empty: Story = {
  args: {
    actions: [],
  },
}
