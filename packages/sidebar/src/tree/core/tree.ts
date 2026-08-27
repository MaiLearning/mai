import {
  type ChildrenMap,
  type Item,
  type ItemMap,
  type Node,
  type Nodes,
  type ParentsMap,
  ROOT_ID,
} from './types'

/**
 * Tree — иммутабельное дерево иерархии курса.
 *
 * ## Роль
 * Единственный источник правды (SSOT) для иерархии узлов. Любое
 * изменение (move, rename, remove, insert) возвращает НОВЫЙ экземпляр
 * Tree, не мутируя текущий. Это позволяет:
 * - Свободно сравнивать ссылки (prevTree === nextTree → нет изменений)
 * - Хранить историю для undo/redo (каждый Action хранит новое дерево
 *   после применения do/undo)
 * - Использовать useSyncExternalStore (сравнение по ссылке)
 *
 * ## Устройство
 * Tree хранит три плоские мапы, а не вложенное дерево:
 * - items     — все узлы (ItemMap, O(1) по id)
 * - children  — для каждого родителя — упорядоченный массив детей
 * - parents   — для каждого узла — его родитель (обратная связь)
 *
 * Такой подход даёт O(1) на любой запрос (getItem, getChildren,
 * getParent, getDepth) и упрощает мутации: не нужно обходить
 * и пересобирать вложенную структуру.
 *
 * ## Иммутабельность
 * Приватный конструктор — создание только через Tree.from().
 * Мутации (move/rename/remove/insert) клонируют мапы и возвращают
 * новый Tree. Старый экземпляр остаётся неизменным.
 */
export class Tree {
  private constructor(
    private readonly items: ItemMap,
    private readonly children: ChildrenMap,
    private readonly parents: ParentsMap,
  ) {}

  // =================================================================
  // Construction
  // =================================================================

  /**
   * Собрать Tree из плоского списка узлов.
   *
   * ### Алгоритм
   * 1. Проходим по всем Node, заполняем items и группируем детей
   *    по родителю во временный grouped
   * 2. Для каждого родителя сортируем детей по position и
   *    записываем в children
   * 3. Создаём ROOT_ID (виртуальный корень)
   * 4. Автоматически маркируем asFolder=true все папки, у которых
   *    есть дочерние узлы (если backend не указал isFolder)
   *
   * ### Сложность
   * O(n log n) — сортировка position внутри каждой группы.
   *
   * @param nodes — плоский список узлов от backend
   * @returns — новый экземпляр Tree
   */
  static from(nodes: Nodes): Tree {
    const items: ItemMap = {}
    const children: ChildrenMap = {}
    const parents: ParentsMap = new Map()
    const grouped: Record<string, Array<{ id: string; position: number }>> = {}

    for (const node of nodes) {
      items[node.id] = {
        id: node.id,
        name: node.name,
        isFolder: node.isFolder,
        resourceId: node.resourceId,
      }

      const parentKey = node.parentId ?? ROOT_ID
      if (!grouped[parentKey]) grouped[parentKey] = []
      grouped[parentKey].push({ id: node.id, position: node.position })
      parents.set(node.id, parentKey)
    }

    for (const [parentId, entries] of Object.entries(grouped)) {
      children[parentId] = entries.sort((a, b) => a.position - b.position).map((entry) => entry.id)
    }

    items[ROOT_ID] = { id: ROOT_ID, name: '', isFolder: true, resourceId: null }
    children[ROOT_ID] ??= []

    for (const parentId of Object.keys(children)) {
      if (parentId !== ROOT_ID && children[parentId].length > 0) {
        items[parentId] = { ...items[parentId], isFolder: true }
      }
    }

    return new Tree(items, children, parents)
  }

  // =================================================================
  // Read operations
  // =================================================================

  /**
   * Получить данные узла по ID.
   *
   * @param id — UUID узла
   * @returns — Item или undefined, если узел не найден
   */
  getItem(id: string): Item | undefined {
    return this.items[id]
  }

  /**
   * Получить упорядоченный список ID дочерних узлов.
   *
   * @param id — ID родителя (или ROOT_ID для корневых узлов)
   * @returns — массив ID детей в порядке position
   */
  getChildren(id: string): string[] {
    return this.children[id] ?? []
  }

  /**
   * Получить ID родителя узла.
   *
   * ROOT_ID скрыт от внешнего API: корневые узлы возвращают null.
   *
   * @param id — UUID узла
   * @returns — ID родителя или null (если узел корневой или не найден)
   */
  getParent(id: string): string | null {
    const parent = this.parents.get(id)

    return parent === ROOT_ID ? null : (parent ?? null)
  }

  /**
   * Рассчитать глубину узла.
   *
   * Проходит по parents наверх, считая шаги до ROOT_ID.
   * Глубина ROOT_ID не считается — корневые узлы имеют depth = 0.
   *
   * @param id — UUID узла
   * @returns — количество шагов до корня (0 для корневых узлов)
   */
  getDepth(id: string): number {
    let depth = 0
    let current = id

    while (true) {
      const parent = this.parents.get(current)
      if (!parent || parent === ROOT_ID) return depth
      depth++
      current = parent
    }
  }

