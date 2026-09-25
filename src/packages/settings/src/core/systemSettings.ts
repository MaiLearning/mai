import { z } from 'zod'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  SETTINGS_LANGUAGE_OPTIONS,
  SETTINGS_THEME_OPTIONS,
} from './constants'
import { definePluginSettings } from './definition'

/**
 * Системные настройки «Общие» (`system/general`): тема оформления и язык
 * интерфейса. Рендерятся тем же `SettingsSchemaForm`, что и настройки плагинов.
 *
 * Подписи, пояснения и варианты выбора переводятся по конвенции имён полей:
 * `settings.theme.label`, `settings.theme.options.system`, … — отдельных meta
 * в схеме не требуется (см. `settingsFields`).
 */
export const systemSettingsDefinition = definePluginSettings({
  nameKey: 'system.title',
  descriptionKey: 'system.description',
  schema: z.object({
    theme: z.enum(SETTINGS_THEME_OPTIONS).default(DEFAULT_THEME),
    language: z.enum(SETTINGS_LANGUAGE_OPTIONS).default(DEFAULT_LANGUAGE),
  }),
})
