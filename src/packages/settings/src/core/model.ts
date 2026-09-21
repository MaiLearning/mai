import type { z } from 'zod'
import type { SettingsDocumentSchema, SettingsFieldSchema } from './schema'

export type SettingsDocument = z.infer<typeof SettingsDocumentSchema>
export type SettingsField = z.infer<typeof SettingsFieldSchema>
