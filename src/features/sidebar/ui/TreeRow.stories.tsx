import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { CourseNode } from '../model/types'
import { TreeRow } from './TreeRow'

const folderNode: CourseNode = {
  id: 'folder-1',
  type: 'folder',
  title: 'Введение в React',
  children: [],
}
const resourceNode: CourseNode = {
  id: 'res-1',
  type: 'resource',
  title: 'JSX и компоненты',
  badge: '12 мин',
  badgeTone: 'accent',
}
const resourceWithBadge: CourseNode = {
  id: 'res-2',
  type: 'resource',
  title: 'useReducer — управление сложным состоянием',
  badge: 'Черновик',
  badgeTone: 'neutral',
}
const meta = {
  title: 'Sidebar/TreeRow',
  component: TreeRow,
  tags: ['autodocs'],
  args: {
    node: resourceNode,
    level: 0,
    expanded: false,
    selected: false,
    focused: false,
    hasChildren: false,
    isRenaming: false,
    onToggle: fn(),
    onSelect: fn(),
    onFocusRow: fn(),
    onRenameStart: fn(),
    onRenameCommit: fn(),
    onRenameCancel: fn(),
    onDeleteRequest: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 288, padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeRow>

export default meta
type Story = StoryObj<typeof meta>

/** Ресурс с бейджем. */
export const Resource: Story = {}

/** Ресурс выделен. */
export const ResourceSelected: Story = {
  args: {
    selected: true,
  },
}

/** Свёрнутая папка с детьми. */
export const FolderCollapsed: Story = {
  args: {
    node: folderNode,
    hasChildren: true,
    expanded: false,
  },
}

/** Раскрытая папка. */
export const FolderExpanded: Story = {
  args: {
    node: folderNode,
    hasChildren: true,
    expanded: true,
  },
}

/** Папка на 2-м уровне (отступ 16px). */
export const NestedFolder: Story = {
  args: {
    node: folderNode,
    level: 1,
    hasChildren: true,
    expanded: false,
  },
}

/** Режим инлайн-переименования. */
export const Renaming: Story = {
  args: {
    node: folderNode,
    hasChildren: true,
    isRenaming: true,
  },
}

/** Нейтральный бейдж. */
export const NeutralBadge: Story = {
  args: {
    node: resourceWithBadge,
  },
}

/** Ресурс без бейджа. */
export const NoBadge: Story = {
  args: {
    node: { id: 'res-plain', type: 'resource', title: 'Обычный ресурс без бейджа' },
  },
}

/** DragOverlay-режим (плавающая копия). */
export const Overlay: Story = {
  args: {
    node: resourceNode,
    overlay: true,
  },
}
