import { useTranslation } from '@mai/i18n'
import { Text } from '@mai/theme'
import { useState } from 'react'
import type { SettingsLanguage, SettingsTheme } from '../../core'
import { useSystemSettings } from '../../hooks/useSystemSettings'
import { type SystemSettingsPatch, updateSystemSettings } from '../../services'
import { SettingsFieldRenderer } from '../field/SettingsFieldRenderer'
import { SettingsSection } from '../layout/SettingsSection'

/**
 * Системные настройки «Общие» (`system/general`): тема и язык.
 * Читает документ из стора, сохраняет патч через сервис (IPC + fake-режим).
 */
export function SystemSettingsPanel() {
  const { t } = useTranslation('settings')
  const doc = useSystemSettings()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const persist = async (patch: SystemSettingsPatch) => {
    setSaving(true)
    setError(null)
    try {
      await updateSystemSettings(patch)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const themeLabels: Record<string, string> = {
    system: t('options.theme.system'),
    light: t('options.theme.light'),
    dark: t('options.theme.dark'),
  }
  const languageLabels: Record<string, string> = {
    ru: t('options.language.ru'),
    en: t('options.language.en'),
  }

  return (
    <SettingsSection title={t('system.title')} description={t('system.description')}>
      <SettingsFieldRenderer
        fieldKey="theme"
        field={doc.settings.theme}
        label={t('system.theme.label')}
        hint={t('system.theme.hint')}
        labels={themeLabels}
        disabled={saving}
        onChange={(value) => persist({ theme: value as SettingsTheme })}
      />
      <SettingsFieldRenderer
        fieldKey="language"
        field={doc.settings.language}
        label={t('system.language.label')}
        hint={t('system.language.hint')}
        labels={languageLabels}
        disabled={saving}
        onChange={(value) => persist({ language: value as SettingsLanguage })}
      />
      {error ? (
        <Text size="xs" color="red">
          {t('system.error', { error })}
        </Text>
      ) : saving ? (
        <Text size="xs" color="gray">
          {t('system.saving')}
        </Text>
      ) : null}
    </SettingsSection>
  )
}
