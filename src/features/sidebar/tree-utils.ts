import { arrayMove } from '@dnd-kit/sortable'
import type { CourseNode, CourseNodeType } from './types'

/**
 * Утилиты для drag-and-drop иерархического дерева (подход dnd-kit «flatten + projection»):
 * дерево разворачивается в плоский список, во время перетаскивания по горизонтальному
 * смещению вычисляется целевая глубина/родитель, а затем список снова собирается в дерево.
 */
export interface FlattenedItem {
  id: string
  type: CourseNodeType
  title: string
  badge?: string
  badgeTone?: CourseNode['badgeTone']
  parentId: string | null
  depth: number
  index: number
  /** У folder есть дети (после сборки). Используется для ограничения вложенности. */
  hasChildren: boolean
}

export interface Projection {
  depth: number
  maxDepth: number
  minDepth: number
  parentId: string | null
}

function flatten(
  items: CourseNode[],
  parentId: string | null = null,
  depth = 0,
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, node, index) => {
    const hasChildren = node.type === 'folder' && Boolean(node.children?.length)
    acc.push({
      id: node.id,
      type: node.type,
      title: node.title,
      badge: node.badge,
      badgeTone: node.badgeTone,
      parentId,
      depth,
      index,
      hasChildren,
    })
    if (node.children?.length) {
      acc.push(...flatten(node.children, node.id, depth + 1))
    }
    return acc
  }, [])
}

/** Полностью разворачивает дерево (независимо от свёрнутости) — источник правды для сборки. */
export function flattenTree(items: CourseNode[]): FlattenedItem[] {
  return flatten(items)
}

/** Убирает потомков указанных id (для скрытия свёрнутых папок и детей перетаскиваемого узла). */
export function removeChildrenOf(items: FlattenedItem[], ids: string[]): FlattenedItem[] {
  const excludeParentIds = new Set(ids)
  return items.filter((item) => {
    if (item.parentId != null && excludeParentIds.has(item.parentId)) {
      if (item.hasChildren) excludeParentIds.add(item.id)
      return false
    }
    return true
  })
}

/** Собирает плоский список обратно в дерево, сохраняя порядок и вложенность. */
export function buildTree(flattenedItems: FlattenedItem[]): CourseNode[] {
  const root: CourseNode & { children: CourseNode[] } = {
    id: '__root__',
    type: 'folder',
    title: '',
    children: [],
  }

  const mapped = flattenedItems.map((item) => {
    const node: CourseNode & { children: CourseNode[] } = {
      id: item.id,
      type: item.type,
      title: item.title,
      children: [],
    }
    if (item.badge) node.badge = item.badge
    if (item.badgeTone) node.badgeTone = item.badgeTone
    return { item, node }
  })

  const nodeById: Record<string, CourseNode & { children: CourseNode[] }> = {
    [root.id]: root,
  }
  for (const { item, node } of mapped) nodeById[item.id] = node

  for (const { item, node } of mapped) {
    const parent = (item.parentId && nodeById[item.parentId]) || root
    parent.children.push(node)
  }

  // Ресурсы не могут иметь детей — вычищаем пустые массивы у не-папок.
  const clean = (list: CourseNode[]): CourseNode[] =>
    list.map((node) => {
      if (node.type === 'resource') {
        const { children: _children, ...rest } = node
        return rest
      }
      return { ...node, children: clean(node.children ?? []) }
    })

  return clean(root.children)
}

function getMaxDepth(previousItem?: FlattenedItem): number {
  if (!previousItem) return 0
  // Вложить внутрь можно только в папку. Ресурс — только сосед того же уровня.
  return previousItem.type === 'folder' ? previousItem.depth + 1 : previousItem.depth
}

function getMinDepth(nextItem?: FlattenedItem): number {
  return nextItem ? nextItem.depth : 0
}

/**
 * Вычисляет проекцию: на какой глубине и под каким родителем окажется узел,
 * если бросить его сейчас. `dragOffset` — горизонтальное смещение курсора.
 */
export function getProjection(
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number,
): Projection {
  const overItemIndex = items.findIndex((item) => item.id === overId)
  const activeItemIndex = items.findIndex((item) => item.id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]

  const dragDepth = Math.round(dragOffset / indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth(previousItem)
  const minDepth = getMinDepth(nextItem)
  const depth = Math.min(Math.max(projectedDepth, minDepth), maxDepth)

  function getParentId(): string | null {
    if (depth === 0 || !previousItem) return null
    if (depth === previousItem.depth) return previousItem.parentId
    if (depth > previousItem.depth) return previousItem.id
    const parent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId
    return parent ?? null
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }
}
