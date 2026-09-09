import type { z } from 'zod'
import type { SettingsSchema, UpdateSettingsInputSchema } from './schema'

export type AppSettings = z.infer<typeof SettingsSchema>
export type UpdateSettingsInput = z.infer<typeof UpdateSettingsInputSchema>
