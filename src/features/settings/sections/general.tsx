import { useCurrentLanguage, useTranslation } from '@/app/i18n'
import { useAppTheme } from '@/app/theme'
import { SETTINGS_THEME_OPTIONS, type SettingsTheme } from '@/entities/settings'
import { SelectSetting } from '../ui/fields'

export function GeneralSettings() {
  const { t } = useTranslation('settings')
  const { language, setLanguage, supported } = useCurrentLanguage()
  const { preference, setTheme } = useAppTheme()

  return (
    <div>
      <h2>{t('settings.global.title')}</h2>
      <SelectSetting
        name={t('settings.global.theme.label')}
        value={preference}
        onChange={(value) => setTheme(value as SettingsTheme)}
        options={SETTINGS_THEME_OPTIONS.map((option) => ({
          value: option,
          label: t(`settings.global.theme.${option}`),
        }))}
      />
      <SelectSetting
        name={t('settings.global.language.label')}
        value={language}
        onChange={(value) => setLanguage(value as (typeof supported)[number])}
        options={supported.map((lang) => ({
          value: lang,
          label: t(`settings.global.language.${lang}`),
        }))}
      />
    </div>
  )
}
