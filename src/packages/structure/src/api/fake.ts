import { fakeId, fakeNow, fakeState } from '@mai/fakeData'
import type { StructureNodeFlat } from '../core/model'

function findNode(nodeId: string): StructureNodeFlat {
  const node = fakeState.nodes.find((n) => n.id === nodeId)
  if (!node) throw new Error(`Узел структуры не найден: ${nodeId}`)

  return node
}

function nextSiblingPosition(courseId: string, parentId: string | null): number {
  const siblings = fakeState.nodes.filter((n) => n.courseId === courseId && n.parentId === parentId)

  return siblings.reduce((max, n) => Math.max(max, n.position), -1) + 1
}

function collectSubtreeIds(nodeId: string): string[] {
  const ids = [nodeId]
  const queue = [nodeId]

  while (queue.length > 0) {
    const parentId = queue.shift() as string

    for (const child of fakeState.nodes) {
      if (child.parentId === parentId) {
        ids.push(child.id)
        queue.push(child.id)
      }
    }
  }

  return ids
}

export function fakeFetchStructure(courseId: string): Promise<StructureNodeFlat[]> {
  const nodes = fakeState.nodes.filter((n) => n.courseId === courseId)

  return Promise.resolve(nodes.map((n) => ({ ...n })))
}

export function fakeSendCreateResource(
  courseId: string,
  name: string,
  parentId: string | null,
  typeKey: string | null,
): Promise<StructureNodeFlat> {
  const now = fakeNow()
  const resource = {
    id: fakeId(),
    courseId,
    typeKey,
    name,
    metadata: {},
    files: [],
    createdAt: now,
    updatedAt: now,
  }
  fakeState.resources.push(resource)
  const node: StructureNodeFlat = {
    id: fakeId(),
    courseId,
    parentId,
    position: nextSiblingPosition(courseId, parentId),
    isDirectory: false,
    resource,
    directoryId: null,
    name,
  }
  fakeState.nodes.push(node)

  return Promise.resolve({ ...node })
}

export function fakeSendMoveNode(
  nodeId: string,
  newParentId: string | null,
  position: number,
): Promise<void> {
  const node = findNode(nodeId)
  node.parentId = newParentId
  node.position = position

  return Promise.resolve()
}

export function fakeSendRenameNode(nodeId: string, name: string): Promise<void> {
  const node = findNode(nodeId)
  node.name = name
  const directory = fakeState.directories.find((d) => d.id === node.directoryId)
  const resource = fakeState.resources.find((r) => r.id === node.resource?.id)
  if (directory) directory.name = name
  if (resource) resource.name = name

  return Promise.resolve()
}

export function fakeSendDeleteNode(nodeId: string): Promise<void> {
  findNode(nodeId)
  const ids = new Set(collectSubtreeIds(nodeId))
  const removed = fakeState.nodes.filter((n) => ids.has(n.id))
  fakeState.nodes = fakeState.nodes.filter((n) => !ids.has(n.id))

  for (const node of removed) {
    if (node.directoryId) {
      const directoryId = node.directoryId
      fakeState.directories = fakeState.directories.filter((d) => d.id !== directoryId)
    }
    if (node.resource) {
      const resourceId = node.resource.id
      fakeState.resources = fakeState.resources.filter((r) => r.id !== resourceId)
    }
  }

  return Promise.resolve()
}
