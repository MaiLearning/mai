import type { StructureNodeFlat } from '@/entities/structure'
import type { CourseNode } from './types'

/**
 * Конвертация плоского StructureNodeFlat[] (wire-модель сущности structure)
 * во вложенное CourseNode[] (визуальная модель sidebar-а).
 *
 * StructureNodeFlat — плоская модель с parentId/position (источник: entity-стор).
 * CourseNode — вложенная модель для рендера дерева.
 */

/** Плоский → вложенный: группировка по parentId, сортировка по position. */
export function toCourseNodes(nodes: StructureNodeFlat[]): CourseNode[] {
  const byParent = new Map<string | null, StructureNodeFlat[]>()
  for (const n of nodes) {
    const list = byParent.get(n.parentId) ?? []
    list.push(n)
    byParent.set(n.parentId, list)
  }

  const build = (parentId: string | null): CourseNode[] =>
    (byParent.get(parentId) ?? [])
      .sort((a, b) => a.position - b.position)
      .map(
        (n): CourseNode => ({
          id: n.id,
          type: n.isDirectory ? 'folder' : 'resource',
          title: n.name,
          children: n.isDirectory ? build(n.id) : undefined,
        }),
      )

  return build(null)
}

/**
 * Вычислить sibling-position узла в плоском списке после dnd.
 * Перебирает плоский список до позиции перемещённого узла и считает
 * сколько элементов с тем же parentId встретилось до него.
 */
export function siblingPositionOf(
  flat: { id: string; parentId: string | null }[],
  id: string,
): number {
  const index = flat.findIndex((item) => item.id === id)
  if (index === -1) return 0
  const target = flat[index]

  return flat.slice(0, index).filter((item) => item.parentId === target.parentId).length
}
