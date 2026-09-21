import { z } from 'zod'
import { SETTINGS_DOMAINS } from './constants'

/**
 * Поле настройки (self-describing): тип + параметры + дефолт + значение.
 * Значение валидирует бэкенд реестром схем — здесь только форма документа.
 */
export const SettingsFieldSchema = z.object({
  type: z.string(),
  params: z.record(z.string(), z.unknown()).optional(),
  default: z.unknown().optional(),
  value: z.unknown().optional(),
})

/** Документ настроек пункта (camelCase — как отдаёт serde на бэкенде). */
export const SettingsDocumentSchema = z.object({
  domain: z.enum(SETTINGS_DOMAINS),
  itemId: z.string(),
  settings: z.record(z.string(), SettingsFieldSchema),
  schemaVersion: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
})

/** Разбор документа настроек с проверкой формы. */
export function parseSettingsDocument(raw: unknown) {
  return SettingsDocumentSchema.parse(raw)
}
