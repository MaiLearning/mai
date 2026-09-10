import { warn } from '@tauri-apps/plugin-log'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'
import type { PluginSettings } from '../core/schema'

function readFake(pluginId: string): PluginSettings {
  return { ...(fakeState.pluginSettings[pluginId] ?? {}) }
}

function writeFake(pluginId: string, settings: PluginSettings): PluginSettings {
  fakeState.pluginSettings[pluginId] = { ...settings }

  return readFake(pluginId)
}

/**
 * Invoke-заглушка: backend-команды настроек плагинов ещё не реализованы,
 * значение обслуживается fake-хранилищем. При появлении команд заменить
 * на `invoke('plugin_settings_get', { pluginId })` / `plugin_settings_update`.
 */
function invokeFetchPluginSettings(pluginId: string): Promise<PluginSettings> {
  warn(
    `Настройки плагина ${pluginId} читаются из invoke-заглушки: backend-команда plugin_settings_get не реализована`,
  )

  return Promise.resolve(readFake(pluginId))
}

function invokeUpdatePluginSettings(
  pluginId: string,
  settings: PluginSettings,
): Promise<PluginSettings> {
  warn(
    `Настройки плагина ${pluginId} пишутся в invoke-заглушку: backend-команда plugin_settings_update не реализована`,
  )

  return Promise.resolve(writeFake(pluginId, settings))
}

/** Прочитать значения настроек плагина. */
export function sendFetchPluginSettings(pluginId: string): Promise<PluginSettings> {
  return isFakeDataEnabled
    ? Promise.resolve(readFake(pluginId))
    : invokeFetchPluginSettings(pluginId)
}

/** Сохранить значения настроек плагина (полная замена карты). */
export function sendUpdatePluginSettings(
  pluginId: string,
  settings: PluginSettings,
): Promise<PluginSettings> {
  return isFakeDataEnabled
    ? Promise.resolve(writeFake(pluginId, settings))
    : invokeUpdatePluginSettings(pluginId, settings)
}
