import { invoke } from '@mai/tauri/ipc'
import type { StructureNodeFlat } from '../core/model'

export function fetchStructure(courseId: string): Promise<StructureNodeFlat[]> {
  return invoke<StructureNodeFlat[]>('get_structure', { courseId })
}
