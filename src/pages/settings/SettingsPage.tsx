import { useTranslation } from '@mai/i18n'
import { pluginSettingsDefinitionsAtom, pluginsAtom } from '@mai/plugin'
import {
  GENERAL_ITEM_ID,
  PLUGIN_DOMAIN,
  type SettingsDefinition,
  type SettingsDocument,
  SettingsLayout,
  SettingsNav,
  type SettingsNavGroup,
  type SettingsNavItem,
  SettingsSchemaForm,
  SYSTEM_DOMAIN,
  settingsStateKey,
  systemSettingsDefinition,
} from '@mai/settings'
import { Breadcrumbs, Icon, PageHeader } from '@mai/theme'
import { useAtomValue } from 'jotai'
import { type ReactNode, useState } from 'react'
import { CloseLink, Page } from './SettingsPage.style'

/** Пункт страницы настроек: ключ состояния, определение и данные для навигации. */
type SettingsEntry = {
  /** Идентификатор пункта: совпадает с ключом состояния настроек `domain:itemId`. */
  id: string
  domain: SettingsDocument['domain']
  itemId: string
  definition: SettingsDefinition
  label: string
  icon: ReactNode
  disabled?: boolean
}

/** Пункт «Общие» — системные настройки, всегда доступен и всегда первый. */
function generalEntry(label: string): SettingsEntry {
  return {
    id: settingsStateKey(SYSTEM_DOMAIN, GENERAL_ITEM_ID),
    domain: SYSTEM_DOMAIN,
    itemId: GENERAL_ITEM_ID,
    definition: systemSettingsDefinition,
    label,
    icon: <Icon name="settings" size="sm" aria-hidden="true" />,
  }
}

/** Данные пункта для навигации. */
function toNavItem({ id, label, icon, disabled }: SettingsEntry): SettingsNavItem {
  return { id, label, icon, disabled }
}

/**
 * Страница настроек: навигация по пунктам (системные «Общие» + плагины) и
 * форма выбранного пункта. Заголовок, описание и хлебные крошки — в шапке
 * раздела. Активный пункт вычисляется из выбора: если выбранный плагин
 * отключён, показываются «Общие» — состояние выбора не переписывается.
 */
export function SettingsPage() {
  const { t, i18n } = useTranslation('settings')
  const plugins = useAtomValue(pluginsAtom)
  const registrations = useAtomValue(pluginSettingsDefinitionsAtom)
  const [selectedId, setSelectedId] = useState(settingsStateKey(SYSTEM_DOMAIN, GENERAL_ITEM_ID))

  const general = generalEntry(t('nav.general'))
  const pluginMap = new Map(plugins.map((plugin) => [plugin.id, plugin]))
  const pluginEntries: SettingsEntry[] = registrations.map(({ pluginId, definition }) => {
    const plugin = pluginMap.get(pluginId)
    const fallback = definition.nameKey
      ? i18n.t(definition.i18nNamespace, definition.nameKey, { defaultValue: pluginId })
      : pluginId

    return {
      id: settingsStateKey(PLUGIN_DOMAIN, pluginId),
      domain: PLUGIN_DOMAIN,
      itemId: pluginId,
      definition,
      label: plugin?.name ?? String(fallback),
      icon: <Icon name="puzzle" size="sm" aria-hidden="true" />,
      disabled: plugin?.enabled === false,
    }
  })
  const entries = [general, ...pluginEntries]
  const active = entries.find((entry) => entry.id === selectedId && !entry.disabled) ?? general

  const groups: SettingsNavGroup[] = [
    { id: 'system', title: t('nav.title'), items: [toNavItem(general)] },
    { id: 'plugins', title: t('nav.plugins'), items: pluginEntries.map(toNavItem) },
  ].filter((group) => group.items.length > 0)

  const activeDescription = active.definition.descriptionKey
    ? i18n.t(active.definition.i18nNamespace, active.definition.descriptionKey, {
        defaultValue: t('page.description'),
      })
    : t('page.description')

  return (
    <Page>
      <SettingsLayout
        nav={
          <SettingsNav
            groups={groups}
            activeId={active.id}
            onSelect={setSelectedId}
            ariaLabel={t('nav.title')}
          />
        }
      >
        <PageHeader
          title={active.label}
          description={activeDescription}
          breadcrumbs={
            <Breadcrumbs
              ariaLabel={t('nav.breadcrumbs')}
              items={[{ label: t('nav.title') }, { label: active.label, current: true }]}
            />
          }
          actions={
            <CloseLink to="/home" aria-label={t('nav.close')}>
              <Icon name="close" size="lg" aria-hidden="true" />
            </CloseLink>
          }
        />
        <SettingsSchemaForm
          key={active.id}
          domain={active.domain}
          itemId={active.itemId}
          definition={active.definition}
        />
      </SettingsLayout>
    </Page>
  )
}
