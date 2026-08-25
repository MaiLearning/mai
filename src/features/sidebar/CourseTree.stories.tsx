import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { emptyTree, mockTree } from './__mocks__/tree-mock'
import { CourseTree } from './CourseTree'

const meta = {
  title: 'Sidebar/CourseTree',
  component: CourseTree,
  tags: ['autodocs'],
  args: {
    nodes: mockTree,
    selectedId: null,
    expandedIds: new Set(['folder-intro', 'folder-hooks']),
    query: '',
    renamingId: null,
    onSelect: fn(),
    onToggle: fn(),
    onExpand: fn(),
    onMove: fn(),
    onRenameStart: fn(),
    onRenameCommit: fn(),
    onRenameCancel: fn(),
    onDeleteRequest: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 288, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CourseTree>

export default meta
type Story = StoryObj<typeof meta>

/** Полное дерево с раскрытыми папками и DnD включён. */
export const Default: Story = {}

/** Выделенный ресурс (res-usestate). */
export const WithSelection: Story = {
  args: {
    selectedId: 'res-usestate',
  },
}

/** Запрос «use» — дерево фильтруется, DnD отключён. */
export const SearchFiltering: Story = {
  args: {
    query: 'use',
    expandedIds: new Set(),
  },
}

/** DnD выключен (onMove не передан). */
export const DragDisabled: Story = {
  args: {
    onMove: undefined,
  },
}

/** Активный режим переименования на узле folder-hooks. */
export const Renaming: Story = {
  args: {
    renamingId: 'folder-hooks',
  },
}

/** Пустое дерево — empty state. */
export const EmptyState: Story = {
  args: {
    nodes: emptyTree,
  },
}

/** Поиск без результатов. */
export const NoSearchResults: Story = {
  args: {
    query: 'xyzнесуществующий',
    expandedIds: new Set(),
  },
}
