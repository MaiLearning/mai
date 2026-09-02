import { warn } from '@tauri-apps/plugin-log'
import { getDefaultStore } from 'jotai'
import { applyCourseChangeAtom } from '@/entities/course'
import { applyDirectoryChangeAtom } from '@/entities/directory'
import { applyPluginChangeAtom } from '@/entities/plugins'
import { applyResourceChangeAtom, applyResourceTypeChangeAtom } from '@/entities/resource'
import { applyStructureChangeAtom } from '@/entities/structure'
import { type ChangedEvent, ChangedEventSchema } from './protocol'

const appliers = {
  course: applyCourseChangeAtom,
  structure: applyStructureChangeAtom,
  directory: applyDirectoryChangeAtom,
  resource: applyResourceChangeAtom,
  resourceType: applyResourceTypeChangeAtom,
  plugin: applyPluginChangeAtom,
}

// Атомы живут вне React — используем дефолтный jotai-store приложения
// (тот же подход, что в features/plugin/store/PluginStore.ts)
const defaultStore = getDefaultStore()

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

function runApplier(applier: (typeof appliers)[keyof typeof appliers], event: ChangedEvent): void {
  try {
    const result = defaultStore.set(applier, event)
    if (result instanceof Promise) {
      // Fire-and-forget: applier ловит свои ошибки сам, здесь — страховка
      result.catch((e) => {
        warn(`Ошибка обработки события entity://changed (${event.entity}): ${formatError(e)}`)
      })
    }
  } catch (e) {
    warn(`Ошибка обработки события entity://changed (${event.entity}): ${formatError(e)}`)
  }
}

/**
 * Точка входа приёмной стороны синхронизации: валидирует payload события
 * `entity://changed` и маршрутизирует его в applier соответствующей сущности.
 *
 * IPC-события игнорируются: фронт уже обновил свои сторы в action atoms,
 * повторный refetch конфликтовал бы с optimistic-мутациями.
 */
export function dispatchChangedEvent(raw: unknown): void {
  const parsed = ChangedEventSchema.safeParse(raw)
  if (!parsed.success) {
    warn(`Событие entity://changed с невалидным payload: ${parsed.error.message}`)

    return
  }

  const event = parsed.data
  if (event.origin === 'ipc') return

  const applier = appliers[event.entity]
  if (!applier) {
    warn(`Событие entity://changed о неизвестной сущности: ${event.entity}`)

    return
  }

  runApplier(applier, event)
}
