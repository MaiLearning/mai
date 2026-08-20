import { useCurrentLanguage, useTranslation } from '@/app/i18n'

export function GlobalSettings() {
  const { t } = useTranslation(['common', 'settings'])
  const { language, setLanguage, supported } = useCurrentLanguage()

  return (
    <div>
      <h2>{t('settings.global.title')}</h2>

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
