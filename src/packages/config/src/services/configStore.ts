import { error } from '@mai/tauri/logs'
import { atom, getDefaultStore } from 'jotai'
import { sendConfigGet } from '../api/getConfig'
import { subscribeConfigChanged } from '../api/subscribeConfig'
import { defaultConfig } from '../core/defaults'
import type { AppConfig } from '../core/schema'
import { parseAppConfig } from '../core/schema'

/** Текущий конфиг приложения. До инициализации — заготовка по умолчанию. */
export const appConfigAtom = atom<AppConfig>(defaultConfig)

/**
 * Готовность конфига к работе приложения. Выставляется композиционным слоем
 * (таска `initConfigTask`) после загрузки конфига и настройки его потребителей.
 * До этого рендер приложения приостановлен.
 */
export const configReadyAtom = atom(false)

const store = getDefaultStore()

function apply(next: AppConfig): void {
  store.set(appConfigAtom, next)
}

function parseOrWarn(raw: unknown): AppConfig | null {
  try {
    return parseAppConfig(raw)
  } catch (e) {
    error(`Не удалось распарсить конфиг: ${e instanceof Error ? e.message : String(e)}`)

    return null
  }
}

let watching = false

function activateWatch(): void {
  if (watching) return
  watching = true

  subscribeConfigChanged((raw) => {
    const next = parseOrWarn(raw)
    if (next) apply(next)
  }).catch((e) => {
    error(
      `Не удалось подписаться на изменения конфига: ${e instanceof Error ? e.message : String(e)}`,
    )
  })
}

/**
 * Инициализация конфига на старте приложения:
 * первичное чтение через invoke + подписка на событие `config://changed`.
 * Бэкенд недоступен (нет Tauri) — фолбэк на конфиг по умолчанию.
 */
export async function initAppConfig(): Promise<AppConfig> {
  activateWatch()

  let raw: unknown = null
  try {
    raw = await sendConfigGet()
  } catch (e) {
    error(`Не удалось прочитать конфиг: ${e instanceof Error ? e.message : String(e)}`)
  }

  const next = raw !== null ? parseOrWarn(raw) : null
  if (next) apply(next)

  return store.get(appConfigAtom)
}

/** Текущий конфиг (после initAppConfig). */
export function getAppConfig(): AppConfig {
  return store.get(appConfigAtom)
}
