import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { GuideSegment } from '../model/tree-utils'
import type { CourseNode } from '../model/types'
import { TreeRow } from './TreeRow'

const folderNode: CourseNode = {
  id: 'folder-intro',
  type: 'folder',
  title: 'Введение',
  children: [],
}
const resourceNode: CourseNode = { id: 'res-what', type: 'resource', title: 'Что такое Mai' }

/**
 * TreeRow — одна строка дерева: иконка папки/ресурса, заголовок, метка,
 * шеврон раскрытия и кнопка удаления при наведении. Полностью
 * презентационный: состояние приходит сверху.
 */
const meta = {
  title: 'sidebar/TreeRow',
  component: TreeRow,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 288, padding: 8 }}>
        <Story />
      </div>
    ),
  ],
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
  argTypes: {
    guideLevels: { control: false },
    dropKind: { control: false },
    node: { control: false },
  },
} satisfies Meta<typeof TreeRow>

export default meta

type Story = StoryObj<typeof meta>

/** Строка-ресурс: иконка документа, заголовок, удаление на наведении. */
export const Resource: Story = {}

/** Свёрнутая папка с детьми: шеврон указывает на раскрытие. */
export const Folder: Story = {
  args: {
    node: folderNode,
    hasChildren: true,
  },
}

/** Развёрнутая папка. */
export const FolderExpanded: Story = {
  args: {
    node: folderNode,
    hasChildren: true,
    expanded: true,
  },
}

/** Папка без детей — шеврон скрыт. */
export const FolderWithoutChildren: Story = {
  args: {
    node: folderNode,
    hasChildren: false,
  },
}

/** Выделенная строка акцентирует фон. */
export const Selected: Story = {
  args: { selected: true },
}

/** Метка справа: длительность, статус и т.п. */
export const WithBadge: Story = {
  args: {
    node: { ...resourceNode, badge: '12 мин' },
  },
}

/** Все тона меток рядом. */
export const BadgeTones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {(['neutral', 'accent', 'success', 'danger', 'info'] as const).map((tone) => (
        <TreeRow
          key={tone}
          {...args}
          node={{
            id: `badge-${tone}`,
            type: 'resource',
            title: 'Ресурс',
            badge: 'Метка',
            badgeTone: tone,
          }}
        />
      ))}
    </div>
  ),
}

/** Инлайн-переименование: заголовок заменён на поле ввода. */
export const Renaming: Story = {
  args: { isRenaming: true },
}

/** Копия строки в DragOverlay поверх перетаскивания. */
export const Overlay: Story = {
  args: { overlay: true },
}

/** Активная линия вставки над строкой. */
export const DropLineBefore: Story = {
  args: { dropKind: 'before' },
}

/** Подсветка папки как цели дропа «внутрь». */
export const DropInside: Story = {
  args: {
    node: folderNode,
    hasChildren: true,
    dropKind: 'inside',
  },
}

/** Строка с направляющими линиями родительских папок. */
export const NestedLevel: Story = {
  args: {
    level: 1,
    guideLevels: [{ level: 1, end: false }] as GuideSegment[],
  },
}
