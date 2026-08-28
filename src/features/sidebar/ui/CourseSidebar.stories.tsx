import type { Meta, StoryObj } from '@storybook/react-vite'
import { FolderPlus, Plus } from 'lucide-react'
import { MemoryRouter } from 'react-router-dom'
import { fn } from 'storybook/test'
import { emptyTree, mockTree } from '../__mocks__/tree-mock'
import type { SidebarAction } from '../model/types'
import { CourseSidebar } from './CourseSidebar'

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
    variant: 'ghost',
    onSelect: fn(),
  },
  {
    id: 'export',
    label: 'Экспорт',
    variant: 'ghost',
    onSelect: fn(),
  },
]
const meta = {
  title: 'Sidebar/CourseSidebar',
  component: CourseSidebar,
  tags: ['autodocs'],
  args: {
    courseTitle: 'React Basics',
    courseSubtitle: undefined,
    nodes: mockTree,
    actions,
    maxVisibleActions: 2,
    selectedId: null,
    defaultExpandedIds: ['folder-intro', 'folder-hooks'],
    searchable: true,
    draggable: true,
    renamingId: null,
    onSelect: fn(),
    onMove: fn(),
    onRenameStart: fn(),
    onRenameCommit: fn(),
    onRenameCancel: fn(),
    onDeleteRequest: fn(),
  },
  decorators: [
    (Story) => (
      // Марка курса — ссылка на /course/:id, в сторах нужен контент роутера
      <MemoryRouter>
        <div style={{ height: '100vh', display: 'flex' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof CourseSidebar>

export default meta
type Story = StoryObj<typeof meta>

/** Дерево с раскрытыми папками, бейджами и действиями. Поиск активен — введите текст. */
export const Default: Story = {}

export const WithSubtitle: Story = {
  args: {
    courseSubtitle: 'Иван Петров · 12 уроков · 2 часа',
  },
}

export const WithSelectedResource: Story = {
  args: {
    selectedId: 'res-usestate',
    courseSubtitle: 'Иван Петров · 12 уроков · 2 часа',
  },
}

/** Все папки свёрнуты — удобно проверить поиск: введите «useEffect». */
export const AllCollapsed: Story = {
  args: {
    courseSubtitle: 'Иван Петров · 12 уроков · 2 часа',
    defaultExpandedIds: [],
  },
}

export const RenameMode: Story = {
  args: {
    renamingId: 'folder-hooks',
    courseSubtitle: 'Иван Петров · 12 уроков · 2 часа',
  },
}

export const Empty: Story = {
  args: {
    nodes: emptyTree,
    courseSubtitle: 'Новый курс — структура ещё не создана',
  },
}

export const NoSearch: Story = {
  args: {
    searchable: false,
    courseSubtitle: 'Иван Петров · 12 уроков · 2 часа',
  },
}

export const NoDrag: Story = {
  args: {
    draggable: false,
    courseSubtitle: 'Иван Петров · 12 уроков · 2 часа',
  },
}

export const CustomActions: Story = {
  args: {
    courseSubtitle: 'Иван Петров · 12 уроков · 2 часа',
    actions: [
      {
        id: 'add-lesson',
        label: 'Урок',
        icon: <Plus size={16} strokeWidth={1.5} />,
        variant: 'primary',
        onSelect: fn(),
      },
      {
        id: 'add-quiz',
        label: 'Тест',
        icon: <Plus size={16} strokeWidth={1.5} />,
        variant: 'ghost',
        onSelect: fn(),
      },
      {
        id: 'add-assignment',
        label: 'Задание',
        icon: <Plus size={16} strokeWidth={1.5} />,
        variant: 'ghost',
        onSelect: fn(),
      },
      {
        id: 'import',
        label: 'Импорт',
        variant: 'ghost',
        onSelect: fn(),
      },
    ],
    maxVisibleActions: 3,
  },
}
