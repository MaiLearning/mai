import { z } from 'zod'
import { MAX_KEY_LENGTH } from './constants'

/**
 * Ключ KV-хранилища.
 * Правила зеркалят валидацию бэкенда (services/kv/rules.rs):
 * только [a-zA-Z0-9._:/-], до 256 символов.
 */
export const KvKeySchema = z
  .string()
  .min(1)
  .max(MAX_KEY_LENGTH)
  .regex(/^[a-zA-Z0-9._:/-]+$/)

/** Запись KV-хранилища (camelCase — как отдаёт serde на бэкенде). */
export const KvEntrySchema = z.object({
  key: z.string(),
  value: z.unknown(),
  createdAt: z.number(),
  updatedAt: z.number(),
})
