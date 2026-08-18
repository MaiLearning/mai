import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'
import type { StructureNodeFlat } from '../core/model'

export function fetchStructure(courseId: string): Promise<StructureNodeFlat[]> {
  return isFakeDataEnabled
    ? Promise.resolve(
        fakeState.nodes.filter((node) => node.courseId === courseId).map((node) => ({ ...node })),
      )
    : invoke<StructureNodeFlat[]>('get_structure', { courseId })
}
