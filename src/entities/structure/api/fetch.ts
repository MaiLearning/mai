import { invoke } from '@tauri-apps/api/core'
import type { StructureNodeFlat } from '../core/model'

export function fetchStructure(courseId: string): Promise<StructureNodeFlat[]> {
  return invoke<StructureNodeFlat[]>('get_structure', { courseId })
}
