import { info, error as logError } from '@tauri-apps/plugin-log'
import type { SidebarApi } from '../../deps'
import {
  CreateAction,
  CreateResourceAction,
  History,
  MoveAction,
  RemoveAction,
  RenameAction,
} from './history'
import { TreeStore } from './store'
import { type Node, ROOT_ID } from './types'

/**
 * TreeService — координатор между TreeStore, History и внедрённым SidebarApi.
 *
 * ## Роль
 *
 * TreeService — единственная точка входа для всех изменений дерева.
 * Он не принадлежит ни React, ни чистому хранилищу — он над ними.
 *
 * Пакет не знает о способе хранения данных: все операции с бэкендом идут
 * через SidebarApi, который хост внедряет через <SidebarProvider>.
 *
 * ## Паттерн работы
 *
 * ### Мутации (move, rename, remove)
 * 1. Собирает «слепок» состояния до мутации (oldParent, oldPosition, oldName)
 * 2. Создаёт Action с обоими состояниями (до и после)
 * 3. History.execute → action.do(store) — оптимистично применяет к store
 * 4. action.sendDo(api) — отправляет изменение через SidebarApi
 * 5. При ошибке: history.revert(store) — откатывает store + удаляет action
 *
 * ### Создание (create)
 * Сначала api (createDirectory), потом store (execute).
 * sendDo() для CreateAction — no-op (узел уже создан).
 *
 * ### Undo / Redo
 * Backend-first: сначала sendUndo/sendDo, потом commitUndo/commitRedo.
 * Если бэкенд упал — store не трогаем, выбрасываем ошибку.
 */
export class TreeService {
  private history = new History()

  constructor(
    private store: TreeStore,
    public api: SidebarApi,
  ) {}

  /**
   * canUndo — есть ли действие, которое можно отменить.
   * Делегируется History.canUndo.
   */
  get canUndo(): boolean {
    return this.history.canUndo
  }

  /**
   * canRedo — есть ли отменённое действие, которое можно повторить.
   * Делегируется History.canRedo.
   */
  get canRedo(): boolean {
    return this.history.canRedo
  }

  /**
   * load — первичная загрузка структуры курса.
   *
   * 1. api.fetchStructure(courseId) — через внедрённый SidebarApi
   * 2. Очищает историю (history.clear)
   * 3. Пересобирает store (store.reset)
   *
   * Вызывается из useTreeController при монтировании и смене courseId.
   */
  async load(courseId: string): Promise<void> {
    const nodes = await this.api.fetchStructure(courseId)
    this.history.clear()
    this.store.reset(nodes)
  }

  /**
   * move — перемещение узла.
   *
   * Алгоритм:
   * 1. Берёт снапшот до мутации (getSnapshot)
   * 2. Определяет старого родителя и старую позицию
   * 3. Создаёт MoveAction
   * 4. history.execute → оптимистично в store
   * 5. sendDo(api) → SidebarApi
   * 6. При ошибке: history.revert → откат store
   */
  async move(id: string, newParentId: string | null, position: number): Promise<void> {
    const snap = this.store.getSnapshot()
    const oldParent = snap.getParent(id)
    const oldPosition = snap.getChildren(oldParent ?? ROOT_ID).indexOf(id)
    const action = new MoveAction(id, oldParent, oldPosition, newParentId, position)
    this.history.execute(action, this.store)

    try {
      await action.sendDo(this.api)
    } catch (e) {
      this.history.revert(this.store)
      throw e
    }
  }

  /**
   * rename — переименование узла.
   *
   * Если узел не найден (getItem вернул undefined) — ничего не делает.
   */
  async rename(id: string, name: string): Promise<void> {
    const snap = this.store.getSnapshot()
    const item = snap.getItem(id)
    if (!item) return

    const action = new RenameAction(id, item.name, name)
    this.history.execute(action, this.store)

    try {
      await action.sendDo(this.api)
    } catch (e) {
      this.history.revert(this.store)
      throw e
    }
  }

