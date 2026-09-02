import { warn } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import { refetchStructureIfLoaded } from '@/entities/structure'
import type { ChangedEvent } from '@/entities/sync/protocol'
import { loadResourceTypesAtom } from './fetch'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * applyResourceChangeAtom — приёмник внешних изменений ресурсов
 * (событие entity://changed, origin: http).
 *
 * Ресурс виден в UI только в узлах дерева (встроенный payload), поэтому
 * реакция — refetch дерева structure курса (если оно открыто), через
 * refetchStructureIfLoaded. Список resourcesAtom не имеет загрузчика —
 * не трогается.
 */
export const applyResourceChangeAtom = atom(null, async (get, set, event: ChangedEvent) => {
  try {
    if (!event.courseId) return
    await refetchStructureIfLoaded(get, set, event.courseId)
  } catch (e) {
    warn(`Не удалось применить изменение ресурса ${event.id}: ${formatError(e)}`)
  }
})

/**
 * applyResourceTypeChangeAtom — приёмник внешних изменений типов ресурсов.
 * Типы — глобальный список → refetch без guard.
 */
export const applyResourceTypeChangeAtom = atom(null, async (_get, set, event: ChangedEvent) => {
  try {
    await set(loadResourceTypesAtom)
  } catch (e) {
    warn(`Не удалось применить изменение типа ресурсов ${event.id}: ${formatError(e)}`)
  }
})
