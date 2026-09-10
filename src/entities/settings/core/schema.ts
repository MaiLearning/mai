import { z } from 'zod'

/**
 * Варианты темы оформления. Список расширяемый: новое значение добавляется
 * сюда и в registry тем приложения (app/theme) — схема и UI подхватят его.
 */
export const SETTINGS_THEME_OPTIONS = ['system', 'light', 'dark'] as const

/** Поддерживаемые языки интерфейса. */
export const SETTINGS_LANGUAGE_OPTIONS = ['ru', 'en'] as const

export const SettingsThemeSchema = z.enum(SETTINGS_THEME_OPTIONS)

/** Идентификатор плагина в настройках. */
export const PluginIdSchema = z.string().min(1).max(256)

/**
 * Значения настроек плагина: карта «ключ настройки → значение».
 * Типы значений знает только сам плагин — хранилище агностично.
 */
export const PluginSettingsSchema = z.record(z.string(), z.unknown())
export type PluginSettings = z.infer<typeof PluginSettingsSchema>
export type SettingsTheme = z.infer<typeof SettingsThemeSchema>

export const SettingsLanguageSchema = z.enum(SETTINGS_LANGUAGE_OPTIONS)
export type SettingsLanguage = z.infer<typeof SettingsLanguageSchema>

export const SettingsSchema = z.object({
  theme: SettingsThemeSchema,
  language: SettingsLanguageSchema,
})

/** Частичное обновление: передаются только изменяемые поля. */
export const UpdateSettingsInputSchema = z.object({
  theme: SettingsThemeSchema.optional(),
  language: SettingsLanguageSchema.optional(),
})
