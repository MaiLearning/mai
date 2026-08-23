import { PluginStore } from './PluginStore'

export { runtimePluginsAtom } from './atoms'
export { PluginStore } from './PluginStore'

/**
 * Глобальный экземпляр хранилища плагинов.
 */
export const pluginStore = new PluginStore()
