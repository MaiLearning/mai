import type { z } from 'zod'
import type { KvEntrySchema } from './schema'

export type KvEntry = z.infer<typeof KvEntrySchema>
