import { sendFetchSettings } from '../api/fetch'
import { sendUpdateSettings } from '../api/update'
import type { AppSettings, UpdateSettingsInput } from '../core/model'
import { SettingsSchema, UpdateSettingsInputSchema } from '../core/schema'

/**
 * Частично обновить настройки: патч сливается с текущим значением,
 * результат сохраняется целиком. Возвращает итоговые настройки.
 */
export async function updateSettings(input: UpdateSettingsInput): Promise<AppSettings> {
  const patch = UpdateSettingsInputSchema.parse(input)
  const current = await sendFetchSettings()
  const next = SettingsSchema.parse({ ...current, ...patch })
  const saved = await sendUpdateSettings(next)

  return SettingsSchema.parse(saved)
}
