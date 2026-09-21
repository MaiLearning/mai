import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { StructureNodeFlat } from '../core/model'
import { fakeFetchStructure } from './fake'

export function fetchStructure(courseId: string): Promise<StructureNodeFlat[]> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeFetchStructure(courseId)

  return invoke<StructureNodeFlat[]>('get_structure', { courseId })
}
