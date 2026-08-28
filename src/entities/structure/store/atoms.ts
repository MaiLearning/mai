import { atom } from 'jotai'
import type { StructureNodeFlat } from '../core/model'
import { Tree, type Node as TreeNode } from '../tree'

/**
 * structureTreeAtom — SSOT иерархии структуры курса.
 *
 * Хранит иммутабельный Tree. Пишется только через action-атомы
 * (create/move/rename/delete/undo/redo), которые применяют History-действия.
 */
export const structureTreeAtom = atom<Tree>(Tree.from([]))

/**
 * structureFlatByIdAtom — полные payload-объекты узлов, как их вернул backend.
 *
 * Tree хранит только вычислительно значимые поля (name, isFolder, resourceId);
 * остальные (courseId, resource, directoryId) сохраняются здесь и
 * восстанавливаются в производной плоской проекции.
 */
export const structureFlatByIdAtom = atom<Record<string, StructureNodeFlat>>({})

/** Конвертация плоского wire-узла в узел сборки дерева. */
export function toTreeNode(flat: StructureNodeFlat): TreeNode {
  return {
    id: flat.id,
    name: flat.name,
    isFolder: flat.isDirectory,
    resourceId: flat.resource?.id ?? null,
    parentId: flat.parentId,
    position: flat.position,
  }
}

/**
 * Сборка wire-узла из payload-оригинала и вычисленного узла дерева.
 *
 * Инвариант: дерево владеет только name/parentId/position (и производным
 * isFolder), остальные поля переносятся из оригинала без изменений.
 */
function toFlatNode(origin: StructureNodeFlat | undefined, node: TreeNode): StructureNodeFlat {
  if (!origin) {
    return {
      id: node.id,
      courseId: '',
      parentId: node.parentId,
      position: node.position,
      isDirectory: node.isFolder,
      resource: null,
      directoryId: null,
      name: node.name,
    }
  }

  return {
    ...origin,
    name: node.name,
    parentId: node.parentId,
    position: node.position,
    isDirectory: node.isFolder,
  }
}

/**
 * structureNodesAtom — производная плоская проекция дерева.
 *
 * Публичная точка чтения структуры для потребителей сущности
 * (wire-модель StructureNodeFlat[], упорядоченная обходом вглубину).
 */
export const structureNodesAtom = atom<StructureNodeFlat[]>((get) => {
  const tree = get(structureTreeAtom)
  const source = get(structureFlatByIdAtom)

  return tree.toNodes().map((node) => toFlatNode(source[node.id], node))
})
