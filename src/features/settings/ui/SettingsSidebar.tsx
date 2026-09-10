import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSettingsGroups } from '../registry'
import { Group, GroupHeader, IconLabel, Item, ItemIcon, Root, Title } from './SettingsSidebar.style'

/** Сайдбар настроек: заголовок, группы разделов, активный раздел. */
export function SettingsSidebar() {
  const { t } = useTranslation('settings')
  const groups = useSettingsGroups()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Root aria-label={t('settings.title')}>
      <Title>{t('settings.title')}</Title>
      {groups.map((group) => (
        <Group key={group.id}>
          {group.header && <GroupHeader>{group.header}</GroupHeader>}
          {group.sections.map((section) => {
            const path = section.path ?? `/settings/${section.id}`
            const active = pathname === path || pathname.startsWith(`${path}/`)

            return (
              <Item key={section.id} type="button" $active={active} onClick={() => navigate(path)}>
                <ItemIcon as={section.icon} size={16} strokeWidth={1.5} />
                <IconLabel>{section.label}</IconLabel>
              </Item>
            )
          })}
        </Group>
      ))}
    </Root>
  )
}
