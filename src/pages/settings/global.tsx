import { useCurrentLanguage, useTranslation } from '@/app/i18n'
import { useAppTheme } from '@/app/theme'
import { SETTINGS_THEME_OPTIONS, type SettingsTheme } from '@/entities/settings'

export function GlobalSettings() {
  const { t } = useTranslation('settings')
  const { language, setLanguage, supported } = useCurrentLanguage()
  const { preference, setTheme } = useAppTheme()

  return (
    <div>
      <h2>{t('settings.global.title')}</h2>

      <label>
        {t('settings.global.theme.label')}
        <select value={preference} onChange={(e) => setTheme(e.target.value as SettingsTheme)}>
          {SETTINGS_THEME_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`settings.global.theme.${option}`)}
            </option>
          ))}
        </select>
      </label>

      <label>
        {t('settings.global.language.label')}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as (typeof supported)[number])}
        >
          {supported.map((lang) => (
            <option key={lang} value={lang}>
              {t(`settings.global.language.${lang}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
