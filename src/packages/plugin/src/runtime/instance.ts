import { PluginStore } from './PluginStore'

/**
 * Глобальный экземпляр хранилища плагинов.
 * Вынесен в отдельный модуль, чтобы избежать циклического импорта с index.ts.
 */
export const pluginStore = new PluginStore()
