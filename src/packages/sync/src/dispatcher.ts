import { warn } from '@mai/tauri/logs'
import { getDefaultStore, type WritableAtom } from 'jotai'
import { type ChangedEvent, ChangedEventSchema } from './protocol'

/**
 * Applier приёмника: write-атом сущности, обрабатывающий событие
 * (get, set, event) → void | Promise<void>.
 */
export type ChangedEventApplier = WritableAtom<null, [ChangedEvent], void | Promise<void>>

/**
 * Реестр «сущность → applier». Собирается на композиционном слое
 * (app/runner/task/initEvents.ts) — packages/sync не знает о сущностях.
 */
export type ChangedEventAppliers = Record<ChangedEvent['entity'], ChangedEventApplier>

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * Фабрика приёмной стороны синхронизации: возвращает функцию, которая
 * валидирует payload события `entity://changed` и маршрутизирует его
 * в applier соответствующей сущности из переданного реестра.
 *
 * IPC-события игнорируются: фронт уже обновил свои сторы в action atoms,
 * повторный refetch конфликтовал бы с optimistic-мутациями.
 */
export function createEventDispatcher(appliers: ChangedEventAppliers): (raw: unknown) => void {
  // Атомы живут вне React — используем дефолтный jotai-store приложения
  const defaultStore = getDefaultStore()

  return (raw: unknown): void => {
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
}
