import type { Meta, StoryObj } from '@storybook/react-vite'
import { Download, FolderPlus, Plus, Settings, Share2, Trash2 } from 'lucide-react'
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
]

const manyActions: SidebarAction[] = [
  ...actions,
  {
    id: 'export',
    label: 'Экспорт',
    icon: <Download size={16} strokeWidth={1.5} />,
    variant: 'ghost',
    onSelect: fn(),
  },
  {
    id: 'share',
    label: 'Поделиться',
    icon: <Share2 size={16} strokeWidth={1.5} />,
    variant: 'ghost',
    onSelect: fn(),
  },
  {
    id: 'settings',
    label: 'Настройки',
    icon: <Settings size={16} strokeWidth={1.5} />,
    variant: 'ghost',
    disabled: true,
    onSelect: fn(),
  },
  {
    id: 'remove',
    label: 'Удалить курс',
    icon: <Trash2 size={16} strokeWidth={1.5} />,
    variant: 'ghost',
    onSelect: fn(),
  },
]

/**
 * SidebarActions — панель действий курса: первые `maxVisible` рендерятся
 * кнопками, остальные складываются в overflow-меню за «…».
 */
const meta = {
  title: 'Sidebar/SidebarActions',
  component: SidebarActions,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 288, padding: 8 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    actions,
    maxVisible: 2,
  },
} satisfies Meta<typeof SidebarActions>

export default meta

type Story = StoryObj<typeof meta>

/** Два действия — обе кнопки видны, меню отсутствует. */
export const TwoButtons: Story = {}

/** Много действий: лишние уезжают в overflow-меню за «…». */
export const OverflowMenu: Story = {
  args: { actions: manyActions },
}

/** `maxVisible = 1`: в меню сразу два действия. */
export const MaxVisibleOne: Story = {
  args: { actions: manyActions, maxVisible: 1 },
}

/** Варианты кнопок: primary (заливка) и ghost (прозрачная). */
export const Variants: Story = {
  args: {
    actions: [actions[0], { ...actions[1], id: 'variant-ghost', label: 'Действие' }],
  },
}

/** Отключённое действие нельзя запустить. */
export const Disabled: Story = {
  args: {
    actions: [
      { ...actions[0], id: 'disabled-primary', disabled: true },
      { ...actions[1], id: 'disabled-ghost', disabled: true },
    ],
  },
}

/** Пустая панель — ничего не рендерится. */
export const Empty: Story = {
  args: { actions: [] },
}
