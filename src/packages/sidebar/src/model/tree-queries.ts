import type { CourseNode } from './types'

/** Найти узел по id в глубину (дерево маленькое — рекурсия достаточна). */
export function findNodeById(nodes: CourseNode[], id: string): CourseNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }

  return null
}

/** Собрать множество id целевого узла и всех его потомков. */
export function collectSubtreeIds(node: CourseNode, acc: Set<string> = new Set()): Set<string> {
  acc.add(node.id)
  for (const child of node.children ?? []) collectSubtreeIds(child, acc)

  return acc
}

/** Количество ресурсов и папок в дереве. */
export function countNodes(nodes: CourseNode[]): { resources: number; folders: number } {
  let resources = 0
  let folders = 0
  const walk = (list: CourseNode[]) => {
    for (const node of list) {
      if (node.type === 'folder') {
        folders += 1
        if (node.children) walk(node.children)
      } else {
        resources += 1
      }
    }
  }
  walk(nodes)

  return { resources, folders }
}

/** Плоский список всех папок дерева (в порядке обхода сверху вниз). */
export function collectFolders(
  nodes: CourseNode[],
  acc: { id: string; title: string }[] = [],
): { id: string; title: string }[] {
  for (const node of nodes) {
    if (node.type !== 'folder') continue
    acc.push({ id: node.id, title: node.title })
    if (node.children) collectFolders(node.children, acc)
  }

  return acc
}
