import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { StructureNodeFlat } from '../core/model'
import { fakeSendCreateResource } from './fake'

export function sendCreateResource(
  courseId: string,
  name: string,
  parentId?: string | null,
  typeKey?: string | null,
): Promise<StructureNodeFlat> {
  if (import.meta.env.DEV && isFakeDataEnabled())
    return fakeSendCreateResource(courseId, name, parentId ?? null, typeKey ?? null)

  return invoke<StructureNodeFlat>('create_resource', {
    courseId,
    name,
    parentId: parentId ?? null,
    typeKey: typeKey ?? null,
  })
}
