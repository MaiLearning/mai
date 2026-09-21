import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { StructureNodeFlat } from '../../core/model'
import { fakeSendCreateDirectory } from './fake'

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
  if (import.meta.env.DEV && isFakeDataEnabled())
    return fakeSendCreateDirectory(courseId, name, parentId ?? null)

  return invoke<StructureNodeFlat>('create_directory', {
    courseId,
    name,
    parentId: parentId ?? null,
  })
}
