import { invoke } from '@tauri-apps/api/core'
import type { StructureNodeFlat } from '@/entities/structure/core/model'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeId, fakeNow, fakeState } from '@/utils/fake-entities-storage/state'

/**
 * Создание директории.
 *
 * Контракт совпадает с backend-командой create_directory: ответ — плоский
 * узел структуры (StructureNodeFlat), без меток времени (они остаются в БД
 * и читаются через get_directories).
 */
export function sendCreateDirectory(
  courseId: string,
  name: string,
  parentId?: string | null,
): Promise<StructureNodeFlat> {
  const resolvedParentId = parentId ?? null

  if (!isFakeDataEnabled)
    return invoke<StructureNodeFlat>('create_directory', {
      courseId,
      name,
      parentId: resolvedParentId,
    })

  const id = fakeId()
  const timestamp = fakeNow()
  const node: StructureNodeFlat = {
    id,
    courseId,
    parentId: resolvedParentId,
    position: fakeState.nodes.filter((item) => item.parentId === resolvedParentId).length,
    isDirectory: true,
    resource: null,
    directoryId: id,
    name,
  }
  fakeState.directories.push({ id, courseId, name, createdAt: timestamp, updatedAt: timestamp })
  fakeState.nodes.push(node)

  return Promise.resolve(node)
}
