import { info, error as logError } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import { deleteNode as deleteNodeService } from '../services'
import { type Node, ROOT_ID } from '../tree'
import { RemoveAction } from './actions'
import { structureTreeAtom } from './atoms'
import { executeAction, revertAction } from './history'

/**
 * deleteNodeAtom — удаление узла.
 *
 * Optimistic: перед удалением собирает Node (с parentId и position) для
 * возможного восстановления через undo. Поддерево не сохраняется — undo
 * восстанавливает только сам узел, без детей (ограничение backend).
 *
 * sendUndo у RemoveAction выбрасывает ошибку — backend не поддерживает
 * восстановление удалённых узлов.
 */
export const deleteNodeAtom = atom(null, async (get, set, nodeId: string): Promise<void> => {
  const tree = get(structureTreeAtom)
  const item = tree.getItem(nodeId)
  if (!item) return

  const parent = tree.getParent(nodeId)
  const position = tree.getChildren(parent ?? ROOT_ID).indexOf(nodeId)
  const node: Node = {
    id: item.id,
    name: item.name,
    isFolder: item.isFolder,
    resourceId: item.resourceId,
    parentId: parent,
    position,
  }
  const action = new RemoveAction(node, parent, position)
  executeAction(get, set, action)

  try {
    await deleteNodeService(nodeId)
    info(`Узел удалён: ${nodeId}`)
  } catch (e) {
    revertAction(get, set)
    logError(`Не удалось удалить узел ${nodeId}: ${e instanceof Error ? e.message : String(e)}`)
    throw e
  }
})
