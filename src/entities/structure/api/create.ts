import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeId, fakeNow, fakeState } from '@/utils/fake-entities-storage/state'
import type { StructureNodeFlat } from '../core/model'

export function sendCreateResource(
  courseId: string,
  name: string,
  parentId?: string | null,
  typeKey?: string | null,
): Promise<StructureNodeFlat> {
  if (!isFakeDataEnabled)
    return invoke<StructureNodeFlat>('create_resource', {
      courseId,
      name,
      parentId: parentId ?? null,
      typeKey: typeKey ?? null,
    })
  const timestamp = fakeNow()
  const resource = {
    id: fakeId(),
    courseId,
    typeKey: typeKey ?? null,
    name,
    metadata: {},
    files: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  fakeState.resources.push(resource)
  const node: StructureNodeFlat = {
    id: fakeId(),
    courseId,
    parentId: parentId ?? null,
    position: fakeState.nodes.filter((item) => item.parentId === (parentId ?? null)).length,
    isDirectory: false,
    resource,
    directoryId: null,
    name,
  }
  fakeState.nodes.push(node)
  return Promise.resolve(node)
}
