import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  type AnimateLayoutChanges,
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTreeKeyboardNav } from '../hooks/useTreeKeyboardNav'
import { siblingPositionOf } from '../model/convert'
import {
  type FlattenedItem,
  flattenTree,
  getProjection,
  removeChildrenOf,
} from '../model/tree-utils'
import type { CourseNode } from '../model/types'
import { Empty, EmptyHint, EmptyTitle, Guide, Indicator, RowSlot, Tree } from './CourseTree.style'
import { ROW_INDENT, TreeRow } from './TreeRow'

interface CourseTreeProps {
  nodes: CourseNode[]
  selectedId?: string | null
  expandedIds: Set<string>
  /** Активный поисковый запрос: во время поиска drag-and-drop отключён. */
  query?: string
  /** ID узла в режиме инлайн-переименования. */
  renamingId?: string | null
  onSelect: (node: CourseNode) => void
  onToggle: (id: string) => void
  /** Принудительно раскрыть папку (авто-раскрытие при наведении / после дропа). */
  onExpand?: (id: string) => void
  /** Перемещение узла (оптимистично обрабатывается entity-стором structure). */
  onMove?: (params: { id: string; parentId: string | null; position: number }) => void
  onRenameStart: (id: string) => void
  onRenameCommit: (name: string) => void
  onRenameCancel: () => void
  onDeleteRequest: (node: CourseNode) => void
  /** ПКМ по строке узла: открыть контекстное меню. */
  onNodeContextMenu?: (node: CourseNode, event: MouseEvent) => void
}

const MEASURING = {
  droppable: { strategy: MeasuringStrategy.Always },
}
const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true

/** Плоский элемент в отображение узла для TreeRow. */
function toDisplayNode(item: FlattenedItem): CourseNode {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    badge: item.badge,
    badgeTone: item.badgeTone,
  }
}
function collectMatches(nodes: CourseNode[], query: string, acc: Set<string>): boolean {
  let anyMatch = false
  for (const node of nodes) {
    const selfMatch = node.title.toLowerCase().includes(query)
    const childMatch = node.children ? collectMatches(node.children, query, acc) : false
    if (selfMatch || childMatch) {
      acc.add(node.id)
      anyMatch = true
    }
  }

  return anyMatch
}

