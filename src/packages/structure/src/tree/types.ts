/**
 * ROOT_ID — идентификатор виртуального корня дерева.
 *
 * Все узлы верхнего уровня (те, у которых parentId = null) при сборке
 * привязываются к ROOT_ID. Сам ROOT_ID в интерфейсе не отображается — это
 * служебный узел для единообразия: у каждого элемента есть родитель.
 */
export const ROOT_ID = '__root__'

/**
 * Item — элемент дерева «как есть».
 *
 * Содержит только данные, актуальные для отображения и идентификации:
 * - id         — UUID узла
 * - name       — отображаемое имя
 * - isFolder   — папка (может содержать дочерние узлы)
 * - resourceId — ID ресурса, если узел — лист (ресурс), иначе null
 *
 * Item хранится в ItemMap после сборки и не зависит от иерархии.
 * Иерархия задаётся отдельно через ChildrenMap и ParentsMap.
 */
export interface Item {
  id: string
  name: string
  isFolder: boolean
  resourceId: string | null
}

/**
 * Node — «сырой» узел для сборки дерева.
 *
 * Отличается от Item наличием полей parentId и position, которые нужны
 * только на этапе конструирования Tree. После сборки Tree хранит
 * иерархию в ChildrenMap, а не в отдельных Node.
 *
 * Поля:
 * - id, name, isFolder, resourceId — совпадают с Item (см. Item)
 * - parentId  — ID родителя (null для корневых узлов)
 * - position  — индекс среди соседей (порядок сортировки)
 */
export interface Node {
  id: string
  name: string
  isFolder: boolean
  resourceId: string | null
  parentId: string | null
  position: number
}

/**
 * Nodes — сокращение для Array<Node>.
 */
export type Nodes = Node[]

// --- Внутренние мапы ---

/**
 * ItemMap — O(1)-доступ к любому узлу по его ID.
 *
 * Ключ: id узла
 * Значение: Item
 */
export type ItemMap = Record<string, Item>

/**
 * ChildrenMap — иерархия «родитель → дети».
 *
 * Ключ: id родителя (или ROOT_ID для корневых узлов)
 * Значение: упорядоченный массив id дочерних узлов
 *
 * Порядок в массиве соответствует полю position,
 * гарантируется сортировкой в Tree.from().
 */
export type ChildrenMap = Record<string, string[]>

/**
 * ParentsMap — обратная связь «ребёнок → родитель».
 *
 * Используется для:
 * - O(1)-получение родителя (Tree.getParent)
 * - расчёт глубины (Tree.getDepth) — обход родителей наверх
 * - проверка принадлежности узла к папке
 *
 * Хранится как Map, а не Record, потому что:
 * - ключи динамические (ID узлов)
 * - методы .has/.get/.delete удобнее
 * - клонирование: new Map(original)
 */
export type ParentsMap = Map<string, string>
