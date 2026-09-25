import { useTranslation } from '@mai/i18n'
import { pluginSettingsDefinitionsAtom, pluginsAtom } from '@mai/plugin'
import {
  GENERAL_ITEM_ID,
  PLUGIN_DOMAIN,
  type SettingsDefinition,
  type SettingsDocument,
  SettingsLayout,
  SettingsNav,
  type SettingsNavItem,
  SettingsSchemaForm,
  SYSTEM_DOMAIN,
  settingsStateKey,
  systemSettingsDefinition,
} from '@mai/settings'
import { useAtomValue } from 'jotai'
import { Puzzle, Settings as SettingsIcon, X } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { CloseLink, Description, Header, HeaderRow, Inner, Page, Title } from './SettingsPage.style'

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
    icon: <SettingsIcon size={16} aria-hidden="true" />,
  }
}

/**
 * Страница настроек: навигация по пунктам (системные «Общие» + плагины) и форма
 * выбранного пункта. Активный пункт вычисляется из выбора: если выбранный
 * плагин отключён, показываются «Общие» — состояние выбора не переписывается.
 */
export function SettingsPage() {
  const { t, i18n } = useTranslation('settings')
  const plugins = useAtomValue(pluginsAtom)
  const registrations = useAtomValue(pluginSettingsDefinitionsAtom)
  const [selectedId, setSelectedId] = useState(settingsStateKey(SYSTEM_DOMAIN, GENERAL_ITEM_ID))

  const general = generalEntry(t('nav.general'))
  const pluginMap = new Map(plugins.map((plugin) => [plugin.id, plugin]))
  const entries: SettingsEntry[] = [
    general,
    ...registrations.map(({ pluginId, definition }): SettingsEntry => {
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
        icon: <Puzzle size={16} aria-hidden="true" />,
        disabled: plugin?.enabled === false,
      }
    }),
  ]
  const active = entries.find((entry) => entry.id === selectedId && !entry.disabled) ?? general
  const navItems: SettingsNavItem[] = entries.map(({ id, label, icon, disabled }) => ({
    id,
    label,
    icon,
    disabled,
  }))

  return (
    <Page>
      <Inner>
        <Header>
          <HeaderRow>
            <div>
              <Title>{t('nav.title')}</Title>
              <Description>{t('page.description')}</Description>
            </div>
            <CloseLink to="/home" aria-label={t('nav.close')}>
              <X size={18} aria-hidden="true" />
            </CloseLink>
          </HeaderRow>
        </Header>
        <SettingsLayout
          nav={
            <SettingsNav
              items={navItems}
              activeId={active.id}
              onSelect={setSelectedId}
              ariaLabel={t('nav.title')}
            />
          }
        >
          <SettingsSchemaForm
            key={active.id}
            domain={active.domain}
            itemId={active.itemId}
            definition={active.definition}
          />
        </SettingsLayout>
      </Inner>
    </Page>
  )
}
