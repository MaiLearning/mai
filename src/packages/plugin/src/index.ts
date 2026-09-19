// Entity «plugins» (записи из БД)
export * from './core'
// Gateway плагинов
export type { GatewayManifest, GatewayMethodInfo } from './gateway'
export {
  callGateway,
  fetchGatewayManifests,
  GatewayCallError,
  parseGatewayRejection,
} from './gateway'
// Локали
export { pluginI18NResources } from './locales'
export { runtimePluginsAtom } from './runtime/atoms'
export { loadPlugins, resolveTypeKeys } from './runtime/init'
export { pluginStore } from './runtime/instance'
// Рантайм-реестр плагинов
export { RuntimePlugin } from './runtime/model'
export { PluginStore } from './runtime/PluginStore'
export { getInternalViewer, registerInternalViewer, setInternalViewers } from './runtime/registry'
export type { PluginRenderProps, PluginTypeKey, PluginViewerProps } from './runtime/types'
export * from './store'
// Просмотр ресурса через плагин
export { PluginViewer } from './viewer/PluginViewer'
export { Bounded } from './viewer/shared.style'
export { Viewer } from './viewer/Viewer'
