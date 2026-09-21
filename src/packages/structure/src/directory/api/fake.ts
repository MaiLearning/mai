import { fakeId, fakeNow, fakeState } from '@mai/fakeData'
import { fakeSendDeleteNode } from '../../api/fake'
import type { StructureNodeFlat } from '../../core/model'
import type { Directory } from '../core/model'

function nextSiblingPosition(courseId: string, parentId: string | null): number {
  const siblings = fakeState.nodes.filter((n) => n.courseId === courseId && n.parentId === parentId)

  return siblings.reduce((max, n) => Math.max(max, n.position), -1) + 1
}

export function fakeFetchDirectories(courseId: string): Promise<Directory[]> {
  const directories = fakeState.directories.filter((d) => d.courseId === courseId)

  return Promise.resolve(directories.map((d) => ({ ...d })))
}

export function fakeSendCreateDirectory(
  courseId: string,
  name: string,
  parentId: string | null,
): Promise<StructureNodeFlat> {
  const now = fakeNow()
  const directory: Directory = { id: fakeId(), courseId, name, createdAt: now, updatedAt: now }
  fakeState.directories.push(directory)
  const node: StructureNodeFlat = {
    id: fakeId(),
    courseId,
    parentId,
    position: nextSiblingPosition(courseId, parentId),
    isDirectory: true,
    resource: null,
    directoryId: directory.id,
    name,
  }
  fakeState.nodes.push(node)

  return Promise.resolve({ ...node })
}

export function fakeSendDeleteDirectory(nodeId: string): Promise<void> {
  return fakeSendDeleteNode(nodeId)
}
