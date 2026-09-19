import type { Meta, StoryObj } from '@storybook/react-vite'
import { FolderPlus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { fn } from 'storybook/test'
import type { CourseNode, SidebarAction } from '../model/types'
import { CourseSidebar } from './CourseSidebar'

const nodes: CourseNode[] = [
  {
    id: 'folder-intro',
    type: 'folder',
    title: 'Введение',
    children: [
      { id: 'res-what', type: 'resource', title: 'Что такое Mai' },
      { id: 'res-setup', type: 'resource', title: 'Установка и запуск', badge: '12 мин' },
    ],
  },
  {
    id: 'res-react',
    type: 'resource',
    title: 'Основы React',
    badge: 'Черновик',
    badgeTone: 'success',
  },
  {
    id: 'folder-advanced',
    type: 'folder',
    title: 'Продвинутый уровень',
    children: [
      { id: 'res-hooks', type: 'resource', title: 'Хуки', badge: '34 мин' },
      {
        id: 'folder-perf',
        type: 'folder',
        title: 'Оптимизация',
        children: [{ id: 'res-memo', type: 'resource', title: 'memo и useMemo' }],
      },
    ],
  },
  { id: 'res-outro', type: 'resource', title: 'Заключение' },
]

const toolbarActions: SidebarAction[] = [
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

/** Рамка фиксированной высоты: сайдбар занимает 100% высоты родителя. */
function SidebarFrame({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', height: 560 }}>{children}</div>
}

/**
 * CourseSidebar — презентационный сайдбар структуры курса: заголовок
 * с авто-статистикой, поиск, деревья «папки + ресурсы» и панель действий.
 */
const meta = {
  title: 'sidebar/CourseSidebar',
  component: CourseSidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarFrame>
        <Story />
      </SidebarFrame>
    ),
  ],
  args: {
    courseTitle: 'Разработка на React',
    nodes,
    actions: toolbarActions,
    defaultExpandedIds: ['folder-intro', 'folder-advanced', 'folder-perf'],
    onSelect: fn(),
    onMove: fn(),
    onRenameStart: fn(),
    onRenameCommit: fn(),
    onRenameCancel: fn(),
    onDeleteRequest: fn(),
    onNodeContextMenu: fn(),
  },
} satisfies Meta<typeof CourseSidebar>

export default meta

type Story = StoryObj<typeof meta>

/** Полный сайдбар: заголовок, авто-статистика, поиск, развёрнутое дерево и действия. */
export const Default: Story = {}

/** Подпись курса (автор, поток, статус) вместо авто-статистики. */
export const WithSubtitle: Story = {
  args: {
    courseSubtitle: 'Антон · группа 42 · черновик',
  },
}

/** Пустая структура — приглашение создать первый узел. */
export const Empty: Story = {
  args: { nodes: [] },
}

/** Сайдбар без панели действий — только структура. */
export const WithoutActions: Story = {
  args: { actions: [] },
}

/** Поиск по структуре отключён. */
export const WithoutSearch: Story = {
  args: { searchable: false },
}

/** Без drag-and-drop: строки не перетаскиваются. */
export const WithoutDnd: Story = {
  args: { draggable: false },
}

/** Выделенный узел дерева. */
export const Selected: Story = {
  args: { selectedId: 'res-hooks' },
}

/** Метка курса становится ссылкой на обзор курса. */
export const WithHomeLink: Story = {
  args: { courseHomeHref: '/course/demo' },
}
