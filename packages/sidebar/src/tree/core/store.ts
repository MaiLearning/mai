import { Tree } from './tree'
import type { Node, Nodes } from './types'

/**
 * TreeStore — мутабельная обёртка над иммутабельным Tree.
 *
 * Зачем нужен:
 * Tree — иммутабельный класс: каждая мутация возвращает новый экземпляр.
 * React не узнаёт об изменениях сам — ему нужен механизм подписки.
 * TreeStore добавляет push-реактивность:
 *   - хранит текущий Tree как приватное поле
 *   - при мутации заменяет поле и оповещает подписчиков
 *   - React через useSyncExternalStore подписывается и узнаёт об изменениях
 *
 * Методы дублируют API Tree, но вместо возврата нового Tree
 * заменяют внутреннее состояние и вызывают notify().
 *
 * Таким образом TreeStore — это прослойка между чистыми данными (Tree)
 * и React-компонентами (hooks.ts → useSyncExternalStore).
 */
export class TreeStore {
  private tree: Tree
  private listeners = new Set<() => void>()

  constructor(nodes: Nodes) {
    this.tree = Tree.from(nodes)
  }

  /**
   * getSnapshot — возвращает текущий экземпляр Tree.
   *
   * Используется в useSyncExternalStore для получения актуального
   * состояния на каждом рендере. React сравнивает результат предыдущего
   * вызова с текущим через Object.is — если ссылка изменилась,
   * компонент ререндерится.
   */
  getSnapshot(): Tree {
    return this.tree
  }

  /**
   * subscribe — регистрирует колбэк, который React вызовет при изменении.
   *
   * Возвращает функцию отписки — React сам её вызовет при размонтировании
   * или изменении зависимостей useSyncExternalStore.
   */
  subscribe(cb: () => void): () => void {
    this.listeners.add(cb)

    return () => this.listeners.delete(cb)
  }

  /**
   * notify — оповещает всех подписчиков об изменении дерева.
   *
   * Вызывается после каждой мутации. React внутри useSyncExternalStore
   * после вызова cb перечитывает getSnapshot и сравнивает с предыдущим.
   */
  private notify(): void {
    for (const cb of this.listeners) cb()
  }

  move(id: string, newParentId: string | null, position: number): void {
    this.tree = this.tree.move(id, newParentId, position)
    this.notify()
  }

  rename(id: string, name: string): void {
    this.tree = this.tree.rename(id, name)
    this.notify()
  }

  remove(id: string): void {
    this.tree = this.tree.remove(id)
    this.notify()
  }

  insert(parentId: string, position: number, ...nodes: Node[]): void {
    this.tree = this.tree.insert(parentId, position, ...nodes)
    this.notify()
  }

  /**
   * reset — пересобирает дерево из нового плоского списка.
   *
   * Используется при загрузке структуры с бэкенда (TreeService.load)
   * и при сбросе к начальному состоянию.
   */
  reset(nodes: Nodes): void {
    this.tree = Tree.from(nodes)
    this.notify()
  }

  /**
   * apply — заменяет текущее дерево на переданное без вычислений.
   *
   * Используется:
   * - History.execute / History.revert / History.commitUndo / History.commitRedo
   *   — применить к store результат action.do() или action.undo()
   * - TreeService — откат при ошибке sendDo (revert)
   *
   * В отличие от reset, не строит новое дерево из Nodes,
   * а принимает готовый экземпляр Tree (например, результат мутации).
   */
  apply(tree: Tree): void {
    this.tree = tree
    this.notify()
  }
}
