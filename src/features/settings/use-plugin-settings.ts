import { error as logError } from '@tauri-apps/plugin-log'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import {
  loadPluginSettingsAtom,
  pluginSettingsAtom,
  updatePluginSettingAtom,
} from '@/entities/settings'
import { notifyError } from '@/utils/notifications'

export interface PluginSettingsApi {
  /** Значения настроек плагина (пустая карта до загрузки). */
  settings: Record<string, unknown>
  /** Загружены ли значения (после первой загрузки — true). */
  ready: boolean
  /** Сохранить один ключ настройки (оптимистично, с уведомлением об ошибке). */
  setSetting: (key: string, value: unknown) => void
}

/**
 * Единый API настроек плагина: чтение и запись значений.
 * Секции плагинов (и будущие external через SDK) используют его же,
 * поэтому данные и поведение одинаковы для всех.
 */
export function usePluginSettings(pluginId: string): PluginSettingsApi {
  const store = useAtomValue(pluginSettingsAtom)
  const load = useSetAtom(loadPluginSettingsAtom)
  const update = useSetAtom(updatePluginSettingAtom)
  const settings = store[pluginId]

  useEffect(() => {
    load(pluginId)
  }, [pluginId, load])

  const setSetting = useCallback(
    (key: string, value: unknown) => {
      update({ pluginId, key, value }).catch((e) => {
        const message = e instanceof Error ? e.message : String(e)
        logError(`Не удалось сохранить настройку ${key} плагина ${pluginId}: ${message}`)
        notifyError('Не удалось сохранить настройку')
      })
    },
    [pluginId, update],
  )

  return { settings: settings ?? {}, ready: settings != null, setSetting }
}
