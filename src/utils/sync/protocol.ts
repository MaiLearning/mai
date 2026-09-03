import { z } from 'zod'

/**
 * Контракт payload Tauri-события `entity://changed`, публикуемого backend'ом
 * после мутаций. Источник истины приёмной стороны sync.
 */
export const ChangedEventSchema = z.object({
  entity: z.enum(['course', 'structure', 'directory', 'resource', 'resourceType', 'plugin']),
  action: z.enum(['created', 'updated', 'deleted']),
  id: z.string(),
  courseId: z.string().nullable(),
  origin: z.enum(['ipc', 'http']),
  timestamp: z.number(),
})

export type ChangedEvent = z.infer<typeof ChangedEventSchema>
