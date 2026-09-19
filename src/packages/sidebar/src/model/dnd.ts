import type { CourseNode } from './types'

/**
 * Целевая семантика drag-and-drop «как в Obsidian»: цель определяется
 * строкой под курсором, а не проекцией по горизонтальному смещению.
 *
 * Зоны внутри строки-цели (по вертикали):
 * - верхние 25% — вставка ПЕРЕД строкой;
 * - середина — ВНУТРЬ папки (append в конец) или ПОСЛЕ ресурса;
 * - нижние 25% — вставка ПОСЛЕ строки.
 *
 * `position` считается в семантике `Tree.move` (remove-first): узел уже
 * удалён из старого родителя, индекс — место в итоговом списке детей.
 */
export type DropKind = 'before' | 'inside' | 'after'

export interface DropTarget {
  kind: DropKind
  /** Родитель вставки; null — корень. */
  parentId: string | null
  /** Индекс вставки среди детей parentId после удаления узла со старого места. */
  position: number
  /** id строки-цели; null — дроп в свободную зону (append в корень). */
  targetId: string | null
}

/** Доля высоты строки на каждую краевую зону «перед»/«после». */
export const EDGE_ZONE = 0.25

/** id дропабельного контейнера дерева: дроп мимо строк = append в корень. */
export const ROOT_DROP_ID = '__drop_root__'

/**
 * id постоянной зоны «в корень» под списком (под скроллом): гарантирует
 * место для дропа в корень, когда строки заполняют всю высоту панели.
 */
export const ROOT_ZONE_ID = '__drop_root_zone__'

interface FlatLocation {
  node: CourseNode
  parentId: string | null
}

/** Плоский индекс дерева: родитель каждого узла + список детей по родителю. */
function indexTree(nodes: CourseNode[]): {
  byId: Map<string, FlatLocation>
  childrenOf: (parentId: string | null) => string[]
} {
  const byId = new Map<string, FlatLocation>()
  const childMap = new Map<string, string[]>()
  const walk = (list: CourseNode[], parentId: string | null) => {
    const ids = list.map((item) => item.id)
    childMap.set(parentId ?? '', ids)
    for (const node of list) {
      byId.set(node.id, { node, parentId })
      if (node.children?.length) walk(node.children, node.id)
    }
  }
  walk(nodes, null)

  return { byId, childrenOf: (parentId) => childMap.get(parentId ?? '') ?? [] }
}

/** Является ли candidateId потомком ancestorId (сам узел — не потомок). */
export function isDescendant(
  nodes: CourseNode[],
  ancestorId: string,
  candidateId: string,
): boolean {
  const find = (list: CourseNode[]): CourseNode | null => {
    for (const node of list) {
      if (node.id === ancestorId) return node
      if (node.children?.length) {
        const found = find(node.children)
        if (found) return found
      }
    }

    return null
  }
  const ancestor = find(nodes)
  if (!ancestor?.children?.length) return false

  const contains = (list: CourseNode[]): boolean =>
    list.some(
      (node) =>
        node.id === candidateId || (node.children?.length ? contains(node.children) : false),
    )

  return contains(ancestor.children)
}

/** Заголовок узла по id (для подписи ghost-карточки «Переместить в …»). */
export function findNodeTitle(nodes: CourseNode[], id: string): string | null {
  for (const node of nodes) {
    if (node.id === id) return node.title
    if (node.children?.length) {
      const title = findNodeTitle(node.children, id)
      if (title) return title
    }
  }

  return null
}

/**
 * Вычислить цель дропа: строка `overId` под указателем на доле `ratioY`
 * её высоты (0 — верх, 1 — низ). Возвращает null, если дроп невозможен.
 */
export function resolveDropTarget(input: {
  nodes: CourseNode[]
  dragId: string
  overId: string | null
  ratioY: number
}): DropTarget | null {
  const { nodes, dragId, overId, ratioY } = input
  if (!overId || overId === dragId) return null

  const { byId, childrenOf } = indexTree(nodes)

  // Дроп мимо строк (контейнер дерева или нижняя зона) — append в корень.
  if (overId === ROOT_DROP_ID || overId === ROOT_ZONE_ID) {
    return {
      kind: 'inside',
      parentId: null,
      position: childrenOf(null).filter((id) => id !== dragId).length,
      targetId: null,
    }
  }

  const over = byId.get(overId)
  const drag = byId.get(dragId)
  if (!over || !drag) return null
  // Внутрь собственного поддерева падать нельзя (дети перетаскиваемого узла скрыты,
  // но страховка на случай рассинхрона строк и дерева).
  if (isDescendant(nodes, dragId, overId)) return null

  const ratio = Math.min(Math.max(ratioY, 0), 1)
  const kind: DropKind =
    ratio < EDGE_ZONE
      ? 'before'
      : ratio > 1 - EDGE_ZONE
        ? 'after'
        : over.node.type === 'folder'
          ? 'inside'
          : 'after'

  // «Внутрь» всегда валиден: ресурс отсечён выбором kind, себя и потомков
  // отсекают ранние проверки (null). Append в конец папки; сам узел
  // исключается, если уже лежит в этой папке.
  if (kind === 'inside') {
    const siblings = childrenOf(over.node.id).filter((id) => id !== dragId)

    return { kind, parentId: over.node.id, position: siblings.length, targetId: over.node.id }
  }

  // Вставка до/после строки-цели: поправка индекса, если узел уходит
  // из того же родителя и стоял раньше цели (remove-first у Tree.move).
  const parentId = over.parentId
  const siblings = childrenOf(parentId)
  const overIndex = siblings.indexOf(over.node.id)
  if (overIndex === -1) return null
  const dragIndex = siblings.indexOf(dragId)
  const shift = dragIndex !== -1 && dragIndex < overIndex ? 1 : 0
  const position = kind === 'before' ? overIndex - shift : overIndex + 1 - shift

  return { kind, parentId, position, targetId: over.node.id }
}