export function CourseTree({
  nodes,
  selectedId,
  expandedIds,
  query = '',
  renamingId = null,
  onSelect,
  onToggle,
  onExpand,
  onMove,
  onRenameStart,
  onRenameCommit,
  onRenameCancel,
  onDeleteRequest,
  onNodeContextMenu,
}: CourseTreeProps) {
  const normalizedQuery = query.trim().toLowerCase()
  const dndEnabled = Boolean(onMove) && !normalizedQuery
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const expandTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingExpandId = useRef<string | null>(null)
  const visibleIds = useMemo(() => {
    if (!normalizedQuery) return null
    const acc = new Set<string>()
    collectMatches(nodes, normalizedQuery, acc)

    return acc
  }, [nodes, normalizedQuery])
  // Строки для отображения. При поиске дерево всегда развёрнуто и отфильтровано;
  // иначе — скрываем детей свёрнутых папок и детей перетаскиваемого узла.
  const rows = useMemo<FlattenedItem[]>(() => {
    const flattened = flattenTree(nodes)
    if (visibleIds) {
      return flattened.filter((item) => visibleIds.has(item.id))
    }
    const collapsedIds = flattened
      .filter((item) => item.type === 'folder' && !expandedIds.has(item.id))
      .map((item) => item.id)
    const exclude = dragId ? [dragId, ...collapsedIds] : collapsedIds

    return removeChildrenOf(flattened, exclude)
  }, [nodes, visibleIds, expandedIds, dragId])
  const isExpanded = useCallback(
    (item: FlattenedItem) =>
      item.type === 'folder' && (Boolean(visibleIds) || expandedIds.has(item.id)),
    [visibleIds, expandedIds],
  )
  const projected =
    dndEnabled && dragId && overId
      ? getProjection(rows, dragId, overId, offsetLeft, ROW_INDENT)
      : null
  const sortedIds = useMemo(() => rows.map((item) => item.id), [rows])
  const dragItem = dragId ? (rows.find((item) => item.id === dragId) ?? null) : null
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
  )
  // ── Клавиатурная навигация ────────────────────────────────────────────────
  const { activeId, markFocused, registerRef, handleKeyDown } = useTreeKeyboardNav({
    rows,
    selectedId,
    isExpanded,
    onToggle,
    onSelect: (item) => onSelect(toDisplayNode(item)),
  })

  const clearExpandTimer = useCallback(() => {
    if (expandTimer.current) clearTimeout(expandTimer.current)
    expandTimer.current = null
    pendingExpandId.current = null
  }, [])

  useEffect(() => () => clearExpandTimer(), [clearExpandTimer])

  // ── DnD-обработчики ───────────────────────────────────────────────────────
  const resetDragState = useCallback(() => {
    setDragId(null)
    setOverId(null)
    setOffsetLeft(0)
    clearExpandTimer()
    document.body.style.cursor = ''
  }, [clearExpandTimer])
  const handleDragStart = ({ active }: DragStartEvent) => {
    setDragId(String(active.id))
    setOverId(String(active.id))
    document.body.style.cursor = 'grabbing'
  }
  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x)
  }
  const handleDragOver = ({ over }: DragOverEvent) => {
    const nextOverId = over ? String(over.id) : null
    setOverId(nextOverId)

    // Авто-раскрытие свёрнутой папки при наведении, как в Obsidian.
    if (!nextOverId || nextOverId === dragId) {
      clearExpandTimer()

      return
    }
    const overItem = rows.find((item) => item.id === nextOverId)
    const collapsedFolder =
      overItem?.type === 'folder' && overItem.hasChildren && !expandedIds.has(overItem.id)

    if (collapsedFolder) {
      if (pendingExpandId.current !== nextOverId) {
        clearExpandTimer()
        pendingExpandId.current = nextOverId
        expandTimer.current = setTimeout(() => {
          onExpand?.(nextOverId)
          pendingExpandId.current = null
        }, 500)
      }
    } else {
      clearExpandTimer()
    }
  }
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const currentProjected = projected
    resetDragState()

    if (!currentProjected || !over || !onMove) return

    const { depth, parentId } = currentProjected
    const clonedItems = flattenTree(nodes)
    const overIndex = clonedItems.findIndex((item) => item.id === over.id)
    const activeIndex = clonedItems.findIndex((item) => item.id === active.id)
    if (overIndex === -1 || activeIndex === -1) return

    clonedItems[activeIndex] = { ...clonedItems[activeIndex], depth, parentId }
    const sorted = arrayMove(clonedItems, activeIndex, overIndex)
    // Вычисляем sibling-position перемещённого узла среди детей нового родителя.
    const movedItem = sorted[overIndex]
    const position = siblingPositionOf(sorted, movedItem.id)

    onMove({ id: String(active.id), parentId, position })

    // Раскрываем папку-приёмник, чтобы перемещённый узел был виден.
    if (parentId) onExpand?.(parentId)
  }

  if (rows.length === 0) {
    return (
      <Empty>
        <EmptyTitle>{normalizedQuery ? 'Ничего не найдено' : 'Структура пуста'}</EmptyTitle>
        <EmptyHint>
          {normalizedQuery
            ? 'Попробуйте изменить запрос'
            : 'Создайте первый ресурс или группу, чтобы начать курс'}
        </EmptyHint>
      </Empty>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={MEASURING}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={resetDragState}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <Tree role="tree" aria-label="Структура курса" onKeyDown={handleKeyDown}>
          {rows.map((item) => {
            const ghost = item.id === dragId
            const depth = ghost && projected ? projected.depth : item.depth

            return (
              <SortableTreeItem
                key={item.id}
                item={item}
                depth={depth}
                ghost={ghost}
                disabled={!dndEnabled}
                expanded={isExpanded(item)}
                selected={selectedId === item.id}
                focused={activeId === item.id}
                isRenaming={renamingId === item.id}
                onToggle={() => onToggle(item.id)}
                onSelect={() => onSelect(toDisplayNode(item))}
                onFocusRow={() => markFocused(item.id)}
                onRenameStart={() => onRenameStart(item.id)}
                onRenameCommit={onRenameCommit}
                onRenameCancel={onRenameCancel}
                onDeleteRequest={() => onDeleteRequest(toDisplayNode(item))}
                onNodeContextMenu={(event) => onNodeContextMenu?.(toDisplayNode(item), event)}
                registerRef={registerRef}
              />
            )
          })}
        </Tree>
      </SortableContext>

      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay dropAnimation={null}>
            {dragItem ? (
              <TreeRow
                overlay
                node={toDisplayNode(dragItem)}
                level={0}
                expanded={isExpanded(dragItem)}
                hasChildren={dragItem.hasChildren}
                selected={false}
                focused={false}
                isRenaming={false}
                onToggle={() => {}}
                onSelect={() => {}}
                onFocusRow={() => {}}
                onRenameStart={() => {}}
                onRenameCommit={() => {}}
                onRenameCancel={() => {}}
                onDeleteRequest={() => {}}
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  )
}

interface SortableTreeItemProps {
  item: FlattenedItem
  depth: number
  ghost: boolean
  disabled: boolean
  expanded: boolean
  selected: boolean
  focused: boolean
  isRenaming: boolean
  onToggle: () => void
  onSelect: () => void
  onFocusRow: () => void
  onRenameStart: () => void
  onRenameCommit: (name: string) => void
  onRenameCancel: () => void
  onDeleteRequest: () => void
  onNodeContextMenu?: (event: MouseEvent<HTMLDivElement>) => void
  registerRef: (id: string, element: HTMLDivElement | null) => void
}
function SortableTreeItem({
  item,
  depth,
  ghost,
  disabled,
  expanded,
  selected,
  focused,
  isRenaming,
  onToggle,
  onSelect,
  onFocusRow,
  onRenameStart,
  onRenameCommit,
  onRenameCancel,
  onDeleteRequest,
  onNodeContextMenu,
  registerRef,
}: SortableTreeItemProps) {
  const { setNodeRef, listeners, transform, transition } = useSortable({
    id: item.id,
    animateLayoutChanges,
    disabled: disabled || isRenaming,
  })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <RowSlot ref={setNodeRef} style={style} $level={depth} $ghost={ghost}>
      {depth > 0 && !ghost && <Guide aria-hidden="true" />}
      {ghost ? (
        <Indicator $indent={depth * ROW_INDENT} aria-hidden="true" />
      ) : (
        <TreeRow
          ref={(element) => registerRef(item.id, element)}
          node={toDisplayNode(item)}
          level={depth}
          expanded={expanded}
          hasChildren={item.hasChildren}
          selected={selected}
          focused={focused}
          isRenaming={isRenaming}
          onToggle={onToggle}
          onSelect={onSelect}
          onFocusRow={onFocusRow}
          onRenameStart={onRenameStart}
          onRenameCommit={onRenameCommit}
          onRenameCancel={onRenameCancel}
          onDeleteRequest={onDeleteRequest}
          onNodeContextMenu={onNodeContextMenu}
          dragProps={disabled || isRenaming ? undefined : listeners}
        />
      )}
    </RowSlot>
  )
}
