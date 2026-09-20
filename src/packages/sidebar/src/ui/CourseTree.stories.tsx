import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import type { CourseNode } from '../model/types'
import { CourseTree } from './CourseTree'

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

/** Интерактивный стенд: сворачивание, выделение работают без стора. */
function TreePlayground() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['folder-advanced', 'folder-perf']),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)

      return next
    })
  }
  const expand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.add(id)

      return next
    })
  }

  return (
    <CourseTree
      nodes={nodes}
      expandedIds={expandedIds}
      selectedId={selectedId}
      onSelect={(node) => setSelectedId(node.id)}
      onToggle={toggle}
      onExpand={expand}
      onMove={fn()}
      onRenameStart={fn()}
      onRenameCommit={fn()}
      onRenameCancel={fn()}
      onDeleteRequest={fn()}
    />
  )
}

/**
 * CourseTree — иерархическое дерево «папки + ресурсы»: направляющие линии,
 * drag-and-drop, клавиатурная навигация, инлайн-переименование и поиск.
 * Дерево полностью управляемое: состояние раскрытия приходит сверху.
 */
const meta = {
  title: 'Sidebar/CourseTree',
  component: CourseTree,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: 480, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    nodes,
    expandedIds: new Set(['folder-intro', 'folder-advanced', 'folder-perf']),
    onSelect: fn(),
    onToggle: fn(),
    onExpand: fn(),
    onMove: fn(),
    onRenameStart: fn(),
    onRenameCommit: fn(),
    onRenameCancel: fn(),
    onDeleteRequest: fn(),
  },
  argTypes: {
    expandedIds: { control: false },
    renamingId: { control: false },
    selectedId: { control: false },
  },
} satisfies Meta<typeof CourseTree>

export default meta

type Story = StoryObj<typeof meta>

/** Развёрнутое дерево: папки, вложенность, метки длительности. */
export const Default: Story = {}

/** Пустая структура — сообщение с подсказкой создать первый узел. */
export const Empty: Story = {
  args: { nodes: [] },
}

/** Поисковый запрос фильтрует дерево: подходят узел и папки-предки. */
export const SearchFound: Story = {
  args: { query: 'Хуки' },
}

/** Запрос без совпадений — сообщение «ничего не найдено». */
export const SearchEmpty: Story = {
  args: { query: 'несуществующий узел' },
}

/** Инлайн-переименование активного узла. */
export const Renaming: Story = {
  args: { renamingId: 'res-setup' },
}

/** Интерактивный стенд: сворачивание папок и выделение строк работают. */
export const Playground: Story = {
  render: () => <TreePlayground />,
}