  /**
   * toNodes — восстановить плоский список Node из внутренних мап.
   *
   * Обходит дерево вглубину от ROOT_ID, для каждого узла вычисляя
   * parentId (null для корневых) и position (индекс среди соседей).
   *
   * Используется хостом (через useTreeController.nodes) для конвертации
   * плоского представления во вложенное CourseNode[] и рендера дерева.
   *
   * @returns — плоский массив Node, упорядоченный обходом вглубину
   */
  toNodes(): Nodes {
    const nodes: Node[] = []
    const walk = (parentId: string) => {
      const childIds = this.children[parentId] ?? []
      childIds.forEach((id, index) => {
        const item = this.items[id]
        if (item) {
          nodes.push({
            id: item.id,
            name: item.name,
            isFolder: item.isFolder,
            resourceId: item.resourceId,
            parentId: parentId === ROOT_ID ? null : parentId,
            position: index,
          })
        }
        walk(id)
      })
    }
    walk(ROOT_ID)

    return nodes
  }

  // =================================================================
  // Internal helpers (клонирование мап)
  // =================================================================
  private cloneItems(): ItemMap {
    return { ...this.items }
  }

  /** Клонировать ChildrenMap (каждый массив копируется отдельно) */
  private cloneChildren(): ChildrenMap {
    const out: ChildrenMap = {}
    for (const key of Object.keys(this.children)) {
      out[key] = [...this.children[key]]
    }

    return out
  }

  /** Клонировать ParentsMap (через конструктор Map) */
  private cloneParents(): ParentsMap {
    return new Map(this.parents)
  }

  // =================================================================
  // Mutations (все возвращают новый Tree, текущий не меняется)
  // =================================================================

  /**
   * Переместить узел в другую папку (или на другую позицию).
   *
   * ### Алгоритм
   * 1. Удалить id из children[oldParent]
   * 2. Вставить id в children[newParent] по индексу position
   * 3. Обновить parents[id] → newParent
   * 4. Если newParent не ROOT_ID — пометить его как isFolder
   *
   * @param id — UUID перемещаемого узла
   * @param newParentId — ID нового родителя (null = корень)
   * @param position — новая позиция среди соседей
   * @returns — новый Tree с перемещённым узлом
   */
  move(id: string, newParentId: string | null, position: number): Tree {
    const oldParent = this.parents.get(id)
    if (!oldParent) return this
    const targetParent = newParentId ?? ROOT_ID
    const items = this.cloneItems()
    const children = this.cloneChildren()
    const parents = this.cloneParents()
    const oldSiblings = children[oldParent]
    if (oldSiblings) {
      children[oldParent] = oldSiblings.filter((sib) => sib !== id)
    }

    if (!children[targetParent]) children[targetParent] = []
    children[targetParent].splice(position, 0, id)
    parents.set(id, targetParent)

    if (targetParent !== ROOT_ID) {
      items[targetParent] = { ...items[targetParent], isFolder: true }
    }

    return new Tree(items, children, parents)
  }

  /**
   * Переименовать узел.
   *
   * @param id — UUID узла
   * @param name — новое имя
   * @returns — новый Tree с переименованным узлом
   */
  rename(id: string, name: string): Tree {
    const item = this.items[id]
    if (!item) return this

    return new Tree({ ...this.items, [id]: { ...item, name } }, this.children, this.parents)
  }

  /**
   * Удалить узел и всех его потомков.
   *
   * ### Алгоритм
   * 1. Собрать все ID для удаления (рекурсивно по children)
   * 2. Удалить из children[parent] ссылку на удаляемый узел
   * 3. Очистить items, children, parents для всех собранных ID
   *
   * ### Важно
   * Удаление необратимо — все дочерние узлы теряются безвозвратно.
   * Для восстановления нужен отдельный Action с сохранением всего
   * поддерева (см. RemoveAction в history.ts).
   *
   * @param id — UUID удаляемого узла
   * @returns — новый Tree без указанного узла и его потомков
   */
  remove(id: string): Tree {
    if (id === ROOT_ID) return this

    const parentKey = this.parents.get(id)
    if (!parentKey) return this

    const items = this.cloneItems()
    const children = this.cloneChildren()
    const parents = this.cloneParents()
    const toRemove = new Set<string>()
    const collect = (nodeId: string) => {
      toRemove.add(nodeId)
      for (const childId of children[nodeId] ?? []) {
        collect(childId)
      }
    }
    collect(id)

    children[parentKey] = (children[parentKey] ?? []).filter((sib) => !toRemove.has(sib))

    for (const removeId of toRemove) {
      delete items[removeId]
      delete children[removeId]
      parents.delete(removeId)
    }

    return new Tree(items, children, parents)
  }

  /**
   * Вставить один или несколько узлов в указанную позицию.
   *
   * Используется при создании нового узла (CreateAction) и при
   * отмене удаления (RemoveAction.undo).
   *
   * @param parentId — ID родителя (или ROOT_ID/null для корня)
   * @param position — индекс вставки (0 = в начало)
   * @param nodes — один или несколько Node для вставки
   * @returns — новый Tree с вставленными узлами
   */
  insert(parentId: string, position: number, ...nodes: Node[]): Tree {
    const items = this.cloneItems()
    const children = this.cloneChildren()
    const parents = this.cloneParents()
    const targetParent = parentId ?? ROOT_ID

    if (!children[targetParent]) children[targetParent] = []

    for (const node of nodes) {
      items[node.id] = {
        id: node.id,
        name: node.name,
        isFolder: node.isFolder,
        resourceId: node.resourceId,
      }
      children[targetParent].splice(position, 0, node.id)
      parents.set(node.id, targetParent)
      position++
    }

    if (targetParent !== ROOT_ID) {
      items[targetParent] = { ...items[targetParent], isFolder: true }
    }

    return new Tree(items, children, parents)
  }
}
