import { DEFAULT_SETTINGS } from '../core/constants'
import type { AppSettings } from '../core/model'

/**
 * In-memory хранилище настроек — общее для обеих веток api/.
 * Backend-команд настроек пока нет: «реальная» ветка — invoke-заглушка
 * поверх этой же памяти (см. fetch.ts / update.ts).
 */
let memory: AppSettings = { ...DEFAULT_SETTINGS }

/** Копия текущего значения (иммутабельность для потребителей). */
export function readMemorySettings(): AppSettings {
  return { ...memory }
}

/** Полная замена значения. Возвращает сохранённую копию. */
export function writeMemorySettings(next: AppSettings): AppSettings {
  memory = { ...next }

  return { ...memory }
}
