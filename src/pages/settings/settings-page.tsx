import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { SettingsSearch, SettingsSidebar } from '@/features/settings'
import { Main, MainArea, Shell } from './settings-page.style'

/**
 * Страница настроек — композиция: слева сайдбар с группами разделов,
 * справа топбар с поиском и main-область с активной секцией.
 * Вся система настроек живёт в features/settings.
 */
export function SettingsPage() {
  const { t } = useTranslation('settings')

  return (
    <Shell aria-label={t('settings.title')}>
      <SettingsSidebar />
      <MainArea>
        <SettingsSearch />
        <Main>
          <Outlet />
        </Main>
      </MainArea>
    </Shell>
  )
}
