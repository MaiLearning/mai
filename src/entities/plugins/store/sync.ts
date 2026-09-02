import { warn } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import type { ChangedEvent } from '@/entities/sync/protocol'
import { loadPluginsAtom } from './fetch'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * applyPluginChangeAtom — приёмник внешних изменений плагинов
 * (событие entity://changed, origin: http).
 *
 * Плагины — глобальный список → refetch без guard.
 */
export const applyPluginChangeAtom = atom(null, async (_get, set, event: ChangedEvent) => {
  try {
    await set(loadPluginsAtom)
  } catch (e) {
    warn(`Не удалось применить изменение плагина ${event.id}: ${formatError(e)}`)
  }
})
