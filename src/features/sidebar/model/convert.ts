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
