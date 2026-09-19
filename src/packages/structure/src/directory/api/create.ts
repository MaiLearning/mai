import { invoke } from '@mai/tauri/ipc'
import type { StructureNodeFlat } from '../../core/model'

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
  return invoke<StructureNodeFlat>('create_directory', {
    courseId,
    name,
    parentId: parentId ?? null,
  })
}
