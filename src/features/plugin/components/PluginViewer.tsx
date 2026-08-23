import { useAtomValue } from 'jotai'
import { useTranslation } from '@/app/i18n'
import { Text } from '@/app/theme/components/Text'
import type { Plugin } from '../core/model'
import type { PluginViewerProps } from '../core/types'
import { runtimePluginsAtom } from '../store'
import { MessageRoot, ViewerRoot } from './PluginViewer.style'

/**
 * Ищет среди включённых плагинов подходящий по явному `pluginId`,
 * либо (если `pluginId` не указан) — по совпадению `data.typeKey`
 * с `plugin.typeKeys[].key`.
 */
function resolvePlugin(
  plugins: Plugin[],
  pluginId: string | undefined,
  typeKey: string | undefined,
): Plugin | undefined {
  const enabled = plugins.filter((p) => p.enabled)

  if (pluginId) {
    return enabled.find((p) => p.id === pluginId)
  }

  if (!typeKey) return undefined

  return enabled.find((p) => p.typeKeys.some((tk) => tk.key === typeKey))
}

/**
 * PluginViewer — отображает содержимое ресурса через плагин.
 *
 * Режимы поиска:
 * 1. Явный: `pluginId` указан — рендерится конкретный плагин.
 * 2. Авто-поиск: `pluginId` не указан — ищется плагин по `data.typeKey`.
 */
export function PluginViewer({ pluginId, resourceId, courseId, data }: PluginViewerProps) {
  const plugins = useAtomValue(runtimePluginsAtom)
  const { t } = useTranslation('viewer')

  const typeKey = data?.typeKey ?? undefined
  const plugin = resolvePlugin(plugins, pluginId, typeKey)

  if (!plugin) {
    return (
      <MessageRoot>
        <Text muted>
          {pluginId
            ? t('plugin_not_found', { id: pluginId })
            : t('no_plugin_for_type', { type: typeKey ?? '?' })}
        </Text>
      </MessageRoot>
    )
  }

  const ViewerComponent = typeKey ? plugin.viewers[typeKey] : undefined

  if (!ViewerComponent) {
    return (
      <MessageRoot>
        <Text muted>{t('viewer_not_registered', { type: typeKey ?? '?' })}</Text>
      </MessageRoot>
    )
  }

  return (
    <ViewerRoot>
      <ViewerComponent resourceId={resourceId} courseId={courseId} data={data} />
    </ViewerRoot>
  )
}
