import { info, error as logError } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import { renameDirectory as renameDirectoryService } from '../../directory/services'
import { moveNode as moveNodeService } from '../services'
import { ROOT_ID } from '../tree'
import { MoveAction, RenameAction } from './actions'
import { structureTreeAtom } from './atoms'
import { executeAction, revertAction } from './history'

/**
 * moveNodeAtom — перемещение узла (dnd или «переместить в папку»).
 *
 * Optimistic: History.execute применяет MoveAction к дереву сразу,
 * затем sendDo отправляет изменение на backend. При ошибке backend —
 * revertAction откатывает дерево и удаляет действие из истории.
 */
export const moveNodeAtom = atom(
  null,
  async (
    get,
    set,
    input: { nodeId: string; newParentId: string | null; position: number },
  ): Promise<void> => {
    const tree = get(structureTreeAtom)
    if (!tree.getItem(input.nodeId)) return

    const oldParent = tree.getParent(input.nodeId)
    const oldPosition = tree.getChildren(oldParent ?? ROOT_ID).indexOf(input.nodeId)
    const action = new MoveAction(
      input.nodeId,
      oldParent,
      oldPosition,
      input.newParentId,
      input.position,
    )
    executeAction(get, set, action)

    try {
      await moveNodeService(input.nodeId, input.newParentId, input.position)
      info(`Узел перемещён: ${input.nodeId}`)
    } catch (e) {
      revertAction(get, set)
      logError(
        `Не удалось переместить узел ${input.nodeId}: ${e instanceof Error ? e.message : String(e)}`,
      )
      throw e
    }
  },
)

/**
 * renameNodeAtom — переименование узла.
 *
 * Optimistic, как moveNodeAtom. Backend-контракт: переименование идёт
 * через renameDirectory (directory-сервис) для любых узлов.
 * Если узел не найден — ничего не делает.
 */
export const renameNodeAtom = atom(
  null,
  async (get, set, input: { nodeId: string; name: string }): Promise<void> => {
    const item = get(structureTreeAtom).getItem(input.nodeId)
    if (!item) return

    const action = new RenameAction(input.nodeId, item.name, input.name)
    executeAction(get, set, action)

    try {
      await renameDirectoryService(input.nodeId, input.name)
      info(`Узел переименован: ${input.nodeId}`)
    } catch (e) {
      revertAction(get, set)
      logError(
        `Не удалось переименовать узел ${input.nodeId}: ${e instanceof Error ? e.message : String(e)}`,
      )
      throw e
    }
  },
)
