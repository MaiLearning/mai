import {
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { useTreeKeyboardNav } from '../hooks/useTreeKeyboardNav'
import { type DropTarget, findNodeTitle, ROOT_DROP_ID, resolveDropTarget } from '../model/dnd'
import {
  computeGuideLevels,
  type FlattenedItem,
  flattenTree,
  removeChildrenOf,
} from '../model/tree-utils'
import type { CourseNode } from '../model/types'
import {
  Empty,
  EmptyHint,
  EmptyTitle,
  OverlayCard,
  OverlayHint,
  RowSlot,
  Tree,
} from './CourseTree.style'
import { TreeRow } from './TreeRow'

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

/** Y-координата активатора перетаскивания (pointer/touch); для клавиатуры — 0. */
function activatorPointY(event: Event): number {
  if ('clientY' in event) return (event as PointerEvent).clientY
  if ('touches' in event) {
    const touch = (event as TouchEvent).touches[0]
    if (touch) return touch.clientY
  }

  return 0
}

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
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const dragStartY = useRef(0)
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
  // Уровни направляющих для каждой строки: линия уровня продолжается
  // через поддеревья вложенных папок к следующим братьям.
  const guideLevels = useMemo(() => computeGuideLevels(rows), [rows])
  const isExpanded = useCallback(
    (item: FlattenedItem) =>
      item.type === 'folder' && (Boolean(visibleIds) || expandedIds.has(item.id)),
    [visibleIds, expandedIds],
  )
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
    setDropTarget(null)
    clearExpandTimer()
    document.body.style.cursor = ''
  }, [clearExpandTimer])
  const handleDragStart = ({ active, activatorEvent }: DragStartEvent) => {
    setDragId(String(active.id))
    dragStartY.current = activatorPointY(activatorEvent)
    document.body.style.cursor = 'grabbing'
  }
  // Цель дропа пересчитывается на каждый ход указателя: строка под курсором
  // + доля высоты строки определяют зону (перед / внутрь / после).
  const handleDragMove = ({ delta, over }: DragMoveEvent) => {
    if (!dragId) return
    if (!over) {
      setDropTarget(null)

      return
    }
    const pointerY = dragStartY.current + delta.y
    const ratioY = over.rect.height > 0 ? (pointerY - over.rect.top) / over.rect.height : 0
    setDropTarget(resolveDropTarget({ nodes, dragId, overId: String(over.id), ratioY }))
  }
  const handleDragOver = ({ over }: DragOverEvent) => {
    const nextOverId = over ? String(over.id) : null

    // Авто-раскрытие свёрнутой папки при наведении, как в Obsidian.
    if (!nextOverId || nextOverId === dragId || nextOverId === ROOT_DROP_ID) {
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
  const handleDragEnd = ({ active }: DragEndEvent) => {
    const target = dropTarget
    resetDragState()

    if (!target || !onMove) return
    onMove({ id: String(active.id), parentId: target.parentId, position: target.position })

    // Раскрываем папку-приёмник, чтобы перемещённый узел был виден.
    if (target.parentId) onExpand?.(target.parentId)
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

  const overlayFolderTitle =
    dropTarget?.kind === 'inside' && dropTarget.targetId
      ? findNodeTitle(nodes, dropTarget.targetId)
      : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      measuring={MEASURING}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={resetDragState}
    >
      <TreeCanvas disabled={!dndEnabled} dragging={Boolean(dragId)} onKeyDown={handleKeyDown}>
        {rows.map((item, index) => (
          <TreeRowItem
            key={item.id}
            item={item}
            guideLevels={guideLevels[index]}
            dropKind={dropTarget?.targetId === item.id ? dropTarget.kind : null}
            disabled={!dndEnabled}
            expanded={isExpanded(item)}
            selected={selectedId === item.id}
            focused={activeId === item.id}
            dimmed={item.id === dragId}
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
        ))}
      </TreeCanvas>

      {typeof document !== 'undefined' &&
        createPortal(
          <DragOverlay dropAnimation={null}>
            {dragItem ? (
              <OverlayCard>
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
                {overlayFolderTitle && (
                  <OverlayHint>Переместить в «{overlayFolderTitle}»</OverlayHint>
                )}
              </OverlayCard>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  )
}

interface TreeCanvasProps {
  disabled: boolean
  dragging: boolean
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  children: ReactNode
}

/** Контейнер дерева; сам является дропабельной зоной «append в корень». */
function TreeCanvas({ disabled, dragging, onKeyDown, children }: TreeCanvasProps) {
  const { setNodeRef } = useDroppable({ id: ROOT_DROP_ID, disabled })

  return (
    <Tree
      ref={setNodeRef}
      role="tree"
      aria-label="Структура курса"
      $dragging={dragging}
      onKeyDown={onKeyDown}
    >
      {children}
    </Tree>
  )
}

interface TreeRowItemProps {
  item: FlattenedItem
  /** Уровни направляющих линий этой строки (см. computeGuideLevels). */
  guideLevels: number[]
  /** Активная зона дропа на этой строке (линия вставки или подсветка папки). */
  dropKind: 'before' | 'inside' | 'after' | null
  disabled: boolean
  expanded: boolean
  selected: boolean
  focused: boolean
  /** Строка — источник перетаскивания: затемняется на время драга. */
  dimmed: boolean
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
function TreeRowItem({
  item,
  guideLevels,
  dropKind,
  disabled,
  expanded,
  selected,
  focused,
  dimmed,
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
}: TreeRowItemProps) {
  const dragDisabled = disabled || isRenaming
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
  } = useDraggable({
    id: item.id,
    disabled: dragDisabled,
  })
  const { setNodeRef: setDropRef } = useDroppable({ id: item.id, disabled: dragDisabled })

  return (
    <RowSlot ref={setDragRef} {...attributes} {...listeners}>
      <TreeRow
        ref={(element) => {
          registerRef(item.id, element)
          setDropRef(element)
        }}
        node={toDisplayNode(item)}
        level={item.depth}
        guideLevels={guideLevels}
        dropKind={dropKind}
        expanded={expanded}
        hasChildren={item.hasChildren}
        selected={selected}
        focused={focused}
        dimmed={dimmed}
        isRenaming={isRenaming}
        onToggle={onToggle}
        onSelect={onSelect}
        onFocusRow={onFocusRow}
        onRenameStart={onRenameStart}
        onRenameCommit={onRenameCommit}
        onRenameCancel={onRenameCancel}
        onDeleteRequest={onDeleteRequest}
        onNodeContextMenu={onNodeContextMenu}
      />
    </RowSlot>
  )
}
