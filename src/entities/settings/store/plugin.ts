import { atom } from 'jotai'
import type { PluginSettings } from '../core/schema'
import { fetchPluginSettings, updatePluginSettings } from '../services/plugin'

/** Кэш значений настроек по pluginId. */
export const pluginSettingsAtom = atom<Record<string, PluginSettings>>({})

/** Загрузить значения настроек плагина в кэш. */
export const loadPluginSettingsAtom = atom(null, async (_get, set, pluginId: string) => {
  const settings = await fetchPluginSettings(pluginId)
  set(pluginSettingsAtom, (prev) => ({ ...prev, [pluginId]: settings }))
})

interface UpdatePluginSettingParams {
  pluginId: string
  key: string
  value: unknown
}

/**
 * Обновить один ключ настроек плагина: оптимистичная запись в кэш,
 * сохранение полной карты; при ошибке — откат и проброс исключения
 * (хук-потребитель ловит и уведомляет).
 */
export const updatePluginSettingAtom = atom(
  null,
  async (get, set, { pluginId, key, value }: UpdatePluginSettingParams) => {
    const current = get(pluginSettingsAtom)[pluginId] ?? {}
    const next = { ...current, [key]: value }
    set(pluginSettingsAtom, (prev) => ({ ...prev, [pluginId]: next }))

    try {
      const saved = await updatePluginSettings(pluginId, next)
      set(pluginSettingsAtom, (prev) => ({ ...prev, [pluginId]: saved }))
    } catch (e) {
      set(pluginSettingsAtom, (prev) => ({ ...prev, [pluginId]: current }))
      throw e
    }
  },
)
