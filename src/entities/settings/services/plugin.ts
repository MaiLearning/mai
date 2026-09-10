import { sendFetchPluginSettings, sendUpdatePluginSettings } from '../api/plugin'
import { PluginIdSchema, type PluginSettings, PluginSettingsSchema } from '../core/schema'

/** Прочитать значения настроек плагина (валидация ключа и карты). */
export async function fetchPluginSettings(pluginId: string): Promise<PluginSettings> {
  const id = PluginIdSchema.parse(pluginId)
  const data = await sendFetchPluginSettings(id)

  return PluginSettingsSchema.parse(data)
}

/** Сохранить значения настроек плагина (полная замена карты). */
export async function updatePluginSettings(
  pluginId: string,
  settings: PluginSettings,
): Promise<PluginSettings> {
  const id = PluginIdSchema.parse(pluginId)
  const next = PluginSettingsSchema.parse(settings)
  const saved = await sendUpdatePluginSettings(id, next)

  return PluginSettingsSchema.parse(saved)
}
