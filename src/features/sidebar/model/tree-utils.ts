import type { CourseNode, CourseNodeType } from './types'

/**
 * Утилиты для drag-and-drop иерархического дерева: дерево разворачивается
 * в плоский список строк, во время перетаскивания дети свёрнутых папок и
 * перетаскиваемого узла скрываются (см. model/dnd.ts — расчёт цели дропа).
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

function flatten(items: CourseNode[], parentId: string | null = null, depth = 0): FlattenedItem[] {
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

/** Сегмент направляющей линии на строке. */
export interface GuideSegment {
  /** Уровень вложенности линии (линия папки-предка на глубине level - 1). */
  level: number
  /**
   * Строка — последняя в поддереве папки этого уровня: линия завершается
   * скруглённым поворотом вправо у низа строки. Уголок рисует только самая
   * внутренняя из заканчивающихся здесь линий; остальные тормозятся прямой.
   */
  end: boolean
}

/**
 * Направляющие линии для каждой строки видимого списка.
 *
 * Линия уровня k принадлежит папке-предку на глубине k - 1 и тянется по
 * всем строкам её поддерева; на строке самой папки она не рисуется.
 * Поддерево заканчивается перед первой строкой с depth <= k - 1, поэтому:
 * - сегмент уровня k есть на каждой строке-потомке (level <= depth(i));
 * - `end: true` — только на последней строке поддерева: следующая строка
 *   с depth <= k - 1 идёт сразу за ней (или её нет вовсе и строка
 *   последняя в списке). Если на строке заканчиваются несколько линий,
 *   `end` получает только самая внутренняя (максимальный уровень).
 *
 * Строки идут в DFS-порядке, поэтому «первая строка с depth <= k» всегда
 * принадлежит тому же прогону уровня k, что и строка i.
 */
export function computeGuideLevels(items: FlattenedItem[]): GuideSegment[][] {
  const maxDepth = items.reduce((max, item) => Math.max(max, item.depth), 0)
  // nextAtOrBelow[k][i] — индекс первой строки после i с depth <= k (-1 если нет).
  const nextAtOrBelow: number[][] = Array.from({ length: maxDepth + 1 }, () => [])
  for (let k = 0; k <= maxDepth; k++) {
    let next = -1
    for (let i = items.length - 1; i >= 0; i--) {
      nextAtOrBelow[k][i] = next
      if (items[i].depth <= k) next = i
    }
  }

  return items.map((item, i) => {
    let innermostEnd = -1
    for (let level = 1; level <= item.depth; level++) {
      const terminator = nextAtOrBelow[level - 1][i]
      const ends = terminator === -1 ? i === items.length - 1 : terminator === i + 1
      if (ends) innermostEnd = level
    }

    return Array.from({ length: item.depth }, (_, index) => ({
      level: index + 1,
      end: index + 1 === innermostEnd,
    }))
  })
}

/** Собирает плоский список обратно в дерево, сохраняя порядок и вложенность. */ export function buildTree(
  flattenedItems: FlattenedItem[],
): CourseNode[] {
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
