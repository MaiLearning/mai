import type { SidebarApi } from '../../deps'
import { TreeStore } from './store'
import type { Tree } from './tree'
import { type Action, type Node, ROOT_ID } from './types'

// ================================================================
//  Реализации Action
// ================================================================

/**
 * MoveAction — перемещение узла внутри дерева.
 *
 * Сохраняет старую и новую позицию, чтобы можно было откатить.
 * sendDo/sendUndo симметричны — оба вызывают moveNode через SidebarApi.
 */
export class MoveAction implements Action {
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

  sendDo(api: SidebarApi): Promise<void> {
    return api.moveNode(this.nodeId, this.newParent, this.newPosition)
  }

  sendUndo(api: SidebarApi): Promise<void> {
    return api.moveNode(this.nodeId, this.oldParent, this.oldPosition)
  }
}
/**
 * RenameAction — переименование узла.
 *
 * Хранит старое и новое имя для отката.
 */
export class RenameAction implements Action {
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

  sendDo(api: SidebarApi): Promise<void> {
    return api.renameDirectory(this.nodeId, this.newName)
  }

  sendUndo(api: SidebarApi): Promise<void> {
    return api.renameDirectory(this.nodeId, this.oldName)
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
export class RemoveAction implements Action {
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

  sendDo(api: SidebarApi): Promise<void> {
    return api.deleteNode(this.node.id)
  }

  sendUndo(): Promise<void> {
    throw new Error('Восстановление удалённого узла не поддерживается')
  }
}
/**
 * CreateAction — создание нового узла.
 *
 * Оборачивает узел, который уже создан на backend (create вызывается
 * до конструирования Action), поэтому sendDo — пустышка.
 * sendUndo удаляет узел с backend.
 */
export class CreateAction implements Action {
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

  sendUndo(api: SidebarApi): Promise<void> {
    return api.deleteNode(this.node.id)
  }
}

/**
 * CreateResourceAction — создание нового ресурса.
 *
 * Аналогична CreateAction: ресурс уже создан на backend,
 * поэтому sendDo — пустышка. sendUndo удаляет ресурс с backend.
 */
export class CreateResourceAction implements Action {
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

  sendUndo(api: SidebarApi): Promise<void> {
    return api.deleteNode(this.node.id)
  }
}

// ================================================================
//  History — цепочка действий с указателем
// ================================================================

/**
 * History — управление цепочкой Action для undo/redo.
 *
 * Вместо двух стеков (past/future) используется один массив
 * и указатель (pointer) на текущее применённое действие.
 *
 * Схема:
 *   actions = [A1, A2, A3, A4]
 *   pointer = 2  (применены A1..A3)
 *
 *   canUndo = pointer >= 0              → A3 можно отменить
 *   canRedo = pointer < actions.length-1 → A4 можно повторить
 *
 * При execute нового действия всё, что было после pointer,
 * отбрасывается (actions.length = pointer + 1). Это стандартное
 * поведение undo/redo: новое действие = новая ветка, future сбрасывается.
 *
 * Для undo/redo используется двухфазный подход (см. TreeService):
 * 1. Сначала проверяется backend (sendUndo/sendDo)
 * 2. После успеха вызывается commitUndo/commitRedo, который применяет
 *    действие к store и двигает pointer
 *
 * При ошибке sendDo в execute (оптимистичное обновление) вызывается
 * revert — откат действия в store + удаление из цепочки.
 */
export class History {
  private actions: Action[] = []
  private pointer = -1

  get canUndo(): boolean {
    return this.pointer >= 0
  }

  get canRedo(): boolean {
    return this.pointer < this.actions.length - 1
  }

  /**
   * execute — применить новое действие и добавить в историю.
   *
   * 1. Обрезает future (всё после pointer)
   * 2. Добавляет action в конец
   * 3. Двигает pointer
   * 4. Применяет action.do() к store
   *
   * Вызывается из TreeService перед sendDo.
   * Если sendDo упадёт — TreeService вызовет revert().
   */
  execute(action: Action, store: TreeStore): void {
    this.actions.length = this.pointer + 1
    this.actions.push(action)
    this.pointer++
    store.apply(action.do(store.getSnapshot()))
  }

  /**
   * revert — откат последнего действия (при ошибке sendDo).
   *
   * 1. Применяет action.undo() к store
   * 2. Удаляет action из цепочки (обрезка до pointer)
   *
   * После revert указатель возвращается на предыдущее действие,
   * а упавший action исчезает из истории.
   */
  revert(store: TreeStore): void {
    if (this.pointer < 0) return
    const action = this.actions[this.pointer]
    store.apply(action.undo(store.getSnapshot()))
    this.actions.length = this.pointer
    this.pointer--
  }

  /**
   * getUndoAction — получить действие для отмены (без изменения pointer).
   *
   * Возвращает текущее действие (на которое указывает pointer).
   * Используется в TreeService.undo() перед sendUndo.
   */
  getUndoAction(): Action | null {
    return this.canUndo ? this.actions[this.pointer] : null
  }

  /**
   * getRedoAction — получить действие для повтора (без изменения pointer).
   *
   * Возвращает следующее действие (pointer + 1).
   * Используется в TreeService.redo() перед sendDo.
   */
  getRedoAction(): Action | null {
    return this.canRedo ? this.actions[this.pointer + 1] : null
  }

  /**
   * commitUndo — применить отмену к store и сдвинуть pointer назад.
   *
   * Вызывается ПОСЛЕ успешного sendUndo на backend.
   * 1. Берёт action по текущему pointer
   * 2. Применяет action.undo() к store
   * 3. Двигает pointer на один шаг назад
   */
  commitUndo(store: TreeStore): void {
    if (!this.canUndo) return
    const action = this.actions[this.pointer]
    store.apply(action.undo(store.getSnapshot()))
    this.pointer--
  }

  /**
   * commitRedo — применить повтор к store и сдвинуть pointer вперёд.
   *
   * Вызывается ПОСЛЕ успешного sendDo на backend.
   * 1. Двигает pointer на один шаг вперёд
   * 2. Берёт action по новому pointer
   * 3. Применяет action.do() к store
   */
  commitRedo(store: TreeStore): void {
    if (!this.canRedo) return
    this.pointer++
    const action = this.actions[this.pointer]
    store.apply(action.do(store.getSnapshot()))
  }

  /**
   * clear — сбросить историю.
   *
   * Очищает массив действий и сбрасывает pointer.
   * Вызывается при загрузке новой структуры курса (TreeService.load).
   */
  clear(): void {
    this.actions = []
    this.pointer = -1
  }
}
