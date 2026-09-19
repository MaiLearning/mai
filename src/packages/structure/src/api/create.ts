import { invoke } from '@mai/tauri/ipc'
import type { StructureNodeFlat } from '../core/model'

export function sendCreateResource(
  courseId: string,
  name: string,
  parentId?: string | null,
  typeKey?: string | null,
): Promise<StructureNodeFlat> {
  return invoke<StructureNodeFlat>('create_resource', {
    courseId,
    name,
    parentId: parentId ?? null,
    typeKey: typeKey ?? null,
  })
}
