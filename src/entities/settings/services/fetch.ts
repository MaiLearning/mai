import { sendFetchSettings } from '../api/fetch'
import type { AppSettings } from '../core/model'
import { SettingsSchema } from '../core/schema'

/** Прочитать настройки, провалидировав ответ схемой. */
export async function fetchSettings(): Promise<AppSettings> {
  const data = await sendFetchSettings()

  return SettingsSchema.parse(data)
}
