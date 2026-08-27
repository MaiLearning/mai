import { useAtomValue } from 'jotai'
import { Puzzle } from 'lucide-react'
import { useTranslation } from '@/app/i18n'
import type { Plugin } from '../core/model'
import type { PluginViewerProps } from '../core/types'
import { runtimePluginsAtom } from '../store'
import {
  FallbackCard,
  FallbackDescription,
  FallbackIcon,
  FallbackTitle,
  MessageRoot,
  TypeChip,
  TypeChipLabel,
  ViewerRoot,
} from './PluginViewer.style'

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

type FallbackKind = 'plugin_not_found' | 'no_plugin_for_type' | 'no_viewer'

interface FallbackProps {
  kind: FallbackKind
  /** Параметры причины: id плагина и/или тип ресурса для чипа. */
  pluginId?: string
  type?: string
}

/** Единое empty-state «ресурс нечем отобразить»: иконка, причина, чип типа. */
function Fallback({ kind, pluginId, type }: FallbackProps) {
  const { t } = useTranslation('viewer')
  const reason =
    kind === 'plugin_not_found'
      ? t('fallback.reason_plugin_not_found', { id: pluginId ?? '?' })
      : kind === 'no_plugin_for_type'
        ? t('fallback.reason_no_plugin_for_type')
        : t('fallback.reason_no_viewer')

  return (
    <MessageRoot>
      <FallbackCard>
        <FallbackIcon>
          <Puzzle size={26} aria-hidden="true" />
        </FallbackIcon>
        <FallbackTitle>{t('fallback.title')}</FallbackTitle>
        <FallbackDescription>{reason}</FallbackDescription>
        {type && (
          <TypeChip>
            <TypeChipLabel>{t('fallback.type_label')}</TypeChipLabel>
            {type}
          </TypeChip>
        )}
      </FallbackCard>
    </MessageRoot>
  )
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
  const typeKey = data?.typeKey ?? undefined
  const plugin = resolvePlugin(plugins, pluginId, typeKey)

  if (!plugin) {
    return <Fallback kind="plugin_not_found" pluginId={pluginId} type={typeKey} />
  }

  const ViewerComponent = typeKey ? plugin.viewers[typeKey] : undefined

  if (!ViewerComponent) {
    return <Fallback kind="no_viewer" type={typeKey} />
  }

  return (
    <ViewerRoot>
      <ViewerComponent resourceId={resourceId} courseId={courseId} data={data} />
    </ViewerRoot>
  )
}