  /**
   * remove — удаление узла.
   *
   * Перед удалением собирает Node (с parentId и position) для возможного
   * восстановления через undo. Поддерево не сохраняется — undo восстанавливает
   * только сам узел, без детей.
   *
   * sendUndo для RemoveAction выбрасывает ошибку — бэкенд не поддерживает
   * восстановление удалённых узлов по ID.
   */
  async remove(id: string): Promise<void> {
    const snap = this.store.getSnapshot()
    const item = snap.getItem(id)
    if (!item) return
    const parent = snap.getParent(id)
    const siblings = snap.getChildren(parent ?? ROOT_ID)
    const position = siblings.indexOf(id)
    const node: Node = {
      id: item.id,
      name: item.name,
      isFolder: item.isFolder,
      resourceId: item.resourceId,
      parentId: parent,
      position,
    }
    const action = new RemoveAction(node, parent, position)
    this.history.execute(action, this.store)

    try {
      await action.sendDo(this.api)
    } catch (e) {
      this.history.revert(this.store)
      throw e
    }
  }

  /**
   * create — создание новой директории.
   *
   * В отличие от других мутаций, create работает backend-first:
   * 1. api.createDirectory (возвращает готовый узел с ID)
   * 2. CreateAction.execute в store
   *
   * sendDo для CreateAction — no-op (узел уже создан на бэкенде).
   */
  async create(name: string, parentId: string | null | undefined, courseId: string): Promise<void> {
    info(`tree/service: create directory name=${name} parentId=${parentId} courseId=${courseId}`)
    try {
      const node = await this.api.createDirectory(courseId, name, parentId ?? null)
      const action = new CreateAction(node, node.parentId ?? ROOT_ID, node.position)
      this.history.execute(action, this.store)
      info(`tree/service: create directory success id=${node.id}`)
    } catch (e) {
      logError(`tree/service: create directory failed: ${e}`)
      throw e
    }
  }

  /**
   * createResource — создание нового ресурса.
   *
   * Работает backend-first аналогично create:
   * 1. api.createResource (возвращает готовый узел с ID)
   * 2. CreateResourceAction.execute в store
   */
  async createResource(
    name: string,
    parentId: string | null | undefined,
    courseId: string,
    typeKey?: string | null,
  ): Promise<void> {
    info(
      `tree/service: createResource name=${name} parentId=${parentId} courseId=${courseId} typeKey=${typeKey}`,
    )
    try {
      const node = await this.api.createResource(courseId, name, parentId ?? null, typeKey ?? null)
      const action = new CreateResourceAction(node, node.parentId ?? ROOT_ID, node.position)
      this.history.execute(action, this.store)
      info(`tree/service: createResource success id=${node.id}`)
    } catch (e) {
      logError(`tree/service: createResource failed: ${e}`)
      throw e
    }
  }

  /**
   * undo — отмена последнего действия.
   *
   * Backend-first: сначала sendUndo, потом commitUndo.
   * Если бэкенд упал — store не трогаем, выбрасываем ошибку.
   * Потребитель (хук/компонент) ловит ошибку и показывает уведомление.
   */
  async undo(): Promise<void> {
    const action = this.history.getUndoAction()
    if (!action) return

    try {
      await action.sendUndo(this.api)
    } catch {
      throw new Error('Не удалось отменить действие на сервере')
    }

    this.history.commitUndo(this.store)
  }

  /**
   * redo — повтор отменённого действия.
   *
   * Аналогично undo: backend-first → commitRedo.
   */
  async redo(): Promise<void> {
    const action = this.history.getRedoAction()
    if (!action) return

    try {
      await action.sendDo(this.api)
    } catch {
      throw new Error('Не удалось повторить действие на сервере')
    }

    this.history.commitRedo(this.store)
  }
}
