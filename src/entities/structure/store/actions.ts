import { renameNode as renameNodeService } from '../services'
import { deleteNode as deleteNodeService } from '../services/delete'
import { moveNode as moveNodeService } from '../services/update'
import { type Node, ROOT_ID, type Tree } from '../tree'

/**
 * StructureAction — единица изменения дерева (Command Pattern).
 *
 * Каждое действие над деревом (move, rename, remove, create)
 * оборачивается в реализацию StructureAction. Это позволяет:
 * 1. Откатывать изменения (undo/redo)
 * 2. Синхронизировать изменения с backend (sendDo/sendUndo — через
 *    entity-сервисы structure и directory)
 * 3. Строить цепочку действий (для будущей синхронизации с ИИ-агентами)
 *
 * Контракт:
 * - do(tree)     — применить изменение, вернуть новое дерево
 * - undo(tree)   — откатить изменение, вернуть предыдущее состояние
 * - sendDo()     — отправить изменение на backend
 * - sendUndo()   — отправить отмену изменения на backend
 *
 * Мутации для undo/redo:
 * - DO:   execute (history execute → action.do + push)
 * - UNDO: sendUndo() → commitUndo (action.undo + pointer--)
 * - REDO: sendDo()   → commitRedo (action.do + pointer++)
 */
export interface StructureAction {
  do(tree: Tree): Tree
  undo(tree: Tree): Tree
  sendDo(): Promise<void>
  sendUndo(): Promise<void>
}

/**
 * MoveAction — перемещение узла внутри дерева.
 *
 * Сохраняет старую и новую позицию, чтобы можно было откатить.
 * sendDo/sendUndo симметричны — оба вызывают moveNode.
 */
export class MoveAction implements StructureAction {
  constructor(
    private nodeId: string,
    private oldParent: string | null,
    private oldPosition: number,
    private newParent: string | null,
    private newPosition: number,
  ) {}

  do(tree: Tree): Tree {
    return tree.move(this.nodeId, this.newParent, this.newPosition)
  }

  undo(tree: Tree): Tree {
    return tree.move(this.nodeId, this.oldParent, this.oldPosition)
  }

  sendDo(): Promise<void> {
    return moveNodeService(this.nodeId, this.newParent, this.newPosition)
  }

  sendUndo(): Promise<void> {
    return moveNodeService(this.nodeId, this.oldParent, this.oldPosition)
  }
}

/**
 * RenameAction — переименование узла (директории или ресурса).
 *
 * Хранит старое и новое имя для отката. Backend-вызов — renameNode
 * (structure-сервис), он сам ветвится по типу узла.
 */
export class RenameAction implements StructureAction {
  constructor(
    private nodeId: string,
    private oldName: string,
    private newName: string,
  ) {}

  do(tree: Tree): Tree {
    return tree.rename(this.nodeId, this.newName)
  }

  undo(tree: Tree): Tree {
    return tree.rename(this.nodeId, this.oldName)
  }

  sendDo(): Promise<void> {
    return renameNodeService(this.nodeId, this.newName)
  }

  sendUndo(): Promise<void> {
    return renameNodeService(this.nodeId, this.oldName)
  }
}

/**
 * RemoveAction — удаление узла.
 *
 * Хранит копию Node, чтобы можно было восстановить через insert.
 * ВАЖНО: при удалении папки её дочерние узлы НЕ сохраняются.
 * undo восстановит только саму папку, дети будут потеряны.
 * Это ограничение текущей реализации — TODO.
 *
 * sendUndo выбрасывает ошибку: backend не поддерживает восстановление
 * удалённого узла по ID. Требуется dedicated restore-endpoint или soft-delete.
 */
export class RemoveAction implements StructureAction {
  constructor(
    private node: Node,
    private oldParent: string | null,
    private oldPosition: number,
  ) {}

  do(tree: Tree): Tree {
    return tree.remove(this.node.id)
  }

  undo(tree: Tree): Tree {
    return tree.insert(this.oldParent ?? ROOT_ID, this.oldPosition, this.node)
  }

  sendDo(): Promise<void> {
    return deleteNodeService(this.node.id)
  }

  sendUndo(): Promise<void> {
    return Promise.reject(new Error('Восстановление удалённого узла не поддерживается'))
  }
}

/**
 * CreateAction — создание нового узла (папки или ресурса).
 *
 * Оборачивает узел, который уже создан на backend (create вызывается
 * до конструирования Action), поэтому sendDo — пустышка.
 * sendUndo удаляет узел с backend.
 */
export class CreateAction implements StructureAction {
  constructor(
    private node: Node,
    private parentId: string,
    private position: number,
  ) {}

  do(tree: Tree): Tree {
    return tree.insert(this.parentId, this.position, this.node)
  }

  undo(tree: Tree): Tree {
    return tree.remove(this.node.id)
  }

  sendDo(): Promise<void> {
    return Promise.resolve()
  }

  sendUndo(): Promise<void> {
    return deleteNodeService(this.node.id)
  }
}
